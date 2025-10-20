// controllers/operatingHours.controller.js
import User from "../models/user.model.js";
import LOG from "../configs/log.config.js";
import { catchAsync } from "../utils/catchAsync.util.js";
import { AppError } from "../utils/appError.util.js";

// Get working hours for the authenticated service center
export const getWorkingHours = catchAsync(async (req, res, next) => {
  // Only service centers and repair centers can access this
  if (!["service_center", "repair_center"].includes(req.user.role)) {
    return next(
      new AppError("Only service centers can manage working hours", 403)
    );
  }

  try {
    const user = await User.findById(req.user._id).select(
      "businessInfo.operatingHours"
    );

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Convert Map to Object if it exists, otherwise use default hours
    let operatingHours = {};
    if (user.businessInfo?.operatingHours) {
      // If it's a Map, convert to object
      if (user.businessInfo.operatingHours instanceof Map) {
        operatingHours = Object.fromEntries(user.businessInfo.operatingHours);
      } else {
        operatingHours = user.businessInfo.operatingHours;
      }
    } else {
      // Default operating hours
      operatingHours = getDefaultOperatingHours();
    }

    // Convert to the format expected by frontend
    const workingHours = {};
    Object.keys(operatingHours).forEach((day) => {
      const dayHours = operatingHours[day];
      workingHours[day] = {
        isOpen: dayHours.isOpen || false,
        startTime: dayHours.open || "08:00",
        endTime: dayHours.close || "17:00",
        breakStart: dayHours.breakStart || "",
        breakEnd: dayHours.breakEnd || "",
      };
    });

    LOG.info({
      message: "Working hours retrieved",
      userId: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: "Working hours retrieved successfully",
      data: {
        workingHours,
      },
    });
  } catch (error) {
    LOG.error("Error fetching working hours:", error);
    return next(new AppError("Failed to fetch working hours", 500));
  }
});

// Update working hours for the authenticated service center
export const updateWorkingHours = catchAsync(async (req, res, next) => {
  // Only service centers and repair centers can access this
  if (!["service_center", "repair_center"].includes(req.user.role)) {
    return next(
      new AppError("Only service centers can manage working hours", 403)
    );
  }

  const { workingHours } = req.body;

  if (!workingHours) {
    return next(new AppError("Working hours data is required", 400));
  }

  try {
    // Validate the working hours data
    const validDays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    for (const day of validDays) {
      if (!workingHours[day]) {
        return next(new AppError(`Working hours for ${day} are required`, 400));
      }

      const dayData = workingHours[day];
      if (dayData.isOpen) {
        if (!dayData.startTime || !dayData.endTime) {
          return next(
            new AppError(`Start and end times are required for ${day}`, 400)
          );
        }

        // Validate time format (HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (
          !timeRegex.test(dayData.startTime) ||
          !timeRegex.test(dayData.endTime)
        ) {
          return next(new AppError(`Invalid time format for ${day}`, 400));
        }

        // Check that start time is before end time
        const start = new Date(`2000-01-01 ${dayData.startTime}`);
        const end = new Date(`2000-01-01 ${dayData.endTime}`);
        if (start >= end) {
          return next(
            new AppError(`Start time must be before end time for ${day}`, 400)
          );
        }
      }
    }

    // Convert frontend format to database format
    const operatingHours = {};
    Object.keys(workingHours).forEach((day) => {
      const dayData = workingHours[day];
      operatingHours[day] = {
        open: dayData.startTime || "08:00",
        close: dayData.endTime || "17:00",
        isOpen: dayData.isOpen || false,
        breakStart: dayData.breakStart || "",
        breakEnd: dayData.breakEnd || "",
      };
    });

    // Update the user's operating hours
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          "businessInfo.operatingHours": operatingHours,
          lastModifiedBy: req.user._id,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(new AppError("User not found", 404));
    }

    LOG.info({
      message: "Working hours updated",
      userId: req.user._id,
      updatedHours: operatingHours,
    });

    res.status(200).json({
      success: true,
      message: "Working hours updated successfully",
      data: {
        workingHours,
        operatingHours,
      },
    });
  } catch (error) {
    LOG.error("Error updating working hours:", error);
    return next(new AppError("Failed to update working hours", 500));
  }
});

// Get slot settings for the authenticated service center
export const getSlotSettings = catchAsync(async (req, res, next) => {
  // Only service centers and repair centers can access this
  if (!["service_center", "repair_center"].includes(req.user.role)) {
    return next(
      new AppError("Only service centers can manage slot settings", 403)
    );
  }

  try {
    const user = await User.findById(req.user._id).select(
      "businessInfo.slotSettings"
    );

    const defaultSettings = {
      defaultDuration: 60,
      bufferTime: 15,
      maxAdvanceBooking: 30,
      minAdvanceBooking: 1,
    };

    const slotSettings = user.businessInfo?.slotSettings || defaultSettings;

    res.status(200).json({
      success: true,
      message: "Slot settings retrieved successfully",
      data: {
        settings: slotSettings,
      },
    });
  } catch (error) {
    LOG.error("Error fetching slot settings:", error);
    return next(new AppError("Failed to fetch slot settings", 500));
  }
});

// Update slot settings for the authenticated service center
export const updateSlotSettings = catchAsync(async (req, res, next) => {
  // Only service centers and repair centers can access this
  if (!["service_center", "repair_center"].includes(req.user.role)) {
    return next(
      new AppError("Only service centers can manage slot settings", 403)
    );
  }

  const { settings } = req.body;

  if (!settings) {
    return next(new AppError("Slot settings data is required", 400));
  }

  try {
    // Validate settings
    const {
      defaultDuration,
      bufferTime,
      maxAdvanceBooking,
      minAdvanceBooking,
    } = settings;

    if (defaultDuration && (defaultDuration < 15 || defaultDuration > 480)) {
      return next(
        new AppError("Default duration must be between 15 and 480 minutes", 400)
      );
    }

    if (bufferTime && (bufferTime < 0 || bufferTime > 120)) {
      return next(
        new AppError("Buffer time must be between 0 and 120 minutes", 400)
      );
    }

    if (
      maxAdvanceBooking &&
      (maxAdvanceBooking < 1 || maxAdvanceBooking > 365)
    ) {
      return next(
        new AppError("Max advance booking must be between 1 and 365 days", 400)
      );
    }

    if (
      minAdvanceBooking &&
      (minAdvanceBooking < 1 || minAdvanceBooking > 168)
    ) {
      return next(
        new AppError("Min advance booking must be between 1 and 168 hours", 400)
      );
    }

    // Update the user's slot settings
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          "businessInfo.slotSettings": settings,
          lastModifiedBy: req.user._id,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(new AppError("User not found", 404));
    }

    LOG.info({
      message: "Slot settings updated",
      userId: req.user._id,
      newSettings: settings,
    });

    res.status(200).json({
      success: true,
      message: "Slot settings updated successfully",
      data: {
        settings,
      },
    });
  } catch (error) {
    LOG.error("Error updating slot settings:", error);
    return next(new AppError("Failed to update slot settings", 500));
  }
});

// Get slot statistics for a specific date
export const getSlotStats = catchAsync(async (req, res, next) => {
  // Only service centers and repair centers can access this
  if (!["service_center", "repair_center"].includes(req.user.role)) {
    return next(
      new AppError("Only service centers can view slot statistics", 403)
    );
  }

  const { date } = req.query;

  if (!date) {
    return next(new AppError("Date parameter is required", 400));
  }

  try {
    // For now, return mock statistics
    // You can implement actual slot counting logic here when you have a bookings system
    const stats = {
      totalSlots: 16, // 8 hours * 2 slots per hour
      bookedSlots: 5,
      availableSlots: 9,
      blockedSlots: 2,
    };

    res.status(200).json({
      success: true,
      message: "Slot statistics retrieved successfully",
      data: {
        stats,
        date,
      },
    });
  } catch (error) {
    LOG.error("Error fetching slot statistics:", error);
    return next(new AppError("Failed to fetch slot statistics", 500));
  }
});

// Generate weekly slots based on working hours
export const generateWeeklySlots = catchAsync(async (req, res, next) => {
  // Only service centers and repair centers can access this
  if (!["service_center", "repair_center"].includes(req.user.role)) {
    return next(new AppError("Only service centers can generate slots", 403));
  }

  const { startDate, workingHours, slotSettings } = req.body;

  if (!startDate || !workingHours || !slotSettings) {
    return next(
      new AppError(
        "Start date, working hours, and slot settings are required",
        400
      )
    );
  }

  try {
    // First, update the user's working hours and slot settings
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          "businessInfo.operatingHours": convertToOperatingHours(workingHours),
          "businessInfo.slotSettings": slotSettings,
          lastModifiedBy: req.user._id,
        },
      },
      { new: true }
    );

    // Here you would implement the actual slot generation logic
    // For now, we'll just return a success message
    const generatedSlots = generateSlotsForWeek(
      startDate,
      workingHours,
      slotSettings
    );

    LOG.info({
      message: "Weekly slots generated",
      userId: req.user._id,
      startDate,
      slotsGenerated: generatedSlots.length,
    });

    res.status(200).json({
      success: true,
      message: `Weekly slots generated successfully. ${generatedSlots.length} slots created.`,
      data: {
        generatedSlots: generatedSlots.length,
        startDate,
      },
    });
  } catch (error) {
    LOG.error("Error generating weekly slots:", error);
    return next(new AppError("Failed to generate weekly slots", 500));
  }
});

// Helper function to get default operating hours
function getDefaultOperatingHours() {
  return {
    monday: {
      open: "08:00",
      close: "17:00",
      isOpen: true,
      breakStart: "12:00",
      breakEnd: "13:00",
    },
    tuesday: {
      open: "08:00",
      close: "17:00",
      isOpen: true,
      breakStart: "12:00",
      breakEnd: "13:00",
    },
    wednesday: {
      open: "08:00",
      close: "17:00",
      isOpen: true,
      breakStart: "12:00",
      breakEnd: "13:00",
    },
    thursday: {
      open: "08:00",
      close: "17:00",
      isOpen: true,
      breakStart: "12:00",
      breakEnd: "13:00",
    },
    friday: {
      open: "08:00",
      close: "17:00",
      isOpen: true,
      breakStart: "12:00",
      breakEnd: "13:00",
    },
    saturday: {
      open: "08:00",
      close: "15:00",
      isOpen: true,
      breakStart: "",
      breakEnd: "",
    },
    sunday: {
      open: "",
      close: "",
      isOpen: false,
      breakStart: "",
      breakEnd: "",
    },
  };
}

// Helper function to convert frontend working hours to database format
function convertToOperatingHours(workingHours) {
  const operatingHours = {};
  Object.keys(workingHours).forEach((day) => {
    const dayData = workingHours[day];
    operatingHours[day] = {
      open: dayData.startTime || "08:00",
      close: dayData.endTime || "17:00",
      isOpen: dayData.isOpen || false,
      breakStart: dayData.breakStart || "",
      breakEnd: dayData.breakEnd || "",
    };
  });
  return operatingHours;
}

// Helper function to generate time slots for a week
function generateSlotsForWeek(startDate, workingHours, slotSettings) {
  const slots = [];
  const start = new Date(startDate);
  const { defaultDuration, bufferTime } = slotSettings;

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);

    const dayName = currentDate
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const dayHours = workingHours[dayName];

    if (dayHours && dayHours.isOpen) {
      const daySlots = generateSlotsForDay(
        currentDate,
        dayHours,
        defaultDuration,
        bufferTime
      );
      slots.push(...daySlots);
    }
  }

  return slots;
}

// Helper function to generate slots for a single day
function generateSlotsForDay(date, dayHours, duration, bufferTime) {
  const slots = [];
  const startTime = new Date(`${date.toDateString()} ${dayHours.startTime}`);
  const endTime = new Date(`${date.toDateString()} ${dayHours.endTime}`);
  const breakStart = dayHours.breakStart
    ? new Date(`${date.toDateString()} ${dayHours.breakStart}`)
    : null;
  const breakEnd = dayHours.breakEnd
    ? new Date(`${date.toDateString()} ${dayHours.breakEnd}`)
    : null;

  let currentTime = new Date(startTime);

  while (currentTime < endTime) {
    const slotEnd = new Date(currentTime.getTime() + duration * 60000);

    // Skip if slot overlaps with break time
    if (
      breakStart &&
      breakEnd &&
      ((currentTime >= breakStart && currentTime < breakEnd) ||
        (slotEnd > breakStart && slotEnd <= breakEnd))
    ) {
      currentTime = new Date(breakEnd);
      continue;
    }

    // Skip if slot would extend beyond end time
    if (slotEnd > endTime) break;

    slots.push({
      date: date.toISOString().split("T")[0],
      startTime: currentTime.toTimeString().slice(0, 5),
      endTime: slotEnd.toTimeString().slice(0, 5),
      duration,
      status: "available",
    });

    // Move to next slot with buffer time
    currentTime = new Date(slotEnd.getTime() + bufferTime * 60000);
  }

  return slots;
}

export default {
  getWorkingHours,
  updateWorkingHours,
  getSlotSettings,
  updateSlotSettings,
  getSlotStats,
  generateWeeklySlots,
};
