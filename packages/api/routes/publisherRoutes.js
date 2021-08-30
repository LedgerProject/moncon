import express from 'express';
import moment from 'moment';
import validUrl from 'valid-url';
import mongoose from 'mongoose';
import PublisherModel from '../models/publisher.js';
import MetricsModel, { PAGEVIEW_ANONYMOUS, PAGEVIEW_JUST_PURCHASED, PAGEVIEW_NOT_PURCHASED } from '../models/metrics.js';
import PurchasesModel from '../models/purchases.js';
import { getUrlData } from '../services/utilsService.js';
import NotOwnerError from '../errors/NotOwnerError.js';
import PremiumContentModel, { PREMIUMCONTENT_STATUS_DELETED, PREMIUMCONTENT_STATUS_ACTIVE } from '../models/premiumContent.js';

const router = express.Router();

const CHART_DAYS = 90;

router.get('/previewUrl', async (req, res) => {
  const { url } = req.query;
  const publisherId = res.locals.userId;

  if (!validUrl.isWebUri(url)) {
    console.log(`User ${publisherId} tried to add an invalid url: ${url}`);
    return res.status(400).send({ error: 'Invalid URL' });
  }

  let urlData;
  try {
    urlData = await getUrlData(url, publisherId);
  } catch (err) {
    if (err instanceof NotOwnerError) {
      return res.status(400).send({ error: 'You are not the owner of this URL' });
    }
    console.log(`Error getting data from URL ${url} - Error: ${err.message}`);
  }

  res.json({
    url: url,
    title: urlData?.title || url,
    image: urlData?.image || '',
    domain: urlData?.domain || '',
  });
});

router.get('/premiumContent', async (req, res) => {
  const publisherId = res.locals.userId;
  
  const response = await PublisherModel.findOne({ id: publisherId }).populate('premiumContent');
  res.json(response ? response.premiumContent : []);
});

router.put('/premiumContent', async (req, res) => {
  const { url, domain, image, title, amount } = req.body;
  const publisherId = res.locals.userId;
  const exists = await PremiumContentModel.findOne({
    publisherId: publisherId,
    url,
  });
  if (exists && exists?.status === PREMIUMCONTENT_STATUS_ACTIVE) {
    return res.status(400).json({ error: 'This content is already premium'});
  }

  try {
    const premiumContent = await PremiumContentModel.findByIdAndUpdate(
      { _id: exists?._id || new mongoose.Types.ObjectId() },
      {
        publisherId,
        url,
        amount,
        // TODO: Add the currency in the request parameters
        currency: 'EUR',
        title,
        image,
        domain,
        status: PREMIUMCONTENT_STATUS_ACTIVE,
      },
      { upsert: true, new: true },
    );
    const response = await PublisherModel.findOneAndUpdate(
      { id: publisherId },
      { $addToSet: { premiumContent: premiumContent._id } },
      { upsert: true, new: true },
    ).populate('premiumContent');

    return res.json(response.premiumContent);
  } catch (err) {
    console.error('Error saving premium content: ', err);
    return res.status(500).json({ error: 'Error saving premium content'});
  }
});

router.delete('/premiumContent', async (req, res) => {
  const { url } = req.query;
  const publisherId = res.locals.userId;
  try {
    await PremiumContentModel.findOneAndUpdate(
      { publisherId, url },
      { $set : { 'status': PREMIUMCONTENT_STATUS_DELETED } },
      { upsert: true, new: true },
    );
    const response = await PublisherModel.findOne({ id: publisherId }).populate('premiumContent');
    res.json(response.premiumContent);
  } catch (err) {
    console.error('Error deleting premium content: ', err);
    return res.status(500).json({ error: 'Error deleting premium content'});
  }
});

router.get('/info', async (req, res) => {
  const publisherId = res.locals.userId;
  const [ visitsRows, purchases ] = await Promise.all([
    MetricsModel.aggregate(
      [
        { 
          $match: {
            publisherId,
            type: { $in: [ PAGEVIEW_ANONYMOUS, PAGEVIEW_NOT_PURCHASED, PAGEVIEW_JUST_PURCHASED ] },
          }
        },
        { 
          $group: {
            _id: '$sessionId',
          }
        },
      ]
    ),
    PurchasesModel.aggregate(
      [
        { $match: { publisherId } },
        {
          $group: {
            _id: '$publisherId',
            numPurchases: { $sum: 1 },
            totalAmount: { $sum: '$amount'},
          }
        },
      ]
    )
  ]);
  
  const visits = visitsRows.length;
  const incomes = purchases.length ? purchases[0].totalAmount : 0;
  const contents = purchases.length ? purchases[0].numPurchases : 0;
  const conversion = (contents / visits) * 100;

  res.json({
    incomes, contents, visits, conversion
  });
});

router.get('/bestContents', async (req, res) => {
  const publisherId = res.locals.userId;
  const [ metrics, publisher ] = await Promise.all([
    await MetricsModel.aggregate(
      [
        {
          $match: { 
            publisherId,
            type: { $in: [ PAGEVIEW_ANONYMOUS, PAGEVIEW_NOT_PURCHASED, PAGEVIEW_JUST_PURCHASED ] },
          }
        },
        {
          $group: {
            _id: { sessionId: '$sessionId', premiumContentId: '$premiumContentId' },
            types: { $addToSet: "$type" },
          }
        },
        {
          $group: {
            _id: '$_id.premiumContentId',
            visits: { $sum: 1 },
            purchasedVisits: { $sum: { $cond: [{ $in: [ 'JUST_PURCHASED', '$types' ] }, 1, 0] } }
          }
        },
        {
          $addFields: {
            conversion: { $round: [ { $multiply: [ { $divide: [ '$purchasedVisits', '$visits' ] }, 100 ] }, 2 ] },
          },
        },
        {
          $sort: { conversion: 1 },
        },
        {
          $limit: 5,
        },
      ],
    ),
    PublisherModel.findOne({ id: publisherId }).populate('premiumContent'),
  ]);

  const bestContents = await Promise.all(metrics.map(async (metric) => {
    const contentInfo = publisher.premiumContent.find((content) => String(content._id) === String(metric._id));
    const purchases = await PurchasesModel.find({ publisherId, premiumContentId: metric._id });
    
    return {
      premiumContentId: metric._id,
      url: contentInfo.url,
      title: contentInfo.title,
      image: contentInfo.image,
      domain: contentInfo.domain,
      amount: contentInfo.amount,
      currency: contentInfo.currency,
      status: contentInfo.status,
      visits: metric.visits,
      conversion: metric.conversion,
      totalAmount: purchases.reduce((total, purchase) => total + purchase.amount, 0),
      payments: purchases.length,
    }
  }));

  res.json(bestContents);
});

router.get('/chart', async (req, res) => {
  const publisherId = res.locals.userId;
  const days = CHART_DAYS;
  const [ metrics, purchases ] = await Promise.all([
    MetricsModel.aggregate(
      [
        {
          $match: { 
            publisherId,
            type: { $in: [ PAGEVIEW_ANONYMOUS, PAGEVIEW_NOT_PURCHASED, PAGEVIEW_JUST_PURCHASED ] },
            createdAt: { $gte: moment().subtract(days, 'days').toDate() },
          }
        },
        {
          $group: {
            _id : { day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, sessionId: '$sessionId' },
            day: { $first: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } }
          }
        },
        {
          $group: {
            _id: '$day',
            visits: { $sum: 1 },
          }
        },
        {
          $sort: { _id: 1 },
        },
      ],
    ),
    PurchasesModel.aggregate(
      [
        {
          $match: {
            publisherId,
            createdAt: { $gte: moment().subtract(days, 'days').toDate() },
          }
        },
        {
          $group: {
            _id : { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            numPurchases: { $sum: 1 },
          }
        },
      ]
    ),
  ]);

  const response = metrics.map((metric) => {
    const unlocks = purchases.find((item) => item._id === metric._id);
    return {
      day: metric._id,
      visits: metric.visits,
      unlocks: unlocks?.numPurchases || 0,
    };
  });

  res.json(response);
});

router.get('/paymentPointer', async (req,res) => {
  const publisherId = res.locals.userId;
  const publisher = await PublisherModel.findOne({ id: publisherId });
  res.json(publisher?.paymentPointer || '');
});

router.post('/paymentPointer', async (req, res) => {
  const publisherId = res.locals.userId;
  const { paymentPointer } = req.body;
  try {
    const publisher = await PublisherModel.findOneAndUpdate(
      { id: publisherId },
      { $set : { 'paymentPointer':  paymentPointer } },
      { upsert: true, new: true },
    );
    
    res.json(publisher.paymentPointer);
  } catch (err) {
    console.log(err.message);
    res.status(500).send({ error: err.message });
  }
})

export default router;
