import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
    required: true,
  },
  currency: {
    type: String,
    default: 'EUR',
    required: true,
  },
});

export default mongoose.model('User', UserSchema);
