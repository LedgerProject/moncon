import mongoose from "mongoose";
export const PURCHASES_STATUS_PAID = "PAID";
export const PURCHASES_STATUS_UNPAID = "UNPAID";

const { Schema } = mongoose;

const PurchasesSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  publisherId: {
    type: String,
    required: true,
  },
  premiumContentId: {
    type: Schema.Types.ObjectId,
    ref: "PremiumContent",
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    required: true,
    enum: [PURCHASES_STATUS_PAID, PURCHASES_STATUS_UNPAID],
    default: PURCHASES_STATUS_UNPAID,
  },
});

export default mongoose.model("Purchases", PurchasesSchema);
