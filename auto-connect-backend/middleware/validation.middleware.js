import { validationResult, body, param, query } from "express-validator";
import LOG from "../configs/log.config.js";

// Middleware to handle validation errors
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }));

    LOG.warn("Validation failed", {
      endpoint: req.originalUrl,
      method: req.method,
      errors: errorMessages,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errorMessages,
    });
  }

  next();
};

// User registration validation rules
export const validateUserRegistration = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name must contain only letters and spaces"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name must contain only letters and spaces"),

  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .isLength({ max: 255 })
    .withMessage("Email address is too long"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),

  body("phone")
    .trim()
    .matches(/^(\+94|0)?[0-9]{9}$/)
    .withMessage(
      "Please provide a valid Sri Lankan phone number (e.g., +94771234567 or 0771234567)"
    ),

  body("role")
    .isIn(["vehicle_owner", "service_provider", "insurance_company"])
    .withMessage(
      "Role must be one of: vehicle_owner, service_provider, insurance_company"
    ),

  handleValidationErrors,
];

// User login validation rules
export const validateUserLogin = [
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("password").notEmpty().withMessage("Password is required"),

  handleValidationErrors,
];

// Password reset request validation
export const validatePasswordResetRequest = [
  body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Please provide a valid email address"),

  handleValidationErrors,
];

// Password reset validation
export const validatePasswordReset = [
  body("token")
    .notEmpty()
    .withMessage("Reset token is required")
    .isLength({ min: 20 })
    .withMessage("Invalid reset token format"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    }
    return true;
  }),

  handleValidationErrors,
];

// Change password validation
export const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),

  body("confirmNewPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("New password confirmation does not match new password");
    }
    return true;
  }),

  handleValidationErrors,
];

// Email verification validation
export const validateEmailVerification = [
  param("token")
    .notEmpty()
    .withMessage("Verification token is required")
    .isLength({ min: 20 })
    .withMessage("Invalid verification token format"),

  handleValidationErrors,
];

// Refresh token validation
export const validateRefreshToken = [
  body("refreshToken").notEmpty().withMessage("Refresh token is required"),

  handleValidationErrors,
];

// Profile update validation
export const validateProfileUpdate = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name must contain only letters and spaces"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name must contain only letters and spaces"),

  body("phone")
    .optional()
    .trim()
    .matches(/^(\+94|0)?[0-9]{9}$/)
    .withMessage("Please provide a valid Sri Lankan phone number"),

  handleValidationErrors,
];

// Query parameter validation for user listing
export const validateUserQuery = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("role")
    .optional()
    .isIn(["vehicle_owner", "service_provider", "insurance_company", "admin"])
    .withMessage("Invalid role specified"),

  query("isVerified")
    .optional()
    .isBoolean()
    .withMessage("isVerified must be a boolean value"),

  query("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),

  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 1 and 100 characters"),

  handleValidationErrors,
];

// User ID parameter validation
export const validateUserId = [
  param("userId").isMongoId().withMessage("Invalid user ID format"),

  handleValidationErrors,
];

// Business registration validation (for service providers)
export const validateBusinessRegistration = [
  body("businessName")
    .trim()
    .notEmpty()
    .withMessage("Business name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Business name must be between 2 and 100 characters"),

  body("licenseNumber")
    .trim()
    .notEmpty()
    .withMessage("License number is required")
    .isLength({ min: 5, max: 50 })
    .withMessage("License number must be between 5 and 50 characters"),

  body("address.street")
    .trim()
    .notEmpty()
    .withMessage("Street address is required"),

  body("address.city").trim().notEmpty().withMessage("City is required"),

  body("address.province")
    .trim()
    .notEmpty()
    .withMessage("Province is required"),

  body("address.postalCode")
    .trim()
    .matches(/^[0-9]{5}$/)
    .withMessage("Please provide a valid 5-digit postal code"),

  body("services")
    .isArray({ min: 1 })
    .withMessage("At least one service must be specified"),

  body("services.*")
    .trim()
    .notEmpty()
    .withMessage("Service name cannot be empty"),

  handleValidationErrors,
];

// Insurance company validation
export const validateInsuranceCompany = [
  body("companyName")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),

  body("registrationNumber")
    .trim()
    .notEmpty()
    .withMessage("Registration number is required")
    .isLength({ min: 5, max: 50 })
    .withMessage("Registration number must be between 5 and 50 characters"),

  body("licenseNumber")
    .trim()
    .notEmpty()
    .withMessage("Insurance license number is required"),

  handleValidationErrors,
];

// Vehicle registration validation
export const validateVehicleRegistration = [
  body("licensePlate")
    .trim()
    .notEmpty()
    .withMessage("License plate is required")
    .matches(/^[A-Z]{2,3}-[0-9]{4}$|^[0-9]{2,3}-[0-9]{4}$/)
    .withMessage("Please provide a valid Sri Lankan license plate format"),

  body("make")
    .trim()
    .notEmpty()
    .withMessage("Vehicle make is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Vehicle make must be between 2 and 50 characters"),

  body("model")
    .trim()
    .notEmpty()
    .withMessage("Vehicle model is required")
    .isLength({ min: 1, max: 50 })
    .withMessage("Vehicle model must be between 1 and 50 characters"),

  body("year")
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage("Please provide a valid manufacturing year"),

  body("engineCapacity")
    .trim()
    .notEmpty()
    .withMessage("Engine capacity is required")
    .matches(/^[0-9]+(\.[0-9]+)?[Ll]?$/)
    .withMessage("Please provide a valid engine capacity (e.g., 1.5L, 2000cc)"),

  body("fuelType")
    .isIn(["petrol", "diesel", "hybrid", "electric"])
    .withMessage("Fuel type must be one of: petrol, diesel, hybrid, electric"),

  body("mileage")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Mileage must be a positive number"),

  body("vin")
    .optional()
    .trim()
    .isLength({ min: 17, max: 17 })
    .withMessage("VIN must be exactly 17 characters")
    .matches(/^[A-HJ-NPR-Z0-9]{17}$/)
    .withMessage("Please provide a valid VIN"),

  handleValidationErrors,
];

// Custom validation for unique email (to be used in controllers)
export const checkEmailExists = async (email) => {
  const User = (await import("../models/User.model.js")).default;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email address is already registered");
  }
  return true;
};

// Custom validation for user existence
export const checkUserExists = async (userId) => {
  const User = (await import("../models/User.model.js")).default;
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return true;
};

// Custom validation for unique license plate
export const checkLicensePlateExists = async (licensePlate) => {
  const Vehicle = (await import("../models/Vehicle.model.js")).default;
  const existingVehicle = await Vehicle.findOne({ licensePlate });
  if (existingVehicle) {
    throw new Error("License plate is already registered");
  }
  return true;
};

// Sanitization middleware
export const sanitizeInput = (req, res, next) => {
  // Remove any null bytes and trim strings
  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (typeof obj[key] === "string") {
        obj[key] = obj[key].replace(/\0/g, "").trim();
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        sanitizeObject(obj[key]);
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};

// File upload validation
export const validateFileUpload = [
  body("fileType")
    .optional()
    .isIn(["image", "document", "pdf"])
    .withMessage("Invalid file type"),

  body("maxSize")
    .optional()
    .isInt({ min: 1, max: 10485760 }) // 10MB max
    .withMessage("File size must be between 1 byte and 10MB"),

  handleValidationErrors,
];

// Date range validation
export const validateDateRange = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),

  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date")
    .custom((value, { req }) => {
      if (
        req.query.startDate &&
        value &&
        new Date(value) < new Date(req.query.startDate)
      ) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),

  handleValidationErrors,
];

// Service appointment validation
export const validateServiceAppointment = [
  body("vehicleId").isMongoId().withMessage("Invalid vehicle ID"),

  body("serviceProviderId")
    .isMongoId()
    .withMessage("Invalid service provider ID"),

  body("serviceType")
    .trim()
    .notEmpty()
    .withMessage("Service type is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Service type must be between 2 and 100 characters"),

  body("scheduledDate")
    .isISO8601()
    .withMessage("Scheduled date must be a valid date")
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error("Scheduled date must be in the future");
      }
      return true;
    }),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  handleValidationErrors,
];

// Rating and review validation
export const validateRatingReview = [
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),

  body("review")
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Review must be between 10 and 1000 characters"),

  body("serviceAppointmentId")
    .isMongoId()
    .withMessage("Invalid service appointment ID"),

  handleValidationErrors,
];

// Search validation
export const validateSearch = [
  query("q")
    .trim()
    .notEmpty()
    .withMessage("Search query is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Search query must be between 1 and 100 characters"),

  query("category")
    .optional()
    .isIn(["vehicles", "services", "providers", "all"])
    .withMessage("Invalid search category"),

  query("sortBy")
    .optional()
    .isIn(["relevance", "date", "price", "rating"])
    .withMessage("Invalid sort option"),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),

  handleValidationErrors,
];
