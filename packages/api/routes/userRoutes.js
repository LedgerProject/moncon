import express from 'express';
import { IlpClient, PaymentRequest } from 'xpring-js';
import bigInt from 'big-integer';
import Stripe from 'stripe';
import PurchasesModel from '../models/purchases.js';
import PremiumContentModel from '../models/premiumContent.js';
import PublisherModel from '../models/publisher.js';
import UserModel from '../models/user.js';

const router = express.Router();

const PAYMENT_AMOUNT = 500;
const PAYMENT_CURRENCY = 'EUR';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.get('/paymentIntent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: PAYMENT_AMOUNT,
      currency: PAYMENT_CURRENCY,
      metadata: { integration_check: 'accept_a_payment' },
    });
  
    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    return res.status(500).json({ error: 'Error creating payment intent' });
  }  
});

router.post('/payment', async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await UserModel.findOneAndUpdate(
      { id: userId },
      { balance: PAYMENT_AMOUNT, currency: PAYMENT_CURRENCY },
      { new: true, upsert: true },
    );

    return res.json({ userId: user.id, balance: user.balance, currency: user.currency });
  } catch (err) {
    console.error('Error making payment', err);
    return res.status(500).json({ error: 'Error making payment' });
  }
});

router.post('/purchase', async (req, res) => {
  const { publisherId, contentId } = req.body;
  const userId = res.locals.userId;

  // TODO: Validate body
  // TODO: Validate user did not purchase this url already
  // TODO: Validate publisher has a payment pointer
  
  const premiumContent = await PremiumContentModel.findById(contentId);
  if (!premiumContent) {
    console.error(`Invalid content -> id: ${contentId}`);
    return res.status(400).json({ error: 'Invalid content' });
  }

  const { _id: premiumContentId, amount, currency } = premiumContent;
  const user = await UserModel.findOne({ id: userId });
  // TODO: Save amounts with scale 2
  if (user.balance < amount * 100) {
    console.error(`User ${userId} does not have enough money in his account`);
    return res.status(400).json({ error: 'User does not have enough money in his account' });
  }

  const ilpClient = new IlpClient(process.env.ILP_WALLET_GRPC_URL);
  const accountId = process.env.ILP_WALLET_ACCOUNT_ID;
  const accessToken = process.env.ILP_WALLET_ACCESS_TOKEN;

  try {
    const publisher = await PublisherModel.findOne({ id: publisherId });
    const balance = await ilpClient.getBalance(accountId, accessToken);
    
    const amountBigInt = bigInt(`${amount}e${balance.assetScale}`);
    const paymentRequest = new PaymentRequest({
      amount: amountBigInt,
      destinationPaymentPointer: publisher.paymentPointer,
      senderAccountId: accountId,
    });

    const payment = await ilpClient.sendPayment(paymentRequest, accessToken);
    if (!payment.successfulPayment) {
      return res.status(500).json({ error: 'Payment was not successful' });
    }
  } catch (err) {
    console.log('Error making payment: ', err);
    return res.status(500).json({ error: 'Error making payment' });
  }

  user.balance -= amount * 100;
  await user.save();

  try {
    const purchase = await PurchasesModel.create({
      userId,
      publisherId,
      amount,
      currency,
      premiumContentId,
    });

    res.status(201).json(purchase._id);
  } catch (err) {
    console.error('Error saving purchase: ', err.message);
    return res.status(500).json({ error: 'Error saving purchase' });
  }
});

router.get('/purchase',async (req,res) => {
  try {
      let response = await PurchasesModel.find({ userId: res.locals.userId }).populate('premiumContentId');
      res.status(200).json(response || [])
  } catch (error) {
    console.error('Error getting the purchase ', error.message)
    res.status(500).send({error:`Error getting user purchase Error: ${error.message}`})
  }
});

router.get('/balance', async(req,res) => {
  const userId = res.locals.userId;

  const user = await UserModel.findOne({ id: userId });
  
  res.status(200).json({
    balance: user.balance,
    currency: user.currency,
  });
});

export default router;
