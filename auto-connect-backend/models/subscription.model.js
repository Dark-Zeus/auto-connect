const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  costPerAd: { type: Number, required: true },
  validityPeriod: { type: Number, required: true },
  adsPerMonth: { type: Number, required: true },
  promotionVoucher: { type: Number, required: false },
}, { timestamps: true });

module.exports = mongoose.model("Subscription", subscriptionSchema);
