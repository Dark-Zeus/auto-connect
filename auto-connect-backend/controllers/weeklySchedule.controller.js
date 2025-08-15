// controllers/weeklySchedule.controller.js
import WeeklySchedule from "../models/WeeklySchedule.model.js";
import Booking from "../models/Booking.model.js";
import LOG from "../configs/log.config.js";
import { catchAsync } from "../utils/catchAsync.util.js";
import { AppError } from "../utils/appError.util.js";

// Get or create weekly schedule for service center
export const getMyWeeklySchedule = catchAsync(async (req, res, next) => {
  const serviceCenterId = req.user._id;

  let schedule = await WeeklySchedule.findOne({
    serviceCenter: serviceCenterId,
  });

  // If no schedule exists, create default one
  if (!schedule) {
    schedule = new WeeklySchedule({
      serviceCenter: serviceCenterId,
      schedule: {
        monday: { isOpen: true, startTime: "08:30", endTime: "18:00" },
        tuesday: { isOpen: true, startTime: "08:30", endTime: "18:00" },
        wednesday: { isOpen: true, startTime: "08:30", endTime: "18:00" },
        thursday: { isOpen: true, startTime: "08:30", endTime: "18:00" },
        friday: { isOpen: true, startTime: "08:30", endTime: "18:00" },
        saturday: { isOpen: true, startTime: "09:00", endTime: "15:00" },
        sunday: { isOpen: false, startTime: "", endTime: "" },
      },
      slotSettings: {
        duration: 60,
        bufferTime: 15,
        advanceBookingDays: 30,
      },
    });
    await schedule.save();
    LOG.info(
      `Created default weekly schedule for service center ${serviceCenterId}`
    );
  }

  res.status(200).json({
    success: true,
    message: "Weekly schedule retrieved successfully",
    data: {
      schedule: schedule,
    },
  });
});

// Update weekly schedule
export const updateWeeklySchedule = catchAsync(async (req, res, next) => {
  const serviceCenterId = req.user._id;
  const { schedule, slotSettings } = req.body;

  // Validate schedule structure
  const validDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  if (schedule) {
    for (const day of validDays) {
      if (schedule[day]) {
        const daySchedule = schedule[day];
        if (
          daySchedule.isOpen &&
          (!daySchedule.startTime || !daySchedule.endTime)
        ) {
          return next(
            new AppError(
              `Start time and end time are required for ${day} when marked as open`,
              400
            )
          );
        }

        // Validate time format
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (daySchedule.startTime && !timeRegex.test(daySchedule.startTime)) {
          return next(
            new AppError(`Invalid start time format for ${day}`, 400)
          );
        }
        if (daySchedule.endTime && !timeRegex.test(daySchedule.endTime)) {
          return next(new AppError(`Invalid end time format for ${day}`, 400));
        }

        // Validate time logic
        if (
          daySchedule.isOpen &&
          daySchedule.startTime >= daySchedule.endTime
        ) {
          return next(
            new AppError(`End time must be after start time for ${day}`, 400)
          );
        }
      }
    }
  }

  // Validate slot settings
  if (slotSettings) {
    if (
      slotSettings.duration &&
      (slotSettings.duration < 15 || slotSettings.duration > 240)
    ) {
      return next(
        new AppError("Slot duration must be between 15 and 240 minutes", 400)
      );
    }
    if (
      slotSettings.bufferTime &&
      (slotSettings.bufferTime < 0 || slotSettings.bufferTime > 60)
    ) {
      return next(
        new AppError("Buffer time must be between 0 and 60 minutes", 400)
      );
    }
    if (
      slotSettings.advanceBookingDays &&
      (slotSettings.advanceBookingDays < 1 ||
        slotSettings.advanceBookingDays > 90)
    ) {
      return next(
        new AppError("Advance booking days must be between 1 and 90", 400)
      );
    }
  }

  const updatedSchedule = await WeeklySchedule.findOneAndUpdate(
    { serviceCenter: serviceCenterId },
    {
      ...(schedule && { schedule }),
      ...(slotSettings && { slotSettings }),
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  LOG.info(`Updated weekly schedule for service center ${serviceCenterId}`);

  res.status(200).json({
    success: true,
    message: "Weekly schedule updated successfully",
    data: {
      schedule: updatedSchedule,
    },
  });
});

// Get available time slots for a date range
export const getAvailableSlots = catchAsync(async (req, res, next) => {
  const { serviceCenterId, startDate, endDate, date } = req.query;

  if (!serviceCenterId) {
    return next(new AppError("Service center ID is required", 400));
  }

  let fromDate, toDate;

  if (date) {
    // Single date
    fromDate = toDate = date;
  } else if (startDate && endDate) {
    // Date range
    fromDate = startDate;
    toDate = endDate;
  } else {
    // Default to next 7 days
    fromDate = new Date().toISOString().split("T")[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    toDate = nextWeek.toISOString().split("T")[0];
  }

  const schedule = await WeeklySchedule.findOne({
    serviceCenter: serviceCenterId,
  });
  if (!schedule) {
    return next(new AppError("No schedule found for this service center", 404));
  }

  // Generate available slots
  const availableSlots = [];
  const currentDate = new Date(fromDate);
  const lastDate = new Date(toDate);

  // Get existing bookings for the date range
  const existingBookings = await Booking.find({
    serviceCenter: serviceCenterId,
    preferredDate: {
      $gte: new Date(fromDate),
      $lte: new Date(toDate),
    },
    status: { $nin: ["CANCELLED", "REJECTED"] },
    isActive: true,
  }).select("preferredDate preferredTimeSlot");

  while (currentDate <= lastDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const daySlots = schedule.generateSlotsForDate(dateStr);

    // Mark slots as booked or available and check if past time
    const slotsWithAvailability = daySlots.map((slot) => {
      const isBooked = existingBookings.some((booking) => {
        const bookingDateStr = booking.preferredDate
          .toISOString()
          .split("T")[0];
        return (
          bookingDateStr === dateStr &&
          (booking.preferredTimeSlot === slot.startTime ||
            booking.preferredTimeSlot.startsWith(slot.startTime))
        );
      });

      // Check if slot time has passed for today
      let isPastTime = false;
      if (dateStr === new Date().toISOString().split("T")[0]) {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [slotHour, slotMinute] = slot.startTime.split(":").map(Number);
        const slotTime = slotHour * 60 + slotMinute;
        isPastTime = slotTime <= currentTime;
      }

      const isAvailable = !isBooked && !isPastTime;

      return {
        ...slot,
        isAvailable: isAvailable,
        isBooked: isBooked,
        isPastTime: isPastTime,
        status: isBooked ? "BOOKED" : isPastTime ? "PAST" : "AVAILABLE",
      };
    });

    availableSlots.push(...slotsWithAvailability);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  res.status(200).json({
    success: true,
    message: "Available slots retrieved successfully",
    data: {
      slots: availableSlots,
      totalSlots: availableSlots.length,
      dateRange: { from: fromDate, to: toDate },
    },
  });
});

// Block a specific date
export const blockDate = catchAsync(async (req, res, next) => {
  const serviceCenterId = req.user._id;
  const { date, reason } = req.body;

  if (!date) {
    return next(new AppError("Date is required", 400));
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return next(new AppError("Invalid date format. Use YYYY-MM-DD", 400));
  }

  const schedule = await WeeklySchedule.findOne({
    serviceCenter: serviceCenterId,
  });
  if (!schedule) {
    return next(new AppError("No schedule found", 404));
  }

  await schedule.blockDate(date, reason);

  LOG.info(`Blocked date ${date} for service center ${serviceCenterId}`);

  res.status(200).json({
    success: true,
    message: "Date blocked successfully",
    data: {
      blockedDate: date,
      reason: reason || "Unavailable",
    },
  });
});

// Unblock a specific date
export const unblockDate = catchAsync(async (req, res, next) => {
  const serviceCenterId = req.user._id;
  const { date } = req.params;

  const schedule = await WeeklySchedule.findOne({
    serviceCenter: serviceCenterId,
  });
  if (!schedule) {
    return next(new AppError("No schedule found", 404));
  }

  await schedule.unblockDate(date);

  LOG.info(`Unblocked date ${date} for service center ${serviceCenterId}`);

  res.status(200).json({
    success: true,
    message: "Date unblocked successfully",
    data: {
      unblockedDate: date,
    },
  });
});

// Get schedule statistics
export const getScheduleStats = catchAsync(async (req, res, next) => {
  const serviceCenterId = req.user._id;

  const schedule = await WeeklySchedule.findOne({
    serviceCenter: serviceCenterId,
  });
  if (!schedule) {
    return next(new AppError("No schedule found", 404));
  }

  // Calculate stats
  const openDays = Object.values(schedule.schedule).filter(
    (day) => day.isOpen
  ).length;
  const closedDays = 7 - openDays;
  const blockedDatesCount = schedule.blockedDates.length;

  // Calculate total weekly slots
  let totalWeeklySlots = 0;
  Object.entries(schedule.schedule).forEach(([day, daySchedule]) => {
    if (daySchedule.isOpen) {
      const slots = schedule.generateSlotsForDate("2024-01-01"); // Use any date to calculate slots
      totalWeeklySlots += slots.length;
    }
  });

  // Get upcoming bookings count
  const today = new Date().toISOString().split("T")[0];
  const nextMonth = new Date();
  nextMonth.setDate(nextMonth.getDate() + 30);

  const upcomingBookings = await Booking.countDocuments({
    serviceProvider: serviceCenterId,
    bookingDate: {
      $gte: today,
      $lte: nextMonth.toISOString().split("T")[0],
    },
    status: { $nin: ["cancelled", "rejected"] },
  });

  res.status(200).json({
    success: true,
    message: "Schedule statistics retrieved successfully",
    data: {
      stats: {
        openDays,
        closedDays,
        totalWeeklySlots,
        blockedDatesCount,
        upcomingBookings,
        slotDuration: schedule.slotSettings.duration,
        advanceBookingDays: schedule.slotSettings.advanceBookingDays,
      },
    },
  });
});
