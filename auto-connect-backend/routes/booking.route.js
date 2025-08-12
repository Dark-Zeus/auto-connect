// routes/booking.route.js
import express from "express";
import {
  createBooking,
  getUserBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  submitFeedback,
  getBookingStats,
} from "../controllers/booking.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../utils/validation.util.js";
import Joi from "joi";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Validation schemas
const createBookingValidation = Joi.object({
  serviceCenterId: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid service center ID format",
    "string.length": "Invalid service center ID length",
    "any.required": "Service center ID is required",
  }),
  vehicle: Joi.object({
    registrationNumber: Joi.string().required().messages({
      "any.required": "Vehicle registration number is required",
    }),
    make: Joi.string().required().messages({
      "any.required": "Vehicle make is required",
    }),
    model: Joi.string().required().messages({
      "any.required": "Vehicle model is required",
    }),
    year: Joi.number()
      .integer()
      .min(1900)
      .max(new Date().getFullYear() + 1)
      .required()
      .messages({
        "number.min": "Vehicle year must be after 1900",
        "number.max": "Vehicle year cannot be in the future",
        "any.required": "Vehicle year is required",
      }),
  }).required(),
  services: Joi.array().items(Joi.string()).min(1).required().messages({
    "array.min": "At least one service must be selected",
    "any.required": "Services are required",
  }),
  preferredDate: Joi.date().min("now").required().messages({
    "date.min": "Preferred date cannot be in the past",
    "any.required": "Preferred date is required",
  }),
  preferredTimeSlot: Joi.string()
    .valid("09:00-11:00", "11:00-13:00", "13:00-15:00", "15:00-17:00")
    .required()
    .messages({
      "any.only": "Invalid time slot selected",
      "any.required": "Time slot is required",
    }),
  contactInfo: Joi.object({
    phone: Joi.string()
      .pattern(/^[0-9+\-\s()]+$/)
      .required()
      .messages({
        "string.pattern.base": "Invalid phone number format",
        "any.required": "Contact phone is required",
      }),
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email format",
      "any.required": "Contact email is required",
    }),
    preferredContactMethod: Joi.string()
      .valid("PHONE", "EMAIL", "SMS", "WHATSAPP")
      .default("PHONE"),
  }).required(),
  specialRequests: Joi.string().max(500).optional().allow(""),
});

const updateBookingStatusValidation = Joi.object({
  status: Joi.string()
    .valid(
      "PENDING",
      "CONFIRMED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
      "REJECTED"
    )
    .required(),
  message: Joi.string().max(500).optional().allow(""),
  proposedDate: Joi.date().optional(),
  proposedTimeSlot: Joi.string()
    .valid("09:00-11:00", "11:00-13:00", "13:00-15:00", "15:00-17:00")
    .optional(),
  estimatedDuration: Joi.string().max(50).optional().allow(""),
});

const cancelBookingValidation = Joi.object({
  reason: Joi.string().max(500).optional().allow(""),
});

const submitFeedbackValidation = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({
    "number.min": "Rating must be between 1 and 5",
    "number.max": "Rating must be between 1 and 5",
    "any.required": "Rating is required",
  }),
  comment: Joi.string().max(500).optional().allow(""),
});

const getBookingsValidation = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(50).optional(),
  status: Joi.string()
    .valid(
      "PENDING",
      "CONFIRMED",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
      "REJECTED"
    )
    .optional(),
  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional(),
  search: Joi.string().max(100).optional(),
});

const bookingIdValidation = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid booking ID format",
    "string.length": "Invalid booking ID length",
    "any.required": "Booking ID is required",
  }),
});

// Routes

// Create new booking (Vehicle owners only)
router.post(
  "/",
  restrictTo("vehicle_owner"),
  validate(createBookingValidation),
  createBooking
);

// Get user's bookings (Vehicle owners and Service centers)
router.get(
  "/",
  restrictTo("vehicle_owner", "service_center"),
  validate(getBookingsValidation, "query"),
  getUserBookings
);

// Get booking statistics
router.get(
  "/stats",
  restrictTo("vehicle_owner", "service_center", "system_admin"),
  getBookingStats
);

// Get specific booking details
router.get(
  "/:id",
  restrictTo("vehicle_owner", "service_center", "system_admin"),
  validate(bookingIdValidation, "params"),
  getBooking
);

// Update booking status (Service centers only)
router.patch(
  "/:id/status",
  restrictTo("service_center"),
  validate(bookingIdValidation, "params"),
  validate(updateBookingStatusValidation),
  updateBookingStatus
);

// Cancel booking (Vehicle owners only)
router.patch(
  "/:id/cancel",
  restrictTo("vehicle_owner"),
  validate(bookingIdValidation, "params"),
  validate(cancelBookingValidation),
  cancelBooking
);

// Submit feedback (Vehicle owners only)
router.post(
  "/:id/feedback",
  restrictTo("vehicle_owner"),
  validate(bookingIdValidation, "params"),
  validate(submitFeedbackValidation),
  submitFeedback
);

export default router;
