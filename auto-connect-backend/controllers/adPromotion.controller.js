import Vehicle from "../models/listVehicle.model.js";
import BumpSchedule from "../models/BumpSchedule.model.js";
import { catchAsync } from "../utils/catchAsync.util.js";
import { AppError } from "../utils/appError.util.js";

export const activateBumpForAd = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    remainingBumps = 5,
    intervalHours = 24,
    startAt = null,
  } = req.body;

  const parsedRemaining = Number.parseInt(remainingBumps, 10);
  const parsedInterval = Number.parseInt(intervalHours, 10);

  if (!Number.isInteger(parsedRemaining) || parsedRemaining <= 0) {
    return next(new AppError("remainingBumps must be a positive integer", 400));
  }

  if (!Number.isInteger(parsedInterval) || parsedInterval <= 0) {
    return next(new AppError("intervalHours must be a positive integer", 400));
  }

  const vehicle = await Vehicle.findById(id);

  if (!vehicle) {
    return next(new AppError("Vehicle advertisement not found", 404));
  }

  const now = new Date();
let firstBumpTime = now;

if (startAt) {
  const scheduledStart = new Date(startAt);
  if (Number.isNaN(scheduledStart.getTime())) {
    return next(new AppError("Invalid startAt datetime", 400));
  }
  firstBumpTime = scheduledStart;
}

const isImmediate = !startAt || firstBumpTime <= now;
let schedulePayload;

if (isImmediate) {
  const bumpTime = now;
  const remainingAfterImmediate = Math.max(parsedRemaining - 1, 0);

  vehicle.createdAt = bumpTime;
  vehicle.promotion = remainingAfterImmediate > 0 ? 1 : 0;

  schedulePayload = {
    adId: vehicle._id,
    remainingBumps: remainingAfterImmediate,
    intervalHours: parsedInterval,
    nextBumpTime:
      remainingAfterImmediate > 0
        ? new Date(bumpTime.getTime() + parsedInterval * 60 * 60 * 1000)
        : null,
    lastBumpTime: bumpTime,
    isActive: remainingAfterImmediate > 0,
  };
} else {
  vehicle.promotion = 1;
  schedulePayload = {
    adId: vehicle._id,
    remainingBumps: parsedRemaining,
    intervalHours: parsedInterval,
    nextBumpTime: firstBumpTime,
    lastBumpTime: null,
    isActive: true,
  };
}

await vehicle.save();

const schedule = await BumpSchedule.findOneAndUpdate(
  { adId: vehicle._id },
  schedulePayload,
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

  res.status(200).json({
    success: true,
    message: "Bump promotion activated.",
    data: {
      adId: vehicle._id,
      promotion: vehicle.promotion,
      schedule,
    },
  });
});