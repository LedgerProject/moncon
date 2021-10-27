import mongoose from "mongoose";

const { Schema } = mongoose;

const PublisherSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  stripeAccountId: {
    type: String,
  },
  contentIdType:{
    type: String,
    enum:['id','class','tag','default'],
    default: 'default',
  },
  contentIdValue:{
    type: String,
  },
  premiumContent: [
    {
      type: Schema.Types.ObjectId,
      ref: "PremiumContent",
    },
  ],
});

export default mongoose.model("Publisher", PublisherSchema);
