import express from "express";
import Stripe from "stripe";
import moment from "moment";
import validUrl from "valid-url";
import mongoose from "mongoose";
import PublisherModel from "../models/publisher.js";
import MetricsModel, {
  PAGEVIEW_ANONYMOUS,
  PAGEVIEW_JUST_PURCHASED,
  PAGEVIEW_NOT_PURCHASED,
} from "../models/metrics.js";
import PurchasesModel, {
  PURCHASES_STATUS_PAID,
  PURCHASES_STATUS_UNPAID,
} from "../models/purchases.js";
import { getUrlData } from "../services/utilsService.js";
import NotOwnerError from "../errors/NotOwnerError.js";
import PremiumContentModel, {
  PREMIUMCONTENT_STATUS_DELETED,
  PREMIUMCONTENT_STATUS_ACTIVE,
  PREMIUMCONTENT_STATUS_INACTIVE,
  NO_CREDENTIAL,
  VERIFICATION_METHOD_ZKP,
} from "../models/premiumContent.js";
import { AMOUNT_TO_DISPLAY } from "../Const.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const feePercent = 5;
const stripeFee = 2.9;
const calculateFee = (purcharseAmount) =>
  ((feePercent + stripeFee) * purcharseAmount) / 100;

const router = express.Router();

const CHART_DAYS = 90;

router.get("/previewUrl", async (req, res) => {
  const { url } = req.query;
  const publisherId = res.locals.userId;

  if (!validUrl.isWebUri(url)) {
    console.log(`User ${publisherId} tried to add an invalid url: ${url}`);
    return res.status(400).send({ error: "Invalid URL" });
  }

  let urlData;
  try {
    urlData = await getUrlData(url, publisherId);
  } catch (err) {
    if (err instanceof NotOwnerError) {
      return res
        .status(400)
        .send({ error: "You are not the owner of this URL" });
    }
    console.log(`Error getting data from URL ${url} - Error: ${err.message}`);
  }

  res.json({
    url: url,
    title: urlData?.title || url,
    image: urlData?.image || "",
    domain: urlData?.domain || "",
  });
});

router.get("/premiumContent", async (req, res) => {
  const publisherId = res.locals.userId;

  const response = await PublisherModel.findOne({ id: publisherId }).populate(
    {
      path:"premiumContent",
      match: { status: { $in: [PREMIUMCONTENT_STATUS_ACTIVE,PREMIUMCONTENT_STATUS_INACTIVE] } },
    }
  );
  console.log(response.premiumContent);
  res.json(response ? response.premiumContent : []);
});

router.put("/premiumContent", async (req, res) => {
  const { url, domain, image, title, amount, age, verification_type } = req.body;
  const publisherId = res.locals.userId;

  const exists = await PremiumContentModel.findOne({
    publisherId: publisherId,
    url,
  });
  if (exists && exists?.status === PREMIUMCONTENT_STATUS_ACTIVE) {
    return res.status(400).json({ error: "This content is already premium" });
  }

  try {
    const premiumContent = await PremiumContentModel.findByIdAndUpdate(
      { _id: exists?._id || new mongoose.Types.ObjectId() },
      {
        publisherId,
        url,
        amount,
        // TODO: Add the currency in the request parameters
        currency: "EUR",
        title,
        image,
        domain,
        age: age || NO_CREDENTIAL,
        verification_type: verification_type || age? VERIFICATION_METHOD_ZKP : NO_CREDENTIAL, 
        status: PREMIUMCONTENT_STATUS_ACTIVE,
      },
      { upsert: true, new: true }
    );
    const response = await PublisherModel.findOneAndUpdate(
      { id: publisherId },
      { $addToSet: { premiumContent: premiumContent._id } },
      { upsert: true, new: true }
    ).populate(
      {
        path:"premiumContent",
        match: { status: { $in: [PREMIUMCONTENT_STATUS_ACTIVE,PREMIUMCONTENT_STATUS_INACTIVE] } },
      }
    );

    return res.json(response.premiumContent);
  } catch (err) {
    console.error("Error saving premium content: ", err);
    return res.status(500).json({ error: "Error saving premium content" });
  }
});

router.put("/premiumContentStatus", async (req, res) => {
  const { url } = req.query;
  const publisherId = res.locals.userId;
  try {
    await PremiumContentModel.findOneAndUpdate(
      { publisherId, url },
      { $set: { status: PREMIUMCONTENT_STATUS_INACTIVE } },
      { upsert: true, new: true }
    );
    const response = await PublisherModel.findOne({ id: publisherId }).populate(
      {
        path:"premiumContent",
        match: { status: { $in: [PREMIUMCONTENT_STATUS_ACTIVE,PREMIUMCONTENT_STATUS_INACTIVE] } },
      }
    );
    res.json(response.premiumContent);
  } catch (err) {
    console.error("Error changing status of premium content: ", err);
    return res.status(500).json({ error: "Error changing status of premium content" });
  }
});

router.delete("/premiumContent", async (req, res) => {
  const { url } = req.query;
  const publisherId = res.locals.userId;

  try {
    await PremiumContentModel.findOneAndUpdate(
      { publisherId, url },
      { $set: { status: PREMIUMCONTENT_STATUS_DELETED } },
      { upsert: true, new: true }
    );
    const response = await PublisherModel.findOne({ id: publisherId }).populate(
      {
        path:"premiumContent",
        match: { status: { $in: [PREMIUMCONTENT_STATUS_ACTIVE,PREMIUMCONTENT_STATUS_INACTIVE] } },
      }
    );
    res.json(response.premiumContent);
  } catch (err) {
    console.error("Error deleting premium content: ", err);
    return res.status(500).json({ error: "Error deleting premium content" });
  }
});

router.get("/info", async (req, res) => {
  const publisherId = res.locals.userId;
  const [visitsRows, purchases] = await Promise.all([
    MetricsModel.aggregate([
      {
        $match: {
          publisherId,
          type: {
            $in: [
              PAGEVIEW_ANONYMOUS,
              PAGEVIEW_NOT_PURCHASED,
              PAGEVIEW_JUST_PURCHASED,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$sessionId",
        },
      },
    ]),
    PurchasesModel.aggregate([
      { $match: { publisherId } },
      {
        $group: {
          _id: "$publisherId",
          numPurchases: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  const visits = visitsRows.length;
  const incomes = purchases.length
    ? AMOUNT_TO_DISPLAY(purchases[0].totalAmount)
    : 0;
  const contents = purchases.length ? purchases[0].numPurchases : 0;
  const conversion = (contents / visits) * 100;

  res.json({
    incomes,
    contents,
    visits,
    conversion,
  });
});

router.get("/bestContents", async (req, res) => {
  const publisherId = res.locals.userId;
  const [metrics, publisher] = await Promise.all([
    await MetricsModel.aggregate([
      {
        $match: {
          publisherId,
          type: {
            $in: [
              PAGEVIEW_ANONYMOUS,
              PAGEVIEW_NOT_PURCHASED,
              PAGEVIEW_JUST_PURCHASED,
            ],
          },
        },
      },
      {
        $group: {
          _id: {
            sessionId: "$sessionId",
            premiumContentId: "$premiumContentId",
          },
          types: { $addToSet: "$type" },
        },
      },
      {
        $group: {
          _id: "$_id.premiumContentId",
          visits: { $sum: 1 },
          purchasedVisits: {
            $sum: { $cond: [{ $in: ["JUST_PURCHASED", "$types"] }, 1, 0] },
          },
        },
      },
      {
        $addFields: {
          conversion: {
            $round: [
              {
                $multiply: [{ $divide: ["$purchasedVisits", "$visits"] }, 100],
              },
              2,
            ],
          },
        },
      },
      {
        $sort: { conversion: 1 },
      },
      {
        $limit: 5,
      },
    ]),
    PublisherModel.findOne({ id: publisherId }).populate("premiumContent"),
  ]);

  let bestContents = await Promise.all(
    metrics.map(async (metric) => {
      const contentInfo = publisher.premiumContent.find(
        (content) => String(content._id) === String(metric._id)
      );
      const purchases = await PurchasesModel.find({
        publisherId,
        premiumContentId: metric._id,
      });

      if(!contentInfo){
        return
      }
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
        totalAmount: purchases.reduce(
          (total, purchase) => total + purchase.amount,
          0
        ),
        payments: purchases.length,
      };
    })
  );

  bestContents = bestContents.filter((content) => !!content)

  res.json(bestContents);
});

router.get("/chart", async (req, res) => {
  const publisherId = res.locals.userId;
  const days = CHART_DAYS;
  const [metrics, purchases] = await Promise.all([
    MetricsModel.aggregate([
      {
        $match: {
          publisherId,
          type: {
            $in: [
              PAGEVIEW_ANONYMOUS,
              PAGEVIEW_NOT_PURCHASED,
              PAGEVIEW_JUST_PURCHASED,
            ],
          },
          createdAt: { $gte: moment().subtract(days, "days").toDate() },
        },
      },
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            sessionId: "$sessionId",
          },
          day: {
            $first: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
          },
        },
      },
      {
        $group: {
          _id: "$day",
          visits: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]),
    PurchasesModel.aggregate([
      {
        $match: {
          publisherId,
          createdAt: { $gte: moment().subtract(days, "days").toDate() },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          numPurchases: { $sum: 1 },
        },
      },
    ]),
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

router.get("/unpaid-balance", async (req, res) => {
  const publisherId = res.locals.userId;
  console.table({ publisherId });

  try {
    const purchases = await PurchasesModel.find({
      publisherId,
      status: PURCHASES_STATUS_UNPAID,
    });
    const unpaidBalance = purchases.reduce(
      (total, purchase) => (total || 0) + purchase.amount,
      0
    );
    const fee = calculateFee(unpaidBalance);
    return res.status(200).json({ unpaidBalance: unpaidBalance - fee });
  } catch (err) {
    console.error("Error returning unpaid balance : ", err);
    return res.status(500).json({ error: "Error returning unpaid balance" });
  }
});

router.post("/pay-to-stripe", async (req, res) => {
  const publisherId = res.locals.userId;
  console.table({ publisherId });
  let unpaidBalance = 0;
  let purchases = [];

  try {
    purchases = await PurchasesModel.find({
      publisherId,
      status: PURCHASES_STATUS_UNPAID,
    });
    unpaidBalance = purchases.reduce(
      (total, purchase) => (total || 0) + purchase.amount,
      0
    );
  } catch (err) {
    console.error("Error returning calculating balance : ", err);
    return res
      .status(500)
      .json({ error: "Error returning calculating balance" });
  }

  const publisher = await PublisherModel.findOne({ id: publisherId });

  const stripeAccountId = publisher?.stripeAccountId;
  if (!stripeAccountId) {
    console.error("Error User does not have a stripe account ");
    console.log(`publisherId: ${publisherId}`);
    return res
      .status(400)
      .json({ error: "Error User does not have a stripe account" });
  }
  const fee = calculateFee(unpaidBalance);
  try {
    const transfer = await stripe.transfers.create({
      amount: unpaidBalance - fee,
      currency: "eur",
      destination: stripeAccountId,
      description: "pay to publisher stripe account",
      metadata: { publisherId },
    });
  } catch (err) {
    console.error("Error in transference : ", err);
    return res.status(500).json({ error: "Error in transference" });
  }

  try {
    purchases.forEach(async (purchase) => {
      await PurchasesModel.findOneAndUpdate(
        { _id: purchase._id },
        { $set: { status: PURCHASES_STATUS_PAID } },
        { upsert: true, new: true }
      );
    });
  } catch (err) {
    console.error(
      "Error changing status of purchases content from unpaid to paid : ",
      err
    );
    console.log(purchases);
    return res
      .status(500)
      .json({ error: "Error changing status of purchases content" });
  }

  return res.status(200).json({ paidBalance: unpaidBalance - fee });
});

router.get("/account", async (req, res) => {
  const publisherId = res.locals.userId;

  try {
    const publisher = await PublisherModel.findOne({ id: publisherId });

    return res.status(200).json(publisher);
  } catch (err) {
    console.error("Error returning connected account : ", err);
    return res.status(500).json({ error: "Error returning connected account" });
  }
});

router.post("/account", async (req, res) => {
  const publisherId = res.locals.userId;

  try {
    const account = await stripe.accounts.create({
      type: "standard",
    });

    const publisher = await PublisherModel.findOne({ id: publisherId });
    if (publisher.stripeAcountId) {
      throw new Error("Error publisher already have an account");
    }
    publisher.stripeAccountId = account.id;

    await publisher.save();

    return res.status(200).json({ stripeAccountId: account.id });
  } catch (err) {
    console.error("Error creating connected account : ", err);
    return res.status(500).json({ error: "Error creating connected account" });
  }
});

router.post("/account-link", async (req, res) => {
  const { stripeAccountId } = req.body;

  try {
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${req.headers.referer}publishers/settings`,
      return_url: `${req.headers.referer}publishers`,
      type: "account_onboarding",
    });

    return res.status(200).json({
      url: accountLink.url,
      expires_at: accountLink.expires_at,
    });
  } catch (err) {
    console.error("Error creating account link: ", err);
    return res.status(500).json({ error: "Error creating account link" });
  }
});

router.put("/contentId", async (req, res) => {
  let { contentIdType, contentIdValue } = req.query;
  console.log(req.query)
  console.table({contentIdType, contentIdValue})
  const publisherId = res.locals.userId;
  try {
    const response = await PublisherModel.findOneAndUpdate(
      { id: publisherId },
      { $set: { 
          contentIdType,
          contentIdValue, 
        } 
      },
      { upsert: true, new: true }
    );
    console.log(response)
    contentIdType = response.contentIdType;
    contentIdValue  = response.contentIdValue; 
    res.json({ contentIdType,contentIdValue});
  } catch (err) {
    console.error("Error updating content type and value: ", err);
    return res.status(500).json({ error: "Error updating content type and value" });
  }

});

router.get("/contentId", async (req, res) => {
  const publisherId = res.locals.userId;
  try {
    const publisher = await PublisherModel.findOne({id: publisherId});
    const { contentIdType, contentIdValue } = publisher;
    res.json({ contentIdType, contentIdValue });
  } catch (err) {
    console.error("Error getting content type and value: ", err);
    return res.status(500).json({ error: "Error getting content type and value" });
  }

});

export default router;