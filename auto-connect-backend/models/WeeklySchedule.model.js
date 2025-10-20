// models/WeeklySchedule.model.js
import mongoose from "mongoose";

const weeklyScheduleSchema = new mongoose.Schema(
  {
    // Link to service center
    serviceCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Service center is required"],
      unique: true, // One schedule per service center
      index: true,
    },

    // Weekly recurring schedule
    schedule: {
      monday: {
        isOpen: { type: Boolean, default: false },
        startTime: { type: String, default: "" },
        endTime: { type: String, default: "" },
      },
      tuesday: {
        isOpen: { type: Boolean, default: false },
        startTime: { type: String, default: "" },
        endTime: { type: String, default: "" },
      },
      wednesday: {
        isOpen: { type: Boolean, default: false },
        startTime: { type: String, default: "" },
        endTime: { type: String, default: "" },
      },
      thursday: {
        isOpen: { type: Boolean, default: false },
        startTime: { type: String, default: "" },
        endTime: { type: String, default: "" },
      },
      friday: {
        isOpen: { type: Boolean, default: false },
        startTime: { type: String, default: "" },
        endTime: { type: String, default: "" },
      },
      saturday: {
        isOpen: { type: Boolean, default: false },
        startTime: { type: String, default: "" },
        endTime: { type: String, default: "" },
      },
      sunday: {
        isOpen: { type: Boolean, default: false },
        startTime: { type: String, default: "" },
        endTime: { type: String, default: "" },
      },
    },

    // Slot settings
    slotSettings: {
      duration: {
        type: Number,
        required: [true, "Slot duration is required"],
        min: [15, "Minimum slot duration is 15 minutes"],
        max: [240, "Maximum slot duration is 4 hours"],
        default: 60, // 1 hour default
      },
      bufferTime: {
        type: Number,
        min: [0, "Buffer time cannot be negative"],
        max: [60, "Maximum buffer time is 60 minutes"],
        default: 15, // 15 minutes buffer between slots
      },
      advanceBookingDays: {
        type: Number,
        min: [1, "Minimum advance booking is 1 day"],
        max: [90, "Maximum advance booking is 90 days"],
        default: 30, // 30 days ahead
      },
    },

    // Blocked dates (holidays, maintenance, etc.)
    blockedDates: [
      {
        date: {
          type: String, // YYYY-MM-DD format
          required: true,
        },
        reason: {
          type: String,
          default: "Unavailable",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for efficient querying
weeklyScheduleSchema.index({ serviceCenter: 1 });
weeklyScheduleSchema.index({ "blockedDates.date": 1 });

// Method to generate time slots for a specific date
weeklyScheduleSchema.methods.generateSlotsForDate = function (date) {
  const dayOfWeek = new Date(date)
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const daySchedule = this.schedule[dayOfWeek];

  if (!daySchedule || !daySchedule.isOpen) {
    return [];
  }

  // Check if date is blocked
  const isBlocked = this.blockedDates.some((blocked) => blocked.date === date);
  if (isBlocked) {
    return [];
  }

  const slots = [];
  const startTime = daySchedule.startTime;
  const endTime = daySchedule.endTime;
  const duration = this.slotSettings.duration;
  const bufferTime = this.slotSettings.bufferTime;

  // Convert time strings to minutes
  const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  let currentTime = timeToMinutes(startTime);
  const endTimeMinutes = timeToMinutes(endTime);

  while (currentTime + duration <= endTimeMinutes) {
    const slotStart = minutesToTime(currentTime);
    const slotEnd = minutesToTime(currentTime + duration);

    slots.push({
      startTime: slotStart,
      endTime: slotEnd,
      duration: duration,
      date: date,
      isAvailable: true,
    });

    currentTime += duration + bufferTime;
  }

  return slots;
};

// Static method to get available slots for date range
weeklyScheduleSchema.statics.getAvailableSlotsForDateRange = async function (
  serviceCenterId,
  startDate,
  endDate
) {
  const schedule = await this.findOne({ serviceCenter: serviceCenterId });
  if (!schedule) return [];

  const slots = [];
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const daySlots = schedule.generateSlotsForDate(dateStr);
    slots.push(...daySlots);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return slots;
};

// Method to block a date
weeklyScheduleSchema.methods.blockDate = function (
  date,
  reason = "Unavailable"
) {
  // Remove existing blocked date if present
  this.blockedDates = this.blockedDates.filter(
    (blocked) => blocked.date !== date
  );

  // Add new blocked date
  this.blockedDates.push({ date, reason });

  return this.save();
};

// Method to unblock a date
weeklyScheduleSchema.methods.unblockDate = function (date) {
  this.blockedDates = this.blockedDates.filter(
    (blocked) => blocked.date !== date
  );
  return this.save();
};

// Virtual to get next available slots
weeklyScheduleSchema.virtual("nextAvailableSlots").get(function () {
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + this.slotSettings.advanceBookingDays);

  return this.constructor.getAvailableSlotsForDateRange(
    this.serviceCenter,
    today.toISOString().split("T")[0],
    endDate.toISOString().split("T")[0]
  );
});

const WeeklySchedule = mongoose.model("WeeklySchedule", weeklyScheduleSchema);

export default WeeklySchedule;
