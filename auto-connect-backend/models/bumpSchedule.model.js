import mongoose from "mongoose";

const bumpScheduleSchema = new mongoose.Schema(
  {
    adId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ListVehicle",
      required: true,
      index: true,
    },
    remainingBumps: {
      type: Number,
      required: true,
      min: 0,
    },
    intervalHours: {
      type: Number,
      default: 24,
      min: 1,
    },
    nextBumpTime: {
      type: Date,
      required: null, // allow null when no more bumps are remaining
    },
    lastBumpTime: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

bumpScheduleSchema.index({ isActive: 1, nextBumpTime: 1 });

export default mongoose.model("BumpSchedule", bumpScheduleSchema);