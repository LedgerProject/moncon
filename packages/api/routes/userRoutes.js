import express from "express";
import Stripe from "stripe";
import multer from 'multer';
import multerS3 from 'multer-s3';
import jwt from "jsonwebtoken";
import moment from "moment";
import { s3 } from "../services/s3Client.js"; // Helper function that creates Amazon S3 service client module.
import { 
  getSafetyQuestions,
  createPBKDF,
  sanitizeAnswers,
  recoveryKeypair
} from "keypair-lib";
import { setFileName } from '../middlewares/multerMiddleware.js';
import { AMOUNT_TO_STORE } from "../Const.js";
import BackupModel from '../models/backup.js';

const router = express.Router();

const tokenLife = "4h";

const PAYMENT_CURRENCY = "EUR";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_ID = process.env.PRICE_ID;


const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, `${req.locals.newFileName}.${file.mimetype.replace('image/','')}`)
    }
  })
})

router.post("/customer", async (req, res) => {
  const { userId, paymentId, metadata } = req.body;
  console.log("/customer in userRoutes");
  console.table({ userId, paymentId, metadata });
  try {
    const newCustomer = await stripe.customers.create({
      payment_method: paymentId,
      metadata: {
        userId,
        ...metadata,
      },
    });

    return res.status(200).json({ customerId: newCustomer.id });
  } catch (err) {
    console.error("Error creating customer: ", err);
    return res.status(500).json({ error: "Error creating customer " });
  }
});

router.post("/card", async (req, res) => {
  const { card, customer } = req.body;
  console.log("/card in userRoutes");
  console.table({ card, customer });
  try {
    const paymentMethod = await stripe.paymentMethods.attach(card, {
      customer,
    });

    return res.status(200).json({ customerId: customer });
  } catch (err) {
    console.error("Error deleting card: ", err);
    return res.status(500).json({ error: "Error deleting card " });
  }
});

router.post("/card-delete", async (req, res) => {
  const { card, customer } = req.body;
  console.log("/card-delete in userRoutes");
  console.table({ card, customer });
  try {
    const paymentMethod = await stripe.paymentMethods.detach(card);

    return res.status(200).json({ customerId: customer });
  } catch (err) {
    console.error("Error deleting card: ", err);
    return res.status(500).json({ error: "Error deleting card " });
  }
});

router.post("/createSubscription", async (req, res) => {
  const { metadata, description, stripeAccountId, paymentId, customerId } =
    req.body;

  console.log("/createSubscription in userRoutes");
  console.table({
    metadata,
    description,
    stripeAccountId,
    paymentId,
    customerId,
  });

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: PRICE_ID,
        },
      ],
      default_payment_method: paymentId,
      cancel_at_period_end: true,
    });

    console.log("subscription :", subscription);
    console.log();
    console.log();

    res.json({ subscriptionId: subscription.id });
  } catch (err) {
    console.log("Error creating subscription : ", err);
    return res.status(500).json({ error: "Error creating subscription" });
  }
});

router.post("/chargeSubscription", async (req, res) => {
  const { subscriptionId, amount } = req.body;
  console.log("/chargeSubscription in userRoutes");
  console.table({ subscriptionId, amount });

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    console.log(subscription?.items.data[0]);

    if (!subscription?.items.data[0]) {
      console.error("Error subscription does not exist: ", err);
      return res
        .status(400)
        .json({ error: "Error subscription does not exist " });
    }

    const usage = await stripe.subscriptionItems.createUsageRecord(
      subscription.items.data[0].id,
      {
        quantity: AMOUNT_TO_STORE(amount),
        timestamp: moment().format("X"),
        action: "increment",
      }
    );

    console.log("usage", usage);
    console.log();

    await stripe.subscriptions.update(subscriptionId, {
      billing_cycle_anchor: "now",
      proration_behavior: "create_prorations",
    });

    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        billing_cycle_anchor: "now",
        proration_behavior: "create_prorations",
      }
    );

    console.log("updatedSubscription", updatedSubscription);
    console.log();

    return res.status(200).json({ updatedSubscription });
  } catch (err) {
    console.error("Error charging subscription: ", err);
    return res.status(500).json({ error: "Error charging subscription " });
  }
});

router.post("/updateSubscription", async (req, res) => {
  const { subscriptionId } = req.body;
  console.log("/updateSubscription in userRoutes");
  console.table({ subscriptionId });

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    console.log(subscription?.items.data[0]);

    if (!subscription?.items.data[0]) {
      console.error("Error subscription does not exist: ", err);
      return res
        .status(400)
        .json({ error: "Error subscription does not exist " });
    }

    const updatedSubscription = await stripe.subscriptions.update(
      subscriptionId,
      {
        billing_cycle_anchor: "now",
        proration_behavior: "create_prorations",
      }
    );

    await stripe.subscriptions.update(subscriptionId, {
      billing_cycle_anchor: "now",
      proration_behavior: "create_prorations",
    });

    console.log("updatedSubscription", updatedSubscription);
    console.log();

    return res.status(200).json({ updatedSubscription });
  } catch (err) {
    console.error("Error updating subscription: ", err);
    return res.status(500).json({ error: "Error updating subscription " });
  }
});

router.post("/token", async (req, res) => {
  const { userId } = req.body;
  console.table({ userId });
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: tokenLife,
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error("Error creating token: ", err.message);
    return res.status(500).json({ error: "Error creating token" });
  }
});

router.post('/upload-image', setFileName, upload.single('image'), async (req, res) => {
  try {
    return res.status(200).json({image: req.file.location});
  } catch (err) {
    if(!(err === '[ERR_HTTP_HEADERS_SENT]')){
      console.log('Error uploading image: ', err);
      return res.status(500).json({ error: `Error uploading image: ${err.message}`});
    }
  }
});

router.get('/backup-questions', async (req, res) => {
  try {
    const questions =  getSafetyQuestions('en_GB');
    return res.status(200).json(questions);
  } catch (err){
    console.log("Error returning backup questions", err);
    return res.status(500).json({error:"Error returning backup questions"});
  }
});

router.post('/pbkdf', async (req, res) => {
  const { userData } = req.body;
  try {
    const pbkdf = await createPBKDF(userData)
    return res.status(200).json({pbkdf});
  } catch (err){
    console.log("Error creating pbkdf", err);
    return res.status(500).json({error:"Error creating pbkdf"});
  }
});

router.post('/keypair', async (req, res) => {
  const { pbkdf, answers } = req.body;
  console.log(req.body)
  try {
    const sanitizedAnswers = sanitizeAnswers(answers);
    const keypair = await recoveryKeypair(sanitizedAnswers,pbkdf,"user");
    return res.status(200).json(keypair["user"]);
  } catch (err){
    console.log("Error creating keypair", err);
    return res.status(500).json({error:"Error creating keypair"});
  }
});

router.post('/update-backup', async (req, res) => {
  const { public_key, backup } = req.body;

  const result = await BackupModel.findOneAndUpdate(
    {publicKey: public_key},
    {
      backup,
      lastUpdated: Date.now()
    },
    { upsert: true, new: true }
  );

  res.status(200).json({result});
});

router.post('/get-backup', async (req, res) => {
  const { public_key } = req.body;

  const result = await BackupModel.findOne({publicKey:public_key});


  res.status(200).json({result});
});

export default router;