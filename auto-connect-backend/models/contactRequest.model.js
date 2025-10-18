import mongoose from "mongoose";

const contactRequestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    category: {
      type: String,
      enum: ["account", "payment", "service", "technical", "feature", "Reports"],
      required: true,
    },
    priority: {
      type: String,
      enum: ["urgent", "high", "medium", "low"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["unread", "in-progress", "resolved"],
      default: "unread",
    },
    reply: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("ContactRequest", contactRequestSchema);