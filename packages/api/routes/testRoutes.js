import express from "express";
import PurchasesModel from "../models/purchases.js";
import PremiumContentModel from "../models/premiumContent.js";
import PublisherModel from "../models/publisher.js";
import UserModel from "../models/user.js";
import MetricsModel, {
  PAGEVIEW_ANONYMOUS,
  PAGEVIEW_NOT_PURCHASED,
  PAGEVIEW_JUST_PURCHASED,
  PAGEVIEW_PREVIOUSLY_PURCHASED,
} from "../models/metrics.js";

const router = express.Router();


router.get("/reset", async (req, res) => {
  const { userId, publisherId, premiumContentId } = req.query;
  console.log("/reset in userRoutes");
  console.table({ userId });

  try {
    let result
    if(userId){
      result = await PurchasesModel.deleteMany({ userId });
    }

    if(publisherId){
      result = await PurchasesModel.deleteMany({ publisherId });
    }

    if(premiumContentId){
      result = await PurchasesModel.deleteMany({ premiumContentId });
    }

    res.json({ result });
  }catch (err) {
    console.log("Error deleting purchases : ", err);
    return res.status(500).json({ error: "Error deleting purchases" });
  }
});

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

router.get("/publisher-info", async (req, res) => {
  const { publisherId } = req.query;
  console.log("/publisher-info in userRoutes");
  console.table({ publisherId });

  try {
    const result = await PublisherModel.findOne({ id: publisherId }).populate(
      "premiumContent"
    );

    res.json({ result });
  }catch (err) {
    console.log("Error deleting purchases : ", err);
    return res.status(500).json({ error: "Error deleting purchases" });
  }
});

  
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
  }catch (err) {
    console.log("Error deleting purchases : ", err);
    return res.status(500).json({ error: "Error deleting purchases" });
  }
});

router.post('/add-metrics', async (req, res) => {
  const { publisherId, userId, sessionId, premiumContentId, createdAt, type } = req.body
  console.table({ publisherId, userId, sessionId, premiumContentId, createdAt, type });

  try{
    await MetricsModel.create({
        publisherId,
        userId,
        sessionId,
        premiumContentId,
        type,
        createdAt
      });
    res.status(200).json('ok');
  }catch(err){
    console.log('error creating fakes metrics');
    console.log(err)
    res.status(500).json({error:err})
  }
});

router.post('/add-metrics', async (req, res) => {
  const { publisherId, userId, sessionId, premiumContentId, createdAt, type } = req.body
  console.table({ publisherId, userId, sessionId, premiumContentId, createdAt, type });

  try{
    await MetricsModel.create({
        publisherId,
        userId,
        sessionId,
        premiumContentId,
        type,
        createdAt
      });
    res.status(200).json('ok');
  }catch(err){
    console.log('error creating fakes metrics');
    console.log(err)
    res.status(500).json({error:err})
  }
});

router.post('/add-purchases', async (req, res) => {
  const { publisherId, userId, premiumContentId, createdAt} = req.body
  console.table({ publisherId, userId, premiumContentId, createdAt });

  try{
    const premiumContent = await PremiumContentModel.findById(premiumContentId);
    if(!premiumContent){
      console.log('wrong premiumContentId');
      res.status(400).json({error:'wrong premiumContentId'})
      return
    }
    console.log(premiumContent)
    await PurchasesModel.create({
      status: "UNPAID",
      userId,
      publisherId,
      amount: premiumContent.amount,
      currency: "EUR",
      premiumContentId,
      createdAt,
    });
    res.status(200).json('ok');
  }catch(err){
    console.log('error creating fakes metrics');
    console.log(err)
    res.status(500).json({error:err})
  }
});

export default router;