// utils/addedVehicleValidation.util.js
import { body, param, query, validationResult } from "express-validator";
import { AppError } from "./appError.util.js";
import mongoose from "mongoose";

// Validation middleware
export const validate = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      }));

      console.log("Validation errors:", errorMessages);

      return next(
        new AppError(
          `Validation failed: ${errorMessages
            .map((e) => e.message)
            .join(", ")}`,
          400
        )
      );
    }

    next();
  };
};

// Custom validator for MongoDB ObjectId
const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

// Add vehicle validation rules
export const addVehicleValidation = [
  body("vehicleId")
    .notEmpty()
    .withMessage("Vehicle ID is required")
    .custom(isValidObjectId)
    .withMessage("Invalid vehicle ID format"),

  body("purpose")
    .optional()
    .isIn([
      "SERVICE_BOOKING",
      "INSURANCE_CLAIM",
      "MAINTENANCE_SCHEDULE",
      "REPAIR_REQUEST",
      "INSPECTION",
      "SALE_LISTING",
      "RENTAL",
      "OTHER",
    ])
    .withMessage("Invalid purpose value"),

  body("notes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters")
    .trim(),

  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .withMessage("Invalid priority value"),

  body("scheduledDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format")
    .custom((value) => {
      if (value && new Date(value) < new Date()) {
        throw new Error("Scheduled date cannot be in the past");
      }
      return true;
    }),

  body("serviceDetails.serviceType")
    .optional()
    .isIn([
      "OIL_CHANGE",
      "BRAKE_SERVICE",
      "ENGINE_REPAIR",
      "TRANSMISSION_SERVICE",
      "ELECTRICAL_REPAIR",
      "BODY_WORK",
      "TIRE_SERVICE",
      "AC_SERVICE",
      "GENERAL_MAINTENANCE",
      "INSPECTION",
      "OTHER",
    ])
    .withMessage("Invalid service type"),

  body("serviceDetails.estimatedCost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Estimated cost must be a positive number"),

  body("serviceDetails.estimatedDuration")
    .optional()
    .isLength({ max: 50 })
    .withMessage("Estimated duration cannot exceed 50 characters"),

  body("serviceDetails.urgency")
    .optional()
    .isBoolean()
    .withMessage("Urgency must be true or false"),

  body("contactInfo.phone")
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage("Invalid phone number format"),

  body("contactInfo.email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("contactInfo.preferredContactMethod")
    .optional()
    .isIn(["PHONE", "EMAIL", "SMS", "WHATSAPP"])
    .withMessage("Invalid contact method"),

  body("location.address")
    .optional()
    .isLength({ max: 200 })
    .withMessage("Address cannot exceed 200 characters")
    .trim(),

  body("location.city")
    .optional()
    .isLength({ max: 50 })
    .withMessage("City cannot exceed 50 characters")
    .trim(),

  body("location.district")
    .optional()
    .isLength({ max: 50 })
    .withMessage("District cannot exceed 50 characters")
    .trim(),

  body("location.coordinates.latitude")
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Invalid latitude value"),

  body("location.coordinates.longitude")
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Invalid longitude value"),
];

// Update added vehicle validation rules (more lenient)
export const updateAddedVehicleValidation = [
  body("purpose")
    .optional()
    .isIn([
      "SERVICE_BOOKING",
      "INSURANCE_CLAIM",
      "MAINTENANCE_SCHEDULE",
      "REPAIR_REQUEST",
      "INSPECTION",
      "SALE_LISTING",
      "RENTAL",
      "OTHER",
    ])
    .withMessage("Invalid purpose value"),

  body("notes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters")
    .trim(),

  body("status")
    .optional()
    .isIn(["ACTIVE", "COMPLETED", "CANCELLED", "PENDING"])
    .withMessage("Invalid status value"),

  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .withMessage("Invalid priority value"),

  body("scheduledDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid date format"),

  body("serviceDetails.serviceType")
    .optional()
    .isIn([
      "OIL_CHANGE",
      "BRAKE_SERVICE",
      "ENGINE_REPAIR",
      "TRANSMISSION_SERVICE",
      "ELECTRICAL_REPAIR",
      "BODY_WORK",
      "TIRE_SERVICE",
      "AC_SERVICE",
      "GENERAL_MAINTENANCE",
      "INSPECTION",
      "OTHER",
    ])
    .withMessage("Invalid service type"),

  body("serviceDetails.estimatedCost")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Estimated cost must be a positive number"),

  body("contactInfo.phone")
    .optional()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage("Invalid phone number format"),

  body("contactInfo.email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("contactInfo.preferredContactMethod")
    .optional()
    .isIn(["PHONE", "EMAIL", "SMS", "WHATSAPP"])
    .withMessage("Invalid contact method"),
];

// Parameter validation for routes with ID
export const validateObjectId = [
  param("id").custom(isValidObjectId).withMessage("Invalid ID format"),
];

// NIC parameter validation
export const validateNIC = [
  param("nicNumber")
    .matches(/^([0-9]{9}[VXvx]|[0-9]{12})$/)
    .withMessage("Invalid NIC format"),
];

// Query parameter validation for pagination and filtering
export const validateQueryParams = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("status")
    .optional()
    .isIn(["ACTIVE", "COMPLETED", "CANCELLED", "PENDING"])
    .withMessage("Invalid status filter"),

  query("purpose")
    .optional()
    .isIn([
      "SERVICE_BOOKING",
      "INSURANCE_CLAIM",
      "MAINTENANCE_SCHEDULE",
      "REPAIR_REQUEST",
      "INSPECTION",
      "SALE_LISTING",
      "RENTAL",
      "OTHER",
    ])
    .withMessage("Invalid purpose filter"),

  query("sortBy")
    .optional()
    .isIn(["createdAt", "updatedAt", "scheduledDate", "priority", "status"])
    .withMessage("Invalid sort field"),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),

  query("search")
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 1 and 100 characters")
    .trim(),
];

// Mark completed validation
export const markCompletedValidation = [
  body("notes")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters")
    .trim(),
];

// Bulk operations validation
export const bulkUpdateValidation = [
  body("ids").isArray({ min: 1 }).withMessage("At least one ID is required"),

  body("ids.*")
    .custom(isValidObjectId)
    .withMessage("Invalid ID format in the array"),

  body("status")
    .optional()
    .isIn(["ACTIVE", "COMPLETED", "CANCELLED", "PENDING"])
    .withMessage("Invalid status value"),

  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .withMessage("Invalid priority value"),
];

export default {
  validate,
  addVehicleValidation,
  updateAddedVehicleValidation,
  validateObjectId,
  validateNIC,
  validateQueryParams,
  markCompletedValidation,
  bulkUpdateValidation,
};
