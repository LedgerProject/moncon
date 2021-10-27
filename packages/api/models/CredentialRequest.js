import mongoose from "mongoose";

const { Schema } = mongoose;

export const CREDENTIAL_REQUEST_STATUS_PENDING = 'pending';
export const CREDENTIAL_REQUEST_STATUS_DECLINED = 'declined';
export const CREDENTIAL_REQUEST_STATUS_APPROVED = 'approved';

const CredentialRequestSchema = new Schema({
  credential: {
    type: String,
    required: true,
  },
  signedCredential:{
    type: Object,
  },
  userId:{
    type:String,
    required: true,
  },
  status:{
    type: String,
    enum:[
      CREDENTIAL_REQUEST_STATUS_PENDING,
      CREDENTIAL_REQUEST_STATUS_DECLINED,
      CREDENTIAL_REQUEST_STATUS_APPROVED
    ],
    default: CREDENTIAL_REQUEST_STATUS_PENDING,
    required: true,
  },
  recived:{
    type: Boolean,
    default:false, 
    required: true,
  },
  data:{
    type: String,
    required: true
  },
  claim:{
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export default mongoose.model("CredentialRequest", CredentialRequestSchema);