// controllers/timeSlot.controller.js
import TimeSlot from "../models/booking.model.js";
import { catchAsync } from "../utils/catchAsync.util.js";
import { AppError } from "../utils/appError.util.js";
import LOG from "../configs/log.config.js";

// Create or update time slots for a day
export const createOrUpdateDaySlots = catchAsync(async (req, res, next) => {
  const { dayOfWeek, workingHours, availableSlots, blockedDates } = req.body;
  const serviceCenterId = req.user._id;

  console.log("Creating/updating time slots for:", {
    serviceCenterId,
    dayOfWeek,
    workingHours,
    availableSlots: availableSlots?.length || 0,
  });

  // Validate day of week
  const validDays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
  if (!validDays.includes(dayOfWeek)) {
    return next(new AppError("Invalid day of week", 400));
  }

  // Check if time slot already exists for this day
  let timeSlot = await TimeSlot.findOne({
    serviceCenter: serviceCenterId,
    dayOfWeek: dayOfWeek,
  });

  const slotData = {
    serviceCenter: serviceCenterId,
    dayOfWeek,
    workingHours,
    availableSlots: availableSlots || [],
    blockedDates: blockedDates || [],
    updatedBy: serviceCenterId,
  };

  if (timeSlot) {
    // Update existing
    Object.assign(timeSlot, slotData);
    await timeSlot.save();
  } else {
    // Create new
    slotData.createdBy = serviceCenterId;
    timeSlot = await TimeSlot.create(slotData);
  }

  res.status(200).json({
    success: true,
    message: `Time slots for ${dayOfWeek} ${
      timeSlot.isNew ? "created" : "updated"
    } successfully`,
    data: { timeSlot },
  });
});

// Get all time slots for service center
export const getServiceCenterTimeSlots = catchAsync(async (req, res, next) => {
  const serviceCenterId = req.user._id;

  const timeSlots = await TimeSlot.find({
    serviceCenter: serviceCenterId,
    isActive: true,
  }).sort({ dayOfWeek: 1 });

  // Create a complete week structure
  const daysOfWeek = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];
  const weekStructure = daysOfWeek.map((day) => {
    const daySlot = timeSlots.find((slot) => slot.dayOfWeek === day);
    return (
      daySlot || {
        dayOfWeek: day,
        dayDisplay: day.charAt(0) + day.slice(1).toLowerCase(),
        workingHours: { isOpen: false },
        availableSlots: [],
      }
    );
  });

  res.status(200).json({
    success: true,
    message: "Time slots retrieved successfully",
    data: {
      timeSlots: weekStructure,
      totalDays: timeSlots.length,
    },
  });
});

// Get available slots for a specific date (for booking)
export const getAvailableSlotsForDate = catchAsync(async (req, res, next) => {
  const { serviceCenterId, date } = req.query;

  if (!serviceCenterId || !date) {
    return next(new AppError("Service center ID and date are required", 400));
  }

  console.log("Getting available slots for:", { serviceCenterId, date });

  try {
    const availableSlots = await TimeSlot.getAvailableSlots(
      serviceCenterId,
      date
    );

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

    console.log("Available slots result:", {
      date,
      dayOfWeek,
      slotsCount: availableSlots.length,
    });

    res.status(200).json({
      success: true,
      message: "Available slots retrieved successfully",
      data: {
        date: targetDate,
        dayOfWeek,
        availableSlots: availableSlots.map((slot) => ({
          slotId: slot.slotId,
          timeRange: `${slot.startTime}-${slot.endTime}`,
          startTime: slot.startTime,
          endTime: slot.endTime,
          duration: slot.slotDuration,
          maxBookings: slot.maxBookings,
        })),
        totalAvailable: availableSlots.length,
      },
    });
  } catch (error) {
    console.error("Error getting available slots:", error);
    return next(new AppError("Failed to get available slots", 500));
  }
});

// Block specific dates or slots
export const blockDateOrSlots = catchAsync(async (req, res, next) => {
  const { dayOfWeek, blockedDate, reason, blockedSlots } = req.body;
  const serviceCenterId = req.user._id;

  const timeSlot = await TimeSlot.findOne({
    serviceCenter: serviceCenterId,
    dayOfWeek: dayOfWeek,
    isActive: true,
  });

  if (!timeSlot) {
    return next(new AppError(`No time slots found for ${dayOfWeek}`, 404));
  }

  // Check if date is already blocked
  const existingBlockIndex = timeSlot.blockedDates.findIndex((blocked) => {
    const blockedDateObj = new Date(blocked.date);
    const targetDateObj = new Date(blockedDate);
    blockedDateObj.setHours(0, 0, 0, 0);
    targetDateObj.setHours(0, 0, 0, 0);
    return blockedDateObj.getTime() === targetDateObj.getTime();
  });

  const blockData = {
    date: new Date(blockedDate),
    reason,
    blockedSlots: blockedSlots || [], // Empty array means all slots blocked
  };

  if (existingBlockIndex >= 0) {
    // Update existing block
    timeSlot.blockedDates[existingBlockIndex] = blockData;
  } else {
    // Add new block
    timeSlot.blockedDates.push(blockData);
  }

  timeSlot.updatedBy = serviceCenterId;
  await timeSlot.save();

  res.status(200).json({
    success: true,
    message: "Date/slots blocked successfully",
    data: { timeSlot },
  });
});

// Unblock specific dates
export const unblockDate = catchAsync(async (req, res, next) => {
  const { dayOfWeek, blockedDate } = req.body;
  const serviceCenterId = req.user._id;

  const timeSlot = await TimeSlot.findOne({
    serviceCenter: serviceCenterId,
    dayOfWeek: dayOfWeek,
    isActive: true,
  });

  if (!timeSlot) {
    return next(new AppError(`No time slots found for ${dayOfWeek}`, 404));
  }

  const targetDate = new Date(blockedDate);
  targetDate.setHours(0, 0, 0, 0);

  timeSlot.blockedDates = timeSlot.blockedDates.filter((blocked) => {
    const blockedDateObj = new Date(blocked.date);
    blockedDateObj.setHours(0, 0, 0, 0);
    return blockedDateObj.getTime() !== targetDate.getTime();
  });

  timeSlot.updatedBy = serviceCenterId;
  await timeSlot.save();

  res.status(200).json({
    success: true,
    message: "Date unblocked successfully",
    data: { timeSlot },
  });
});

// Delete time slots for a day
export const deleteDaySlots = catchAsync(async (req, res, next) => {
  const { dayOfWeek } = req.params;
  const serviceCenterId = req.user._id;

  const timeSlot = await TimeSlot.findOneAndUpdate(
    {
      serviceCenter: serviceCenterId,
      dayOfWeek: dayOfWeek,
      isActive: true,
    },
    {
      isActive: false,
      updatedBy: serviceCenterId,
    },
    { new: true }
  );

  if (!timeSlot) {
    return next(new AppError(`No time slots found for ${dayOfWeek}`, 404));
  }

  res.status(200).json({
    success: true,
    message: `Time slots for ${dayOfWeek} deleted successfully`,
  });
});

// Get time slot statistics
export const getTimeSlotStats = catchAsync(async (req, res, next) => {
  const serviceCenterId = req.user._id;

  const stats = await TimeSlot.aggregate([
    { $match: { serviceCenter: serviceCenterId, isActive: true } },
    {
      $group: {
        _id: null,
        totalDaysConfigured: { $sum: 1 },
        totalSlots: { $sum: { $size: "$availableSlots" } },
        openDays: {
          $sum: { $cond: ["$workingHours.isOpen", 1, 0] },
        },
        closedDays: {
          $sum: { $cond: ["$workingHours.isOpen", 0, 1] },
        },
        totalBlockedDates: { $sum: { $size: "$blockedDates" } },
      },
    },
  ]);

  const result = stats[0] || {
    totalDaysConfigured: 0,
    totalSlots: 0,
    openDays: 0,
    closedDays: 0,
    totalBlockedDates: 0,
  };

  res.status(200).json({
    success: true,
    message: "Time slot statistics retrieved successfully",
    data: {
      stats: result,
      remainingDays: 7 - result.totalDaysConfigured,
    },
  });
});

export default {
  createOrUpdateDaySlots,
  getServiceCenterTimeSlots,
  getAvailableSlotsForDate,
  blockDateOrSlots,
  unblockDate,
  deleteDaySlots,
  getTimeSlotStats,
};
