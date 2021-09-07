import mongoose from "mongoose";

const { Schema } = mongoose;

export const PAGEVIEW_ANONYMOUS = "ANONYMOUS";
export const PAGEVIEW_NOT_PURCHASED = "NOT_PURCHASED";
export const PAGEVIEW_JUST_PURCHASED = "JUST_PURCHASED";
export const PAGEVIEW_PREVIOUSLY_PURCHASED = "PREVIOUSLY_PURCHASED";

const MetricsSchema = new Schema({
  publisherId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
  },
  sessionId: {
    type: String,
    required: true,
  },
  premiumContentId: {
    type: Schema.Types.ObjectId,
    ref: "PremiumContent",
    required: true,
  },
  type: {
    type: String,
    enum: [
      PAGEVIEW_ANONYMOUS,
      PAGEVIEW_NOT_PURCHASED,
      PAGEVIEW_JUST_PURCHASED,
      PAGEVIEW_PREVIOUSLY_PURCHASED,
    ],
    default: PAGEVIEW_ANONYMOUS,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Metrics", MetricsSchema);
