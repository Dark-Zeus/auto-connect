// models/TimeSlot.model.js
import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema(
  {
    // Link to service center
    serviceCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Service center is required"],
      index: true,
    },

    // Day of the week
    dayOfWeek: {
      type: String,
      required: [true, "Day of week is required"],
      enum: [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ],
      index: true,
    },

    // Working hours for the day
    workingHours: {
      isOpen: {
        type: Boolean,
        default: true,
      },
      startTime: {
        type: String,
        required: function () {
          return this.workingHours.isOpen;
        },
        validate: {
          validator: function (time) {
            if (!this.workingHours.isOpen) return true;
            return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
          },
          message: "Invalid time format (HH:MM)",
        },
      },
      endTime: {
        type: String,
        required: function () {
          return this.workingHours.isOpen;
        },
        validate: {
          validator: function (time) {
            if (!this.workingHours.isOpen) return true;
            return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
          },
          message: "Invalid time format (HH:MM)",
        },
      },
    },

    // Available time slots within working hours
    availableSlots: [
      {
        slotId: {
          type: String,
          required: true,
        },
        startTime: {
          type: String,
          required: true,
          validate: {
            validator: function (time) {
              return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
            },
            message: "Invalid time format (HH:MM)",
          },
        },
        endTime: {
          type: String,
          required: true,
          validate: {
            validator: function (time) {
              return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
            },
            message: "Invalid time format (HH:MM)",
          },
        },
        isAvailable: {
          type: Boolean,
          default: true,
        },
        maxBookings: {
          type: Number,
          default: 1,
          min: [1, "Max bookings must be at least 1"],
        },
        slotDuration: {
          type: Number, // in minutes
          default: 120,
          min: [30, "Slot duration must be at least 30 minutes"],
        },
      },
    ],

    // Blocked dates (specific dates when slots are not available)
    blockedDates: [
      {
        date: {
          type: Date,
          required: true,
        },
        reason: {
          type: String,
          maxlength: [200, "Reason cannot exceed 200 characters"],
        },
        blockedSlots: [String], // Specific slot IDs to block, empty array means all slots blocked
      },
    ],

    // Metadata
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
timeSlotSchema.index({ serviceCenter: 1, dayOfWeek: 1 }, { unique: true });
timeSlotSchema.index({ serviceCenter: 1, isActive: 1 });
timeSlotSchema.index({ "blockedDates.date": 1 });

// Virtual for formatted day display
timeSlotSchema.virtual("dayDisplay").get(function () {
  const dayMap = {
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
    SATURDAY: "Saturday",
    SUNDAY: "Sunday",
  };
  return dayMap[this.dayOfWeek];
});

// Method to get available slots for a specific date
timeSlotSchema.methods.getAvailableSlotsForDate = function (date) {
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  // Check if date is blocked
  const blockedDate = this.blockedDates.find((blocked) => {
    const blockedDateObj = new Date(blocked.date);
    blockedDateObj.setHours(0, 0, 0, 0);
    return blockedDateObj.getTime() === targetDate.getTime();
  });

  if (!this.workingHours.isOpen) {
    return [];
  }

  let availableSlots = this.availableSlots.filter((slot) => slot.isAvailable);

  // If specific date is blocked, filter out blocked slots
  if (blockedDate) {
    if (blockedDate.blockedSlots.length === 0) {
      // All slots blocked
      return [];
    } else {
      // Specific slots blocked
      availableSlots = availableSlots.filter(
        (slot) => !blockedDate.blockedSlots.includes(slot.slotId)
      );
    }
  }

  return availableSlots;
};

// Static method to get available slots for service center and date
timeSlotSchema.statics.getAvailableSlots = async function (
  serviceCenterId,
  date
) {
  const targetDate = new Date(date);
  const dayOfWeek = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ][targetDate.getDay()];

  const timeSlot = await this.findOne({
    serviceCenter: serviceCenterId,
    dayOfWeek: dayOfWeek,
    isActive: true,
  });

  if (!timeSlot) {
    return [];
  }

  return timeSlot.getAvailableSlotsForDate(date);
};

// Pre-save middleware
timeSlotSchema.pre("save", function (next) {
  // Generate slot IDs if not provided
  this.availableSlots.forEach((slot, index) => {
    if (!slot.slotId) {
      slot.slotId = `${this.dayOfWeek}_${slot.startTime.replace(
        ":",
        ""
      )}_${slot.endTime.replace(":", "")}`;
    }
  });

  // Validate that end time is after start time for working hours
  if (
    this.workingHours.isOpen &&
    this.workingHours.startTime &&
    this.workingHours.endTime
  ) {
    const startTime = this.workingHours.startTime.split(":").map(Number);
    const endTime = this.workingHours.endTime.split(":").map(Number);

    const startMinutes = startTime[0] * 60 + startTime[1];
    const endMinutes = endTime[0] * 60 + endTime[1];

    if (endMinutes <= startMinutes) {
      next(new Error("End time must be after start time"));
      return;
    }
  }

  next();
});

const TimeSlot = mongoose.model("TimeSlot", timeSlotSchema);

export default TimeSlot;
