import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
});

export default mongoose.model('User', UserSchema);
