import mongoose from 'mongoose';

const { Schema } = mongoose;


const PublisherSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  paymentPointer: {
    type: String,
  },
  premiumContent: [{
    type: Schema.Types.ObjectId, ref:'PremiumContent'
  }],
});

export default mongoose.model('Publisher', PublisherSchema);
