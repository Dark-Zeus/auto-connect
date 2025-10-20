import mongoose from "mongoose";

const reportAdsSchema = new mongoose.Schema({
  adId: { type: mongoose.Schema.Types.ObjectId, ref: "ListVehicle", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  issue: { type: String, required: true },
  details: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("ReportAd", reportAdsSchema);