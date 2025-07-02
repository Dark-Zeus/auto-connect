// Updated validation.util.js - Optimized for your frontend

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
        .when("$role", {
          is: Joi.string().valid("service_center", "repair_center"),
          then: Joi.min(0), // Allow empty array, make it optional
          otherwise: Joi.optional(),
        })
        .messages({
          "array.min": "At least one service should be specified",
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
