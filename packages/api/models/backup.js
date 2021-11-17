import mongoose from "mongoose";

const { Schema } = mongoose;

const BackupSchema = new Schema({
  publicKey: {
    type: String,
    required: true,
  },
  backup:{
    type: String,
    required: true,
  },
  lastUpdated:{
    type: Date,
    required: true,
  }
});

export default mongoose.model("Backup", BackupSchema);