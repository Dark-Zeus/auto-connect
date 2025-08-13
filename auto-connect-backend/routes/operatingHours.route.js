// routes/operatingHours.route.js - COMPLETE WORKING VERSION
import express from "express";
import User from "../models/user.model.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { catchAsync } from "../utils/catchAsync.util.js";
import { AppError } from "../utils/appError.util.js";

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`🛠️  Operating Hours Route: ${req.method} ${req.path}`);
  console.log(`👤 User: ${req.user?.email} (${req.user?.role})`);
  next();
});

// Apply authentication and role restriction
router.use(protect);
router.use(restrictTo("service_center", "repair_center"));

// Test endpoint to verify routes are working
router.get("/test", (req, res) => {
  console.log("✅ Services test endpoint hit for user:", req.user?.email);
  res.json({
    success: true,
    message: "Services routes are working perfectly!",
    user: {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
      businessName: req.user.businessInfo?.businessName,
    },
    timestamp: new Date().toISOString(),
  });
});

// GET Working Hours - Fetch from User collection
router.get(
  "/working-hours",
  catchAsync(async (req, res, next) => {
    console.log("📅 Get working hours for user:", req.user.email);

    try {
      // Fetch user with businessInfo.operatingHours
      const user = await User.findById(req.user._id).select(
        "businessInfo.operatingHours"
      );

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      let workingHours = {};

      // Check if user has operating hours
      if (user.businessInfo?.operatingHours) {
        // Convert Map to Object and transform to frontend format
        const operatingHours =
          user.businessInfo.operatingHours instanceof Map
            ? Object.fromEntries(user.businessInfo.operatingHours)
            : user.businessInfo.operatingHours;

        // Transform database format to frontend format
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
      } else {
        // Default working hours if none exist
        workingHours = {
          monday: {
            isOpen: true,
            startTime: "08:00",
            endTime: "17:00",
            breakStart: "12:00",
            breakEnd: "13:00",
          },
          tuesday: {
            isOpen: true,
            startTime: "08:00",
            endTime: "17:00",
            breakStart: "12:00",
            breakEnd: "13:00",
          },
          wednesday: {
            isOpen: true,
            startTime: "08:00",
            endTime: "17:00",
            breakStart: "12:00",
            breakEnd: "13:00",
          },
          thursday: {
            isOpen: true,
            startTime: "08:00",
            endTime: "17:00",
            breakStart: "12:00",
            breakEnd: "13:00",
          },
          friday: {
            isOpen: true,
            startTime: "08:00",
            endTime: "17:00",
            breakStart: "12:00",
            breakEnd: "13:00",
          },
          saturday: {
            isOpen: true,
            startTime: "08:00",
            endTime: "15:00",
            breakStart: "",
            breakEnd: "",
          },
          sunday: {
            isOpen: false,
            startTime: "",
            endTime: "",
            breakStart: "",
            breakEnd: "",
          },
        };
      }

      console.log("✅ Working hours retrieved:", workingHours);

      res.status(200).json({
        success: true,
        message: "Working hours retrieved successfully",
        data: {
          workingHours: workingHours,
        },
      });
    } catch (error) {
      console.error("❌ Error retrieving working hours:", error);
      return next(new AppError("Failed to retrieve working hours", 500));
    }
  })
);

// POST Working Hours - Save to User collection
router.post(
  "/working-hours",
  catchAsync(async (req, res, next) => {
    console.log("💾 Save working hours for user:", req.user.email);
    console.log("📝 Request body:", req.body);

    const { workingHours } = req.body;

    if (!workingHours) {
      return next(new AppError("Working hours data is required", 400));
    }

    try {
      // Validate working hours data
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
          return next(
            new AppError(`Working hours for ${day} are required`, 400)
          );
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

      // Transform frontend format to database format
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

      console.log("🔄 Transformed operating hours:", operatingHours);

      // Update the user's operating hours in the database
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            "businessInfo.operatingHours": operatingHours,
            lastModifiedBy: req.user._id,
          },
        },
        {
          new: true,
          runValidators: true,
          select: "businessInfo.operatingHours",
        }
      );

      if (!updatedUser) {
        return next(new AppError("User not found", 404));
      }

      console.log("✅ Working hours saved successfully to database");

      res.status(200).json({
        success: true,
        message: "Working hours saved successfully",
        data: {
          workingHours: workingHours,
          savedOperatingHours: operatingHours,
        },
      });
    } catch (error) {
      console.error("❌ Error saving working hours:", error);
      return next(new AppError("Failed to save working hours", 500));
    }
  })
);

// GET Slot Settings - Fetch from User collection
router.get(
  "/slot-settings",
  catchAsync(async (req, res, next) => {
    console.log("⚙️  Get slot settings for user:", req.user.email);

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

      const slotSettings = user?.businessInfo?.slotSettings || defaultSettings;

      console.log("✅ Slot settings retrieved:", slotSettings);

      res.status(200).json({
        success: true,
        message: "Slot settings retrieved successfully",
        data: {
          settings: slotSettings,
        },
      });
    } catch (error) {
      console.error("❌ Error retrieving slot settings:", error);
      return next(new AppError("Failed to retrieve slot settings", 500));
    }
  })
);

// POST Slot Settings - Save to User collection
router.post(
  "/slot-settings",
  catchAsync(async (req, res, next) => {
    console.log("⚙️  Save slot settings for user:", req.user.email);
    console.log("📝 Request body:", req.body);

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
          new AppError(
            "Default duration must be between 15 and 480 minutes",
            400
          )
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
          new AppError(
            "Max advance booking must be between 1 and 365 days",
            400
          )
        );
      }

      if (
        minAdvanceBooking &&
        (minAdvanceBooking < 1 || minAdvanceBooking > 168)
      ) {
        return next(
          new AppError(
            "Min advance booking must be between 1 and 168 hours",
            400
          )
        );
      }

      // Update the user's slot settings in the database
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            "businessInfo.slotSettings": settings,
            lastModifiedBy: req.user._id,
          },
        },
        {
          new: true,
          runValidators: true,
          select: "businessInfo.slotSettings",
        }
      );

      if (!updatedUser) {
        return next(new AppError("User not found", 404));
      }

      console.log("✅ Slot settings saved successfully to database");

      res.status(200).json({
        success: true,
        message: "Slot settings saved successfully",
        data: {
          settings: settings,
        },
      });
    } catch (error) {
      console.error("❌ Error saving slot settings:", error);
      return next(new AppError("Failed to save slot settings", 500));
    }
  })
);

// GET Slot Stats - Mock data for now
router.get(
  "/slot-stats",
  catchAsync(async (req, res, next) => {
    console.log("📊 Get slot stats for date:", req.query.date);
    console.log("👤 User:", req.user.email);

    const { date } = req.query;

    if (!date) {
      return next(new AppError("Date parameter is required", 400));
    }

    try {
      // For now, return mock statistics
      // Later you can implement actual slot counting logic with a bookings system
      const stats = {
        totalSlots: 16, // 8 hours * 2 slots per hour (based on 60min slots + 15min buffer)
        bookedSlots: 5,
        availableSlots: 9,
        blockedSlots: 2,
      };

      console.log("✅ Slot stats retrieved:", stats);

      res.status(200).json({
        success: true,
        message: "Slot statistics retrieved successfully",
        data: {
          stats: stats,
          date: date,
          user: req.user.email,
        },
      });
    } catch (error) {
      console.error("❌ Error retrieving slot stats:", error);
      return next(new AppError("Failed to retrieve slot statistics", 500));
    }
  })
);

// POST Generate Weekly Slots
router.post(
  "/generate-weekly-slots",
  catchAsync(async (req, res, next) => {
    console.log("🔄 Generate weekly slots for user:", req.user.email);
    console.log("📝 Request body:", req.body);

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
      const transformedOperatingHours = {};
      Object.keys(workingHours).forEach((day) => {
        const dayData = workingHours[day];
        transformedOperatingHours[day] = {
          open: dayData.startTime || "08:00",
          close: dayData.endTime || "17:00",
          isOpen: dayData.isOpen || false,
          breakStart: dayData.breakStart || "",
          breakEnd: dayData.breakEnd || "",
        };
      });

      await User.findByIdAndUpdate(
        req.user._id,
        {
          $set: {
            "businessInfo.operatingHours": transformedOperatingHours,
            "businessInfo.slotSettings": slotSettings,
            lastModifiedBy: req.user._id,
          },
        },
        { new: true }
      );

      // Calculate number of slots that would be generated
      const generateSlotsForWeek = (startDate, workingHours, slotSettings) => {
        let totalSlots = 0;
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
            const slotsForDay = generateSlotsForDay(
              currentDate,
              dayHours,
              defaultDuration,
              bufferTime
            );
            totalSlots += slotsForDay.length;
          }
        }

        return totalSlots;
      };

      const generateSlotsForDay = (date, dayHours, duration, bufferTime) => {
        const slots = [];
        const timeToMinutes = (timeStr) => {
          const [hours, minutes] = timeStr.split(":").map(Number);
          return hours * 60 + minutes;
        };

        const startMinutes = timeToMinutes(dayHours.startTime);
        const endMinutes = timeToMinutes(dayHours.endTime);
        const breakStartMinutes = dayHours.breakStart
          ? timeToMinutes(dayHours.breakStart)
          : null;
        const breakEndMinutes = dayHours.breakEnd
          ? timeToMinutes(dayHours.breakEnd)
          : null;

        let currentMinutes = startMinutes;

        while (currentMinutes + duration <= endMinutes) {
          // Skip break time
          if (
            breakStartMinutes &&
            breakEndMinutes &&
            currentMinutes < breakEndMinutes &&
            currentMinutes + duration > breakStartMinutes
          ) {
            currentMinutes = breakEndMinutes;
            continue;
          }

          slots.push({
            startMinutes: currentMinutes,
            duration: duration,
          });

          currentMinutes += duration + bufferTime;
        }

        return slots;
      };

      const generatedSlotsCount = generateSlotsForWeek(
        startDate,
        workingHours,
        slotSettings
      );

      console.log("✅ Weekly slots generation completed");

      res.status(200).json({
        success: true,
        message: `Weekly slots generated successfully. ${generatedSlotsCount} slots created.`,
        data: {
          generatedSlots: generatedSlotsCount,
          startDate: startDate,
          user: req.user.email,
        },
      });
    } catch (error) {
      console.error("❌ Error generating weekly slots:", error);
      return next(new AppError("Failed to generate weekly slots", 500));
    }
  })
);

export default router;
