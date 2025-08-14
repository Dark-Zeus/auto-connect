// routes/timeSlot.route.js
import express from "express";
import {
  createOrUpdateDaySlots,
  getServiceCenterTimeSlots,
  getAvailableSlotsForDate,
  blockDateOrSlots,
  unblockDate,
  deleteDaySlots,
  getTimeSlotStats,
} from "../controllers/timeSlot.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../utils/validation.util.js";
import Joi from "joi";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Validation schemas
const createUpdateSlotsValidation = Joi.object({
  dayOfWeek: Joi.string()
    .valid(
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY"
    )
    .required()
    .messages({
      "any.only":
        "Day of week must be one of: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY",
      "any.required": "Day of week is required",
    }),
  workingHours: Joi.object({
    isOpen: Joi.boolean().required(),
    startTime: Joi.string().when("isOpen", {
      is: true,
      then: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .required(),
      otherwise: Joi.optional(),
    }),
    endTime: Joi.string().when("isOpen", {
      is: true,
      then: Joi.string()
        .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .required(),
      otherwise: Joi.optional(),
    }),
  }).required(),
  availableSlots: Joi.array()
    .items(
      Joi.object({
        startTime: Joi.string()
          .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
          .required(),
        endTime: Joi.string()
          .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
          .required(),
        isAvailable: Joi.boolean().default(true),
        maxBookings: Joi.number().integer().min(1).default(1),
        slotDuration: Joi.number().integer().min(30).default(120),
      })
    )
    .optional(),
  blockedDates: Joi.array()
    .items(
      Joi.object({
        date: Joi.date().required(),
        reason: Joi.string().max(200).optional(),
        blockedSlots: Joi.array().items(Joi.string()).optional(),
      })
    )
    .optional(),
});

const blockDateValidation = Joi.object({
  dayOfWeek: Joi.string()
    .valid(
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY"
    )
    .required(),
  blockedDate: Joi.date().required(),
  reason: Joi.string().max(200).optional(),
  blockedSlots: Joi.array().items(Joi.string()).optional(),
});

const unblockDateValidation = Joi.object({
  dayOfWeek: Joi.string()
    .valid(
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY"
    )
    .required(),
  blockedDate: Joi.date().required(),
});

const getAvailableSlotsValidation = Joi.object({
  serviceCenterId: Joi.string().hex().length(24).required(),
  date: Joi.date().required(),
});

// Routes

// Create or update time slots for a specific day (Service centers only)
router.post(
  "/",
  restrictTo("service_center"),
  validate(createUpdateSlotsValidation),
  createOrUpdateDaySlots
);

// Get all time slots for the logged-in service center
router.get(
  "/my-slots",
  restrictTo("service_center"),
  getServiceCenterTimeSlots
);

// Get time slot statistics for service center
router.get("/stats", restrictTo("service_center"), getTimeSlotStats);

// Get available slots for a specific date and service center (For booking)
router.get(
  "/available",
  restrictTo("vehicle_owner"),
  validate(getAvailableSlotsValidation, "query"),
  getAvailableSlotsForDate
);

// Block specific dates or slots
router.post(
  "/block",
  restrictTo("service_center"),
  validate(blockDateValidation),
  blockDateOrSlots
);

// Unblock specific dates
router.post(
  "/unblock",
  restrictTo("service_center"),
  validate(unblockDateValidation),
  unblockDate
);

// Delete time slots for a specific day
router.delete("/:dayOfWeek", restrictTo("service_center"), deleteDaySlots);

export default router;
