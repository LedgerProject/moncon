import mongoose from 'mongoose';

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
  premiumContentId:{
    type: Schema.Types.ObjectId,
    ref: 'PremiumContent',
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
});

export default mongoose.model('Purchases', PurchasesSchema);
