// Updated validation.util.js - Complete with ALL missing schemas

import Joi from "joi";

// Enhanced registration validation schema that matches your frontend exactly
export const registerValidation = Joi.object({
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

  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),

  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
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

  // Conditional business info for service centers, repair centers, and insurance agents
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
        .min(0)
        .optional()
        .messages({
          "array.min": "Services offered must be an array",
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
      }).required(),
      otherwise: Joi.optional(), // For vehicle_owner and system_admin
    }),
  }),
});

// Simple registration validation (for basic 3-field registration if needed)
export const simpleRegisterValidation = Joi.object({
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

  // Support both field names for backward compatibility
  passwordConfirm: Joi.string().valid(Joi.ref("password")).messages({
    "any.only": "Passwords do not match",
  }),

  repPassword: Joi.string().valid(Joi.ref("password")).messages({
    "any.only": "Passwords do not match",
  }),
})
  .xor("passwordConfirm", "repPassword")
  .messages({
    "object.xor": "Either passwordConfirm or repPassword is required",
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

// Email validation schema (FOR AUTH ROUTES)
export const emailValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
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

// Update password validation schema (FOR AUTH ROUTES)
export const updatePasswordValidation = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Current password is required",
  }),

  newPassword: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.min": "New password must be at least 8 characters long",
      "string.pattern.base":
        "New password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      "any.required": "New password is required",
    }),

  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Password confirmation does not match",
      "any.required": "Password confirmation is required",
    }),
});

// Update profile validation schema (FOR AUTH ROUTES)
export const updateProfileValidation = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .optional()
    .messages({
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name cannot exceed 50 characters",
      "string.pattern.base": "First name can only contain letters and spaces",
    }),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .optional()
    .messages({
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name cannot exceed 50 characters",
      "string.pattern.base": "Last name can only contain letters and spaces",
    }),

  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email address",
  }),

  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .optional()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
    }),

  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    district: Joi.string().optional(),
    province: Joi.string().optional(),
    postalCode: Joi.string().optional(),
  }).optional(),

  // Bio or other optional profile fields
  bio: Joi.string().max(500).optional().messages({
    "string.max": "Bio cannot exceed 500 characters",
  }),

  profileImage: Joi.string().uri().optional().messages({
    "string.uri": "Profile image must be a valid URL",
  }),
});

// Update user validation schema (FOR ADMIN ROUTES) - NEW SCHEMA
export const updateUserValidation = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .optional()
    .messages({
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name cannot exceed 50 characters",
      "string.pattern.base": "First name can only contain letters and spaces",
    }),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .optional()
    .messages({
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name cannot exceed 50 characters",
      "string.pattern.base": "Last name can only contain letters and spaces",
    }),

  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email address",
  }),

  phone: Joi.string()
    .pattern(/^[0-9+\-\s()]+$/)
    .optional()
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
    .optional()
    .messages({
      "any.only": "Please select a valid role",
    }),

  // Admin-specific fields
  isActive: Joi.boolean().optional().messages({
    "boolean.base": "isActive must be true or false",
  }),

  isVerified: Joi.boolean().optional().messages({
    "boolean.base": "isVerified must be true or false",
  }),

  permissions: Joi.array().items(Joi.string()).optional().messages({
    "array.base": "Permissions must be an array",
  }),

  address: Joi.object({
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    district: Joi.string().optional(),
    province: Joi.string().optional(),
    postalCode: Joi.string().optional(),
  }).optional(),

  businessInfo: Joi.object({
    businessName: Joi.string().optional(),
    licenseNumber: Joi.string().optional(),
    businessRegistrationNumber: Joi.string().optional(),
    taxIdentificationNumber: Joi.string().optional(),
    servicesOffered: Joi.array().items(Joi.string()).optional(),
  }).optional(),

  // Police-specific info
  policeInfo: Joi.object({
    badgeNumber: Joi.string().optional(),
    department: Joi.string().optional(),
    rank: Joi.string().optional(),
  }).optional(),

  // Status and admin notes
  adminNotes: Joi.string().max(1000).optional().messages({
    "string.max": "Admin notes cannot exceed 1000 characters",
  }),

  lastLoginAt: Joi.date().optional(),
  profileImage: Joi.string().uri().optional(),
});

// Bulk action validation schema (FOR ADMIN ROUTES) - NEW SCHEMA
export const bulkActionValidation = Joi.object({
  userIds: Joi.array()
    .items(Joi.string().required())
    .min(1)
    .required()
    .messages({
      "array.min": "At least one user ID is required",
      "any.required": "User IDs are required",
      "array.base": "User IDs must be an array",
    }),

  action: Joi.string()
    .valid("verify", "unverify", "activate", "deactivate", "delete", "export")
    .optional()
    .messages({
      "any.only":
        "Action must be one of: verify, unverify, activate, deactivate, delete, export",
    }),

  // Optional reason for bulk actions
  reason: Joi.string().max(500).optional().messages({
    "string.max": "Reason cannot exceed 500 characters",
  }),

  // For bulk updates
  updateData: Joi.object({
    role: Joi.string()
      .valid(
        "vehicle_owner",
        "service_center",
        "repair_center",
        "insurance_agent",
        "police",
        "system_admin"
      )
      .optional(),
    isActive: Joi.boolean().optional(),
    isVerified: Joi.boolean().optional(),
    permissions: Joi.array().items(Joi.string()).optional(),
  }).optional(),

  // Send notification to users
  sendNotification: Joi.boolean().optional().default(false),
  notificationMessage: Joi.string().max(1000).optional(),
});

// System configuration validation schema - NEW SCHEMA
export const systemConfigValidation = Joi.object({
  maxLoginAttempts: Joi.number().integer().min(1).max(10).optional().messages({
    "number.min": "Max login attempts must be at least 1",
    "number.max": "Max login attempts cannot exceed 10",
  }),

  lockoutDuration: Joi.number().integer().min(1).max(1440).optional().messages({
    "number.min": "Lockout duration must be at least 1 minute",
    "number.max": "Lockout duration cannot exceed 1440 minutes (24 hours)",
  }),

  passwordPolicy: Joi.object({
    minLength: Joi.number().integer().min(6).max(50).optional(),
    requireUppercase: Joi.boolean().optional(),
    requireLowercase: Joi.boolean().optional(),
    requireNumbers: Joi.boolean().optional(),
    requireSpecialChars: Joi.boolean().optional(),
  }).optional(),

  emailVerificationRequired: Joi.boolean().optional(),

  adminVerificationRequired: Joi.object({
    service_center: Joi.boolean().optional(),
    repair_center: Joi.boolean().optional(),
    insurance_agent: Joi.boolean().optional(),
    police: Joi.boolean().optional(),
  }).optional(),

  sessionTimeout: Joi.number().integer().min(15).max(1440).optional().messages({
    "number.min": "Session timeout must be at least 15 minutes",
    "number.max": "Session timeout cannot exceed 1440 minutes (24 hours)",
  }),

  maintenanceMode: Joi.boolean().optional(),
  maintenanceMessage: Joi.string().max(500).optional(),
});

// Search and filter validation schema - NEW SCHEMA
export const searchFilterValidation = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1).messages({
    "number.min": "Page must be at least 1",
  }),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(10)
    .messages({
      "number.min": "Limit must be at least 1",
      "number.max": "Limit cannot exceed 100",
    }),

  search: Joi.string().max(100).optional().messages({
    "string.max": "Search term cannot exceed 100 characters",
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
    .optional(),

  isActive: Joi.boolean().optional(),
  isVerified: Joi.boolean().optional(),

  dateFrom: Joi.date().optional(),
  dateTo: Joi.date().optional(),

  sortBy: Joi.string()
    .valid(
      "createdAt",
      "updatedAt",
      "email",
      "firstName",
      "lastName",
      "lastLoginAt"
    )
    .optional()
    .default("createdAt"),

  sortOrder: Joi.string().valid("asc", "desc").optional().default("desc"),
});

// Enhanced validation middleware with detailed debugging
export const validate = (schema) => {
  return (req, res, next) => {
    console.log("🔍 === VALIDATION DEBUG START ===");
    console.log("📝 Request URL:", req.method, req.url);
    console.log("📦 Request Body:", JSON.stringify(req.body, null, 2));
    console.log("🔗 Content-Type:", req.headers["content-type"]);
    console.log("📊 Body Keys:", Object.keys(req.body || {}));

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
      context: { role: req.body.role }, // Pass role for conditional validation
    });

    if (error) {
      console.log("❌ === VALIDATION FAILED ===");
      console.log(
        "🚫 Validation Errors:",
        error.details.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          receivedValue: err.context?.value,
          type: err.type,
        }))
      );
      console.log(
        "📋 Expected Schema Keys:",
        Object.keys(schema.describe().keys || {})
      );
      console.log("🔍 === VALIDATION DEBUG END ===");

      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
        receivedValue: detail.context?.value,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
        debug:
          process.env.NODE_ENV === "development"
            ? {
                receivedFields: Object.keys(req.body || {}),
                expectedFields: Object.keys(schema.describe().keys || {}),
                receivedData: req.body,
              }
            : undefined,
      });
    }

    console.log("✅ === VALIDATION PASSED ===");
    console.log("🔍 === VALIDATION DEBUG END ===");

    req.body = value; // Use validated/sanitized data
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
