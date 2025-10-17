import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // only used if targeting a single user
      required: false,
    },
    receiverGroup: {
      type: String,
      enum: ["All Users", "Vehicle Owners", "Registered Users", "Insurance Company", "Service Center"],
      required: false, // used when sending to a category
    },
    type: { type: String, required: true },
    message: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export default mongoose.model("Notification", notificationSchema);
