import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  userId: { type: String }, // Optional if subscriptions can be user-specific
  title: { type: String, required: true },
  price: { type: Number, required: true },
  costPerAd: { type: Number, required: true },
  validityPeriod: { type: Number, required: true },
  adsPerMonth: { type: Number, required: true },
  promotionVoucher: { type: Number, default: 0 },
  status: { type: Number, default: 1 }, // 1 = active, 0 = inactive / deleted
}, { timestamps: true });

// Static method to safely update a subscription
subscriptionSchema.statics.updateSubscriptionById = async function (id, updateData) {
  return this.findOneAndUpdate(
    { _id: id, status: 1 }, // Only update if active
    updateData,
    { new: true }
  );
};

// Static method to soft delete a subscription
subscriptionSchema.statics.softDeleteSubscription = async function (id) {
  return this.findOneAndUpdate(
    { _id: id },
    { status: 0 }, // mark as inactive
    { new: true }
  );
};

export default mongoose.model("Subscription", subscriptionSchema);
