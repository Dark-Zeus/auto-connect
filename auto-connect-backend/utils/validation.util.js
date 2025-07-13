// utils/validation.util.js
import Joi from "joi";

// User registration validation schema
export const registerValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      "any.required": "Password is required",
    }),

  passwordConfirm: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Password confirmation is required",
  }),

  firstName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name cannot exceed 50 characters",
      "string.pattern.base": "First name can only contain letters and spaces",
      "any.required": "First name is required",
    }),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name cannot exceed 50 characters",
      "string.pattern.base": "Last name can only contain letters and spaces",
      "any.required": "Last name is required",
    }),

  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
      "any.required": "Phone number is required",
    }),

  role: Joi.string()
    .valid(
      "vehicle_owner",
      "service_center",
      "repair_center",
      "insurance_agent",
      "police",
      "system_admin"
    )
    .required()
    .messages({
      "any.only": "Please select a valid role",
      "any.required": "Role is required",
    }),

  address: Joi.object({
    street: Joi.string().required().messages({
      "any.required": "Street address is required",
    }),
    city: Joi.string().required().messages({
      "any.required": "City is required",
    }),
    district: Joi.string().required().messages({
      "any.required": "District is required",
    }),
    province: Joi.string().required().messages({
      "any.required": "Province is required",
    }),
    postalCode: Joi.string().required().messages({
      "any.required": "Postal code is required",
    }),
  })
    .required()
    .messages({
      "any.required": "Address information is required",
    }),

  businessInfo: Joi.when("role", {
    is: Joi.string().valid(
      "service_center",
      "repair_center",
      "insurance_agent"
    ),
    then: Joi.object({
      businessName: Joi.string().required().messages({
        "any.required": "Business name is required for this role",
      }),
      licenseNumber: Joi.string().required().messages({
        "any.required": "License number is required for this role",
      }),
      businessRegistrationNumber: Joi.string().required().messages({
        "any.required": "Business registration number is required",
      }),
      taxIdentificationNumber: Joi.string().required().messages({
        "any.required": "Tax identification number is required",
      }),
      servicesOffered: Joi.array()
        .items(Joi.string())
        .min(1)
        .when("$role", {
          is: Joi.string().valid("service_center", "repair_center"),
          then: Joi.required().messages({
            "any.required": "At least one service must be specified",
          }),
        }),
      certifications: Joi.array().items(
        Joi.object({
          name: Joi.string().required(),
          issuedBy: Joi.string().required(),
          issueDate: Joi.date().required(),
          expiryDate: Joi.date().greater(Joi.ref("issueDate")).required(),
          certificateNumber: Joi.string().required(),
        })
      ),
      operatingHours: Joi.object({
        monday: Joi.object({
          open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
          close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
          isOpen: Joi.boolean(),
        }),
        tuesday: Joi.object({
          open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
          close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
          isOpen: Joi.boolean(),
        }),
        wednesday: Joi.object({
          open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
          close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
          isOpen: Joi.boolean(),
        }),
        thursday: Joi.object({
          open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
          close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
          isOpen: Joi.boolean(),
        }),
        friday: Joi.object({
          open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
          close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
          isOpen: Joi.boolean(),
        }),
        saturday: Joi.object({
          open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
          close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
          isOpen: Joi.boolean(),
        }),
        sunday: Joi.object({
          open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
          close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
          isOpen: Joi.boolean(),
        }),
      }),
    }).required(),
    otherwise: Joi.when("role", {
      is: "police",
      then: Joi.object({
        badgeNumber: Joi.string().required().messages({
          "any.required": "Badge number is required for police registration",
        }),
        department: Joi.string().required().messages({
          "any.required": "Department is required for police registration",
        }),
        rank: Joi.string().required().messages({
          "any.required": "Rank is required for police registration",
        }),
        stationAddress: Joi.object({
          street: Joi.string(),
          city: Joi.string(),
          district: Joi.string(),
          province: Joi.string(),
          postalCode: Joi.string(),
        }),
      }).required(),
      otherwise: Joi.optional(),
    }),
  }),
});

// Login validation schema
export const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

// Forgot password validation schema
export const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
});

// Reset password validation schema
export const resetPasswordValidation = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      "any.required": "Password is required",
    }),

  passwordConfirm: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Password confirmation is required",
  }),
});

// Update password validation schema
export const updatePasswordValidation = Joi.object({
  passwordCurrent: Joi.string().required().messages({
    "any.required": "Current password is required",
  }),

  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      "any.required": "New password is required",
    }),

  passwordConfirm: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
    "any.required": "Password confirmation is required",
  }),
});

// Update profile validation schema
export const updateProfileValidation = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name cannot exceed 50 characters",
      "string.pattern.base": "First name can only contain letters and spaces",
    }),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name cannot exceed 50 characters",
      "string.pattern.base": "Last name can only contain letters and spaces",
    }),

  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),

  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    district: Joi.string(),
    province: Joi.string(),
    postalCode: Joi.string(),
  }),

  profileImage: Joi.string().uri().messages({
    "string.uri": "Profile image must be a valid URL",
  }),

  businessInfo: Joi.object({
    businessName: Joi.string(),
    licenseNumber: Joi.string(),
    businessRegistrationNumber: Joi.string(),
    taxIdentificationNumber: Joi.string(),
    servicesOffered: Joi.array().items(Joi.string()),
    operatingHours: Joi.object({
      monday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isOpen: Joi.boolean(),
      }),
      tuesday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isOpen: Joi.boolean(),
      }),
      wednesday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isOpen: Joi.boolean(),
      }),
      thursday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isOpen: Joi.boolean(),
      }),
      friday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isOpen: Joi.boolean(),
      }),
      saturday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isOpen: Joi.boolean(),
      }),
      sunday: Joi.object({
        open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
        close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
        isOpen: Joi.boolean(),
      }),
    }),
    certifications: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        issuedBy: Joi.string().required(),
        issueDate: Joi.date().required(),
        expiryDate: Joi.date().greater(Joi.ref("issueDate")).required(),
        certificateNumber: Joi.string().required(),
      })
    ),
    badgeNumber: Joi.string(),
    department: Joi.string(),
    rank: Joi.string(),
    stationAddress: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      district: Joi.string(),
      province: Joi.string(),
      postalCode: Joi.string(),
    }),
  }),
});

// Update user validation schema (for admin use)
export const updateUserValidation = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name cannot exceed 50 characters",
      "string.pattern.base": "First name can only contain letters and spaces",
    }),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .messages({
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name cannot exceed 50 characters",
      "string.pattern.base": "Last name can only contain letters and spaces",
    }),

  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),

  role: Joi.string()
    .valid(
      "vehicle_owner",
      "service_center",
      "repair_center",
      "insurance_agent",
      "police",
      "system_admin"
    )
    .messages({
      "any.only": "Please select a valid role",
    }),

  isVerified: Joi.boolean(),
  isActive: Joi.boolean(),
  emailVerified: Joi.boolean(),
  phoneVerified: Joi.boolean(),

  address: Joi.object({
    street: Joi.string(),
    city: Joi.string(),
    district: Joi.string(),
    province: Joi.string(),
    postalCode: Joi.string(),
  }),

  businessInfo: Joi.object({
    businessName: Joi.string(),
    licenseNumber: Joi.string(),
    businessRegistrationNumber: Joi.string(),
    taxIdentificationNumber: Joi.string(),
    servicesOffered: Joi.array().items(Joi.string()),
    operatingHours: Joi.object(),
    certifications: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        issuedBy: Joi.string().required(),
        issueDate: Joi.date().required(),
        expiryDate: Joi.date().greater(Joi.ref("issueDate")).required(),
        certificateNumber: Joi.string().required(),
      })
    ),
    badgeNumber: Joi.string(),
    department: Joi.string(),
    rank: Joi.string(),
    stationAddress: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      district: Joi.string(),
      province: Joi.string(),
      postalCode: Joi.string(),
    }),
  }),

  permissions: Joi.array().items(Joi.string()),
  reason: Joi.string().max(500).messages({
    "string.max": "Reason cannot exceed 500 characters",
  }),
});

// Bulk action validation schema
export const bulkActionValidation = Joi.object({
  userIds: Joi.array()
    .items(Joi.string().hex().length(24).required())
    .min(1)
    .required()
    .messages({
      "array.min": "At least one user ID is required",
      "any.required": "User IDs array is required",
      "string.hex": "Invalid user ID format",
      "string.length": "Invalid user ID length",
    }),

  verified: Joi.boolean().when("action", {
    is: "verify",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),

  permanent: Joi.boolean().default(false),

  reason: Joi.string().max(500).messages({
    "string.max": "Reason cannot exceed 500 characters",
  }),
});

// Search and filter validation schema
export const searchFilterValidation = Joi.object({
  search: Joi.string().max(100).messages({
    "string.max": "Search term cannot exceed 100 characters",
  }),

  role: Joi.string().valid(
    "vehicle_owner",
    "service_center",
    "repair_center",
    "insurance_agent",
    "police",
    "system_admin"
  ),

  isVerified: Joi.boolean(),
  isActive: Joi.boolean(),
  emailVerified: Joi.boolean(),

  startDate: Joi.date().iso().messages({
    "date.format": "Start date must be in ISO format",
  }),

  endDate: Joi.date().iso().min(Joi.ref("startDate")).messages({
    "date.format": "End date must be in ISO format",
    "date.min": "End date must be after start date",
  }),

  sortBy: Joi.string()
    .valid("createdAt", "updatedAt", "firstName", "lastName", "email", "role")
    .default("createdAt"),

  sortOrder: Joi.string().valid("asc", "desc").default("desc"),

  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.integer": "Page must be an integer",
    "number.min": "Page must be at least 1",
  }),

  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.base": "Limit must be a number",
    "number.integer": "Limit must be an integer",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),
});

// Email validation schema
export const emailValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
});

// MongoDB ObjectId validation
export const objectIdValidation = Joi.string()
  .hex()
  .length(24)
  .required()
  .messages({
    "string.hex": "Invalid ID format",
    "string.length": "Invalid ID length",
    "any.required": "ID is required",
  });

// Pagination validation
export const paginationValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

// Business hours validation helper
export const businessHoursValidation = Joi.object({
  monday: Joi.object({
    open: Joi.string()
      .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .messages({
        "string.pattern.base": "Time must be in HH:MM format",
      }),
    close: Joi.string()
      .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .messages({
        "string.pattern.base": "Time must be in HH:MM format",
      }),
    isOpen: Joi.boolean().default(true),
  }),
  tuesday: Joi.object({
    open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    isOpen: Joi.boolean().default(true),
  }),
  wednesday: Joi.object({
    open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    isOpen: Joi.boolean().default(true),
  }),
  thursday: Joi.object({
    open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    isOpen: Joi.boolean().default(true),
  }),
  friday: Joi.object({
    open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    isOpen: Joi.boolean().default(true),
  }),
  saturday: Joi.object({
    open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    isOpen: Joi.boolean().default(true),
  }),
  sunday: Joi.object({
    open: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    close: Joi.string().pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    isOpen: Joi.boolean().default(false),
  }),
});

// Validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      context: { role: req.body.role },
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    next();
  };
};

// Query validation middleware (for GET requests)
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, {
      abortEarly: false,
      allowUnknown: true,
      convert: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Query validation failed",
        errors,
      });
    }

    next();
  };
};

// Parameter validation middleware (for route parameters)
export const validateParam = (paramName, schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params[paramName]);

    if (error) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName}: ${error.details[0].message}`,
        field: paramName,
      });
    }

    next();
  };
};

// Custom validation helpers
export const customValidation = {
  // Validate Sri Lankan phone numbers
  sriLankanPhone: Joi.string()
    .pattern(/^(\+94|94|0)?[1-9][0-9]{8}$/)
    .messages({
      "string.pattern.base": "Please provide a valid Sri Lankan phone number",
    }),

  // Validate Sri Lankan postal codes
  sriLankanPostalCode: Joi.string()
    .pattern(/^[0-9]{5}$/)
    .messages({
      "string.pattern.base":
        "Please provide a valid Sri Lankan postal code (5 digits)",
    }),

  // Validate vehicle license plates (Sri Lankan format)
  vehicleLicensePlate: Joi.string()
    .pattern(/^[A-Z]{2,3}-[0-9]{4}$/)
    .messages({
      "string.pattern.base":
        "Please provide a valid vehicle license plate (e.g., ABC-1234)",
    }),

  // Validate business registration numbers
  businessRegistrationNumber: Joi.string()
    .pattern(/^[A-Z]{2}[0-9]{8}$/)
    .messages({
      "string.pattern.base":
        "Please provide a valid business registration number",
    }),
};
