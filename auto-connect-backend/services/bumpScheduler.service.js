import cron from "node-cron";
import BumpSchedule from "../models/bumpSchedule.model.js";
import Vehicle from "../models/listVehicle.model.js";

const EVERY_HOUR_CRON = "0 * * * *";

export const startBumpScheduler = () => {
  const job = cron.schedule(EVERY_HOUR_CRON, async () => {
    const now = new Date();

    const schedules = await BumpSchedule.find({
      isActive: true,
      nextBumpTime: { $lte: now },
    });

    for (const schedule of schedules) {
      try {
        const vehicle = await Vehicle.findById(schedule.adId);

        if (!vehicle) {
          schedule.isActive = false;
          schedule.remainingBumps = 0;
          schedule.nextBumpTime = null;
          await schedule.save();
          continue;
        }

        const bumpTime = new Date();

        vehicle.createdAt = bumpTime;
        if (schedule.remainingBumps - 1 <= 0) {
          vehicle.promotion = 0;
        }
        await vehicle.save();

        schedule.remainingBumps = Math.max(schedule.remainingBumps - 1, 0);
        schedule.lastBumpTime = bumpTime;

        if (schedule.remainingBumps === 0) {
          schedule.isActive = false;
          schedule.nextBumpTime = null;
        } else {
          schedule.nextBumpTime = new Date(
            bumpTime.getTime() + schedule.intervalHours * 60 * 60 * 1000
          );
        }

        await schedule.save();
      } catch (err) {
        console.error("Bump scheduler error:", err);
      }
    }
  });

  job.start();
  return job;
};