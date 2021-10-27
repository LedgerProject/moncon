import mongoose from "mongoose";

const { Schema } = mongoose;

export const PREMIUMCONTENT_STATUS_ACTIVE = "ACTIVE";
export const PREMIUMCONTENT_STATUS_INACTIVE = "INACTIVE";
export const PREMIUMCONTENT_STATUS_DELETED = "DELETED";
export const LEGAL_AGE = "LEGAL_AGE";
export const UNDERAGE = "UNDERAGE";
export const NO_CREDENTIAL = "NO_CREDENTIAL";
export const VERIFICATION_METHOD_W3C = 'w3c';
export const VERIFICATION_METHOD_ZKP = 'zkp';

const PremiumContentSchema = new Schema({
  publisherId: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  domain: {
    type: String,
  },
  age: {
    type: String,
    enum: [LEGAL_AGE, UNDERAGE, NO_CREDENTIAL],
    default: NO_CREDENTIAL,
  },
  verification_type: {
    type: String,
    enum: [VERIFICATION_METHOD_W3C, VERIFICATION_METHOD_ZKP, NO_CREDENTIAL],
    default: NO_CREDENTIAL,
  },
  /*
    To Do 
    see if exist a better way to add conditions dinamically
  */
  status: {
    type: String,
    required: true,
    enum: [PREMIUMCONTENT_STATUS_ACTIVE, PREMIUMCONTENT_STATUS_INACTIVE, PREMIUMCONTENT_STATUS_DELETED],
  },
});

export default mongoose.model("PremiumContent", PremiumContentSchema);
