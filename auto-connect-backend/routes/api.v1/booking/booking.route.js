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
  getDashboardStats,
  getAvailableTimeSlots,
  submitServiceCompletionReport,
  getServiceCompletionReport,
} from "../../../controllers/booking.controller.js";
import { protect, restrictTo } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../utils/validation.util.js";
import { uploadMultiple, handleMulterError } from "../../../configs/multer.config.js";
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
  preferredDate: Joi.date()
    .custom((value, helpers) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return helpers.error("date.min");
      }
      return value;
    })
    .required()
    .messages({
      "date.min": "Preferred date cannot be in the past",
      "any.required": "Preferred date is required",
    }),
  preferredTimeSlot: Joi.string()
    .pattern(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](-([0-1]?[0-9]|2[0-3]):[0-5][0-9])?$/
    )
    .required()
    .messages({
      "string.pattern.base": "Time slot must be in HH:MM or HH:MM-HH:MM format",
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
      // "COMPLETED", - Removed: Use completion report endpoint instead
      "CANCELLED",
      "REJECTED"
    )
    .required()
    .messages({
      "any.only": "Invalid status. To complete a service, please use the completion report endpoint.",
    }),
  message: Joi.string().max(500).optional().allow(""),
  proposedDate: Joi.date().optional(),
  proposedTimeSlot: Joi.string()
    .pattern(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](-([0-1]?[0-9]|2[0-3]):[0-5][0-9])?$/
    )
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

const serviceCompletionReportValidation = Joi.object({
  completedServices: Joi.array()
    .items(
      Joi.object({
        serviceName: Joi.string().required().messages({
          "any.required": "Service name is required",
        }),
        description: Joi.string().max(500).optional().allow(""),
        partsUsed: Joi.array()
          .items(
            Joi.object({
              partName: Joi.string().required().messages({
                "any.required": "Part name is required",
              }),
              partNumber: Joi.string().optional().allow(""),
              quantity: Joi.number().integer().min(1).required().messages({
                "number.min": "Quantity must be at least 1",
                "any.required": "Quantity is required",
              }),
              unitPrice: Joi.number().min(0).required().messages({
                "number.min": "Unit price cannot be negative",
                "any.required": "Unit price is required",
              }),
              totalPrice: Joi.number().min(0).required().messages({
                "number.min": "Total price cannot be negative",
                "any.required": "Total price is required",
              }),
              condition: Joi.string()
                .valid("NEW", "REFURBISHED", "USED")
                .default("NEW"),
            })
          )
          .optional()
          .default([]),
        laborDetails: Joi.object({
          hoursWorked: Joi.number().min(0).required().messages({
            "number.min": "Hours worked cannot be negative",
            "any.required": "Hours worked is required",
          }),
          laborRate: Joi.number().min(0).required().messages({
            "number.min": "Labor rate cannot be negative",
            "any.required": "Labor rate is required",
          }),
          laborCost: Joi.number().min(0).required().messages({
            "number.min": "Labor cost cannot be negative",
            "any.required": "Labor cost is required",
          }),
        })
          .required()
          .messages({
            "any.required": "Labor details are required",
          }),
        serviceCost: Joi.number().min(0).required().messages({
          "number.min": "Service cost cannot be negative",
          "any.required": "Service cost is required",
        }),
        partsRequired: Joi.boolean().optional().default(false),
        serviceStatus: Joi.string()
          .valid("COMPLETED", "PARTIALLY_COMPLETED", "NOT_COMPLETED")
          .default("COMPLETED"),
        notes: Joi.string().max(1000).optional().allow(""),
      })
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one completed service is required",
      "any.required": "Completed services are required",
    }),
  additionalWork: Joi.array()
    .items(
      Joi.object({
        workDescription: Joi.string().max(500).required().messages({
          "any.required": "Work description is required",
        }),
        reason: Joi.string().max(500).required().messages({
          "any.required": "Reason is required",
        }),
        cost: Joi.number().min(0).required().messages({
          "number.min": "Cost cannot be negative",
          "any.required": "Cost is required",
        }),
        customerApproved: Joi.boolean().default(false),
        approvalDate: Joi.date().optional(),
      })
    )
    .optional()
    .default([]),
  totalCostBreakdown: Joi.object({
    taxes: Joi.number().min(0).default(0),
    discount: Joi.number().min(0).default(0),
  }).optional(),
  workStartTime: Joi.date().optional(),
  workEndTime: Joi.date().optional(),
  totalTimeSpent: Joi.string().max(100).optional().allow(""),
  vehicleCondition: Joi.object({
    before: Joi.object({
      mileage: Joi.number().min(0).optional(),
      fuelLevel: Joi.string()
        .valid("EMPTY", "1/4", "1/2", "3/4", "FULL")
        .optional(),
      externalCondition: Joi.string().max(500).optional().allow(""),
      internalCondition: Joi.string().max(500).optional().allow(""),
      photos: Joi.array().items(Joi.string()).optional().default([]),
    }).optional(),
    after: Joi.object({
      mileage: Joi.number().min(0).optional(),
      fuelLevel: Joi.string()
        .valid("EMPTY", "1/4", "1/2", "3/4", "FULL")
        .optional(),
      externalCondition: Joi.string().max(500).optional().allow(""),
      internalCondition: Joi.string().max(500).optional().allow(""),
      photos: Joi.array().items(Joi.string()).optional().default([]),
    }).optional(),
  }).optional(),
  technician: Joi.object({
    name: Joi.string().required().messages({
      "any.required": "Technician name is required",
    }),
    employeeId: Joi.string().optional().allow(""),
    signature: Joi.string().optional().allow(""),
  })
    .required()
    .messages({
      "any.required": "Technician information is required",
    }),
  qualityCheck: Joi.object({
    performed: Joi.boolean().default(false),
    performedBy: Joi.string().optional().allow(""),
    checklist: Joi.array()
      .items(
        Joi.object({
          item: Joi.string().required(),
          status: Joi.string().valid("PASS", "FAIL", "N/A").required(),
          notes: Joi.string().optional().allow(""),
        })
      )
      .optional()
      .default([]),
    overallRating: Joi.string()
      .valid("EXCELLENT", "GOOD", "SATISFACTORY", "NEEDS_IMPROVEMENT")
      .optional(),
    notes: Joi.string().max(1000).optional().allow(""),
  }).optional(),
  recommendations: Joi.array()
    .items(
      Joi.object({
        type: Joi.string()
          .valid("IMMEDIATE", "SOON", "ROUTINE", "OBSERVATION")
          .required(),
        description: Joi.string().max(500).required(),
        estimatedCost: Joi.number().min(0).optional(),
        priority: Joi.string().valid("HIGH", "MEDIUM", "LOW").default("MEDIUM"),
      })
    )
    .optional()
    .default([]),
  customerNotification: Joi.object({
    notified: Joi.boolean().default(false),
    notificationDate: Joi.date().optional(),
    notificationMethod: Joi.string()
      .valid("PHONE", "EMAIL", "SMS", "IN_PERSON")
      .optional(),
  }).optional(),
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

// Get dashboard statistics (Service centers only)
router.get(
  "/dashboard-stats",
  restrictTo("service_center"),
  getDashboardStats
);

// Get available time slots for a specific date and service center
router.get(
  "/available-slots",
  restrictTo("vehicle_owner"),
  getAvailableTimeSlots
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

// Middleware to parse JSON strings from FormData
const parseFormDataJSON = (req, res, next) => {
  if (req.body) {
    // Parse JSON strings back to objects/arrays
    const fieldsToParse = [
      'completedServices',
      'additionalWork',
      'totalCostBreakdown',
      'vehicleCondition',
      'technician',
      'qualityCheck',
      'recommendations',
      'customerNotification'
    ];

    fieldsToParse.forEach(field => {
      if (req.body[field] && typeof req.body[field] === 'string') {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (error) {
          console.error(`Failed to parse ${field}:`, error);
        }
      }
    });
  }
  next();
};

// Submit service completion report (Service centers only)
router.post(
  "/:id/completion-report",
  restrictTo("service_center"),
  uploadMultiple.array("supportingDocuments", 10),
  handleMulterError,
  parseFormDataJSON, // Parse JSON strings before validation
  validate(bookingIdValidation, "params"),
  validate(serviceCompletionReportValidation),
  submitServiceCompletionReport
);

// Get service completion report (Service centers and Vehicle owners)
router.get(
  "/:id/completion-report",
  restrictTo("vehicle_owner", "service_center", "system_admin"),
  validate(bookingIdValidation, "params"),
  getServiceCompletionReport
);

export default router;
