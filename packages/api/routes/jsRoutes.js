import express from 'express';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';
import PublisherModel from '../models/publisher.js';
import MetricsModel, { PAGEVIEW_ANONYMOUS, PAGEVIEW_NOT_PURCHASED, PAGEVIEW_JUST_PURCHASED, PAGEVIEW_PREVIOUSLY_PURCHASED } from '../models/metrics.js';
import PurchasesModel, { PURCHASES_STATUS_PAID, PURCHASES_STATUS_UNPAID } from '../models/purchases.js';
import UserModel from '../models/user.js';
import admin from '../services/firebaseService.js';
import PremiumContentModel, { PREMIUMCONTENT_STATUS_ACTIVE } from '../models/premiumContent.js';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/pageview', async (req, res) => {
  const { publisherId, url, sessionId, justPurchased, token } = req.body;
  let userId = req.body.userId;

  console.log('/pageview in jsRoutes');
  console.table({ publisherId, userId, url, sessionId, justPurchased, token });
  console.log('token', token)

  if (token) {
    // verifies secret and checks exp
    try{
      jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
          if (err) {
              console.log('error decoding token', err)
          }
        console.log(decoded)
        if(!userId){
          userId = decoded?.userId;
          console.log('userId',userId)
        }
      });
    }catch(err){
      console.error('Error decoding token: ', err.message);
    }
  }

  const publisher = await PublisherModel.findOne({ id: publisherId }).populate('premiumContent');
  if (!publisher) {
    return res.status(400).send('Invalid publisher id');
  }
  
  let isLoggedIn = false;
  let userBalance = 0;
  if (userId) {
    const user = await UserModel.findOne({ id: userId });
    if (userId) {
      isLoggedIn = true;
    }else{
      try{
        await UserModel.create({ id: userId });
        isLoggedIn = true;
      }catch{
        console.log('error creating user')
      }
    }
  }

  // TODO: Check if there is a better comparison instead of ===
  const premiumContent = publisher.premiumContent.find((premiumContent) => premiumContent.url === url);
  const isPremium = premiumContent && premiumContent.status === PREMIUMCONTENT_STATUS_ACTIVE;
  let isPurchased = false;
  if (isPremium) {
    let pageViewType = PAGEVIEW_ANONYMOUS;
    if (isLoggedIn) {
      console.log({ 
          userId,
          publisherId, 
          premiumContentId: premiumContent._id 
        });
      isPurchased = await PurchasesModel.exists(
        { 
          userId,
          publisherId, 
          premiumContentId: premiumContent._id 
        }
      );
      pageViewType = isPurchased ? ( justPurchased ? PAGEVIEW_JUST_PURCHASED : PAGEVIEW_PREVIOUSLY_PURCHASED ) : PAGEVIEW_NOT_PURCHASED;
    }    

    console.log('storing metrics')
    
    MetricsModel.create({
      publisherId,
      userId,
      sessionId,
      premiumContentId: premiumContent._id,
      type: pageViewType,      
    });
  }

  return res.status(200).json({
    isPremium,
    isLoggedIn,
    isPurchased,
    userBalance,
    stripeAccountId: publisher.stripeAccountId,
    content: !isPremium ? {} : {
      id: premiumContent._id,
      amount: premiumContent.amount,
      currency: premiumContent.currency,
      age: premiumContent.age,
      url: premiumContent.url,
      title: premiumContent.title,
      image: premiumContent.image,
    },
  });
});

router.post('/purchase', async (req, res) => {
  const { publisherId, contentId, userId, subscriptionId } = req.body;

  console.log('/purchase in jsRoutes');
  console.table({ publisherId, contentId, userId, subscriptionId })
  
  const premiumContent = await PremiumContentModel.findById(contentId);

  if (!premiumContent) {
    console.error(`Invalid content -> id: ${contentId}`);
    return res.status(400).json({ error: 'Invalid content' });
  }

  const { _id, amount, currency } = premiumContent;

  const publisher = await PublisherModel.findOne({ id: publisherId });
  if (!publisher) {
    return res.status(400).send('Invalid publisher id');
  }

  const user = await UserModel.findOne({ id: userId });

  if(!user) {
    try{
      await UserModel.create({ id: userId });
    }catch{
      console.log('error creating user')
      return res.status(500).json({error:'error creating user'})
    }
  }

  const purchaseExist = await PurchasesModel.findOne({
      userId,
      publisherId,
      premiumContentId: contentId,
    });

  if(purchaseExist) {
    console.error(`User ${userId} already purchase this content: ${contentId}`);
    return res.status(400).json({ error: 'User already purchase this content' });
  }

  try {

    const subscription = await stripe.subscriptions.retrieve(
      subscriptionId
    );

    console.log('retrieving subscription in /purchase in jsRoutes ');
    console.log('subscription',subscription);
    if(!subscription){
      console.log(`Invalid subscription -> id: ${subscriptionId}`)
      return res.status(400).json({ error: 'Subscription does not exist' });
    }

    if(subscription.status !== 'active'){
      console.log(`Incorrect subscription -> id: ${subscriptionId}`)
      return res.status(400).json({ error: 'Incorrect subscription' });
    }

    /*
    if(subscription.transfer_data.destination !== publisher.stripeAccountId){
      console.log(`Incorrect subscription -> id: ${subscriptionId}`)
      console.log('the destination account is not the same as the publisher account');
      console.table({
        publisher_account_id:publisher.stripeAccountId,
        subscription_destination_account_id: subscription.transfer_data.destination,
      });
      return res.status(400).json({ error: 'Incorrect payment destination' }); 
    }
    */

    const invoice = await stripe.invoices.retrieve(
      subscription.latest_invoice
    );

    console.log('invoice',invoice);
    if (!invoice.paid && !(amount_paid == amount)) {
      console.log(invoice)
      return res.status(500).json({ error: 'Payment was not successful' });
    }

    const deleted = await stripe.subscriptions.del(
      subscriptionId
    );

  } catch (err) {
    console.log('Error checking stripe payment: ', err);
    return res.status(500).json({ error: 'Error checking stripe payment' });
  }

  try {
    const purchase = await PurchasesModel.create({
      userId,
      publisherId,
      amount,
      currency,
      premiumContentId: premiumContent._id,
      status: PURCHASES_STATUS_UNPAID
    });

    res.status(201).json(purchase._id);
  } catch (err) {
    console.error('Error saving purchase: ', err.message);
    return res.status(500).json({ error: 'Error saving purchase' });
  }
});

export default router;