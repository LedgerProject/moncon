import express from 'express';
import PublisherModel from '../models/publisher.js';
import MetricsModel, { PAGEVIEW_ANONYMOUS, PAGEVIEW_NOT_PURCHASED, PAGEVIEW_JUST_PURCHASED, PAGEVIEW_PREVIOUSLY_PURCHASED } from '../models/metrics.js';
import PurchasesModel from '../models/purchases.js';
import UserModel from '../models/user.js';
import admin from '../services/firebaseService.js';
import { PREMIUMCONTENT_STATUS_ACTIVE } from '../models/premiumContent.js';

const router = express.Router();

// TODO: Change to POST
router.get('/pageview', async (req, res) => {
  const { publisherId, userId, url, sessionId, justPurchased } = req.query;
  const publisher = await PublisherModel.findOne({ id: publisherId }).populate('premiumContent');
  if (!publisher) {
    return res.status(400).send('Invalid publisher id');
  }
  
  let isLoggedIn = false;
  let userBalance = 0;
  if (userId) {
    // TODO: Use token instead of userId
    const firebaseUser = await admin.auth().getUser(userId);
    if (!firebaseUser.customClaims || !firebaseUser.customClaims.user) {
      return res.status(400).send('Invalid user id');
    }
    isLoggedIn = true;
    const user = await UserModel.findOne({ id: userId });
    userBalance = user?.balance || 0;
  }

  // TODO: Check if there is a better comparison instead of ===
  const premiumContent = publisher.premiumContent.find((premiumContent) => premiumContent.url === url);
  const isPremium = premiumContent && premiumContent.status === PREMIUMCONTENT_STATUS_ACTIVE;
  let isPurchased = false;
  if (isPremium) {
    let pageViewType = PAGEVIEW_ANONYMOUS;
    if (isLoggedIn) {
      isPurchased = await PurchasesModel.exists({ userId, publisherId, premiumContentId: premiumContent._id });
      pageViewType = isPurchased ? ( justPurchased ? PAGEVIEW_JUST_PURCHASED : PAGEVIEW_PREVIOUSLY_PURCHASED ) : PAGEVIEW_NOT_PURCHASED;
    }    
    
    MetricsModel.create({
      publisherId,
      userId,
      sessionId,
      premiumContentId: premiumContent._id,
      type: pageViewType,      
    });
  }

  return res.json({
    isPremium,
    isLoggedIn,
    isPurchased,
    userBalance,
    content: !isPremium ? {} : {
      id: premiumContent._id,
      amount: premiumContent.amount,
      currency: premiumContent.currency,
    },
  });  
});

export default router;
