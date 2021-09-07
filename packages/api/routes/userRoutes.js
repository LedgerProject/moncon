import express from "express";
import Stripe from "stripe";
import { AMOUNT_TO_STORE } from "../Const.js";
import moment from "moment";
import jwt from "jsonwebtoken";
import PurchasesModel from "../models/purchases.js";
import PremiumContentModel from "../models/premiumContent.js";
import PublisherModel from "../models/publisher.js";
import UserModel from "../models/user.js";

const router = express.Router();

const tokenLife = "4h";

const PAYMENT_CURRENCY = "EUR";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_ID = process.env.PRICE_ID;

///
// IMPORTANT see line 184
//

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

if (process.env.NODE_ENV === "development") {
  //IMPORTANT
  //this endpoint has to be deleted
  router.get("/reset", async (req, res) => {
    const { userId } = req.query;
    console.log("/reset in userRoutes");
    console.table({ userId });

    try {
      const result = await PurchasesModel.deleteMany({ userId });

      res.json({ result });
    } catch (err) {
      console.log("Error deleting purchases : ", err);
      return res.status(500).json({ error: "Error deleting purchases" });
    }
  });

  //IMPORTANT
  //this endpoint has to be deleted

  router.get("/reset-all", async (req, res) => {
    console.log("/reset-all in userRoutes");

    try {
      const purchases = await PurchasesModel.deleteMany();
      const users = await UserModel.deleteMany();

      res.json({ purchases, users });
    } catch (err) {
      console.log("Error deleting purchases : ", err);
      return res.status(500).json({ error: "Error deleting purchases" });
    }
  });

  //IMPORTANT
  //this endpoint has to be deleted
  router.get("/publisher-info", async (req, res) => {
    const { publisherId } = req.query;
    console.log("/publisher-info in userRoutes");
    console.table({ publisherId });

    try {
      const result = await PublisherModel.findOne({ id: publisherId }).populate(
        "premiumContent"
      );

      res.json({ result });
    } catch (err) {
      console.log("Error deleting purchases : ", err);
      return res.status(500).json({ error: "Error deleting purchases" });
    }
  });

  //IMPORTANT
  //this endpoint has to be deleted
  router.get("/purchases-info", async (req, res) => {
    const { userId, premiumContentId } = req.query;
    console.log("/purchases-info in userRoutes");
    console.table({ userId, premiumContentId });
    try {
      if (!premiumContentId && userId) {
        const result = await PurchasesModel.find({ userId });
        return res.json({ result });
      }

      if (premiumContentId && !userId) {
        const result = await PurchasesModel.find({ premiumContentId });
        return res.json({ result });
      }

      if (premiumContentId && userId) {
        const result = await PurchasesModel.find({ userId, premiumContentId });
        return res.json({ result });
      }

      return res.status(400).json({ error: "no parameters" });
    } catch (err) {
      console.log("Error deleting purchases : ", err);
      return res.status(500).json({ error: "Error deleting purchases" });
    }
  });
}

export default router;
