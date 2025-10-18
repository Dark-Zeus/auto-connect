import mongoose from "mongoose";

const ActivePlanSchema = new mongoose.Schema(
  {
    // Use the user's _id as the document _id (one active plan per user)
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    planPrice: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },

    // New fields for cancellation
    cancelAtPeriodEnd: { type: Boolean, default: false },
    cancelAt: { type: Date, default: null },
    status: { type: String, enum: ["active", "cancelling", "cancelled"], default: "active" }
  },
  {
    collection: "activeplans",
    timestamps: false
  }
);

export default mongoose.model("ActivePlan", ActivePlanSchema);