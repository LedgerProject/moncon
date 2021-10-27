import mongoose from "mongoose";

const { Schema } = mongoose;

const IssuerSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  did: {
    type: String,
    required: true,
  },
  issuer_public_keys:{
    type:String,
  },
  issuer_private_keys:{
    type:String,
  }
});

export default mongoose.model("Issuer", IssuerSchema);