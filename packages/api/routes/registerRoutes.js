import express from "express";
import admin from "../services/firebaseService.js";
import PublisherModel from "../models/publisher.js";
import UserModel from "../models/user.js";

const router = express.Router();

router.post("/setCustomClaims", async (req, res) => {
  const { token, claim } = req.body;

  if (claim !== "publisher") {
    return res.status(400).send({ error: "Invaid claim" });
  }

  try {
    const user = await admin.auth().verifyIdToken(token);

    if (
      typeof user.email !== "undefined" &&
      typeof user.email_verified !== "undefined" &&
      user.email &&
      user.email_verified &&
      process.env.ADMIN_USERS.split("#").includes(user.email)
    ) {
      await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    } else {
      if (claim === "publisher") {
        if (await PublisherModel.exists({ id: user.uid })) {
          return res.status(400).send({ error: "User already exists" });
        }
        await PublisherModel.create({
          id: user.uid,
          premiumContent: [],
        });
      }
      await admin.auth().setCustomUserClaims(user.uid, { [claim]: true });
    }

    return res.json({ status: "success" });
  } catch (err) {
    console.log("Error setting custom claims: ", err.message);
    return res
      .status(401)
      .json({ error: "You are not authorized to make this request" });
  }
});

export default router;
