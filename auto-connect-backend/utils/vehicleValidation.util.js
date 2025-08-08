// utils/vehicleValidation.util.js
import Joi from "joi";

// Vehicle registration validation schema
export const vehicleRegistrationValidation = Joi.object({
  // Basic Registration Details
  registrationNumber: Joi.string()
    .pattern(/^([A-Z]{2,3}\s)?[A-Z]{2,3}-\d{4}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Invalid registration number format (e.g., ABC-1234 or WP ABC-1234)",
      "any.required": "Registration number is required",
    }),

  chassisNumber: Joi.string().length(17).required().messages({
    "string.length": "Chassis number must be exactly 17 characters",
    "any.required": "Chassis number is required",
  }),

  engineNumber: Joi.string().max(20).required().messages({
    "string.max": "Engine number cannot exceed 20 characters",
    "any.required": "Engine number is required",
  }),

  // Current Owner Information
  currentOwner: Joi.object({
    name: Joi.string().max(100).required().messages({
      "string.max": "Owner name cannot exceed 100 characters",
      "any.required": "Current owner name is required",
    }),

    address: Joi.object({
      street: Joi.string().allow("").optional(),
      city: Joi.string().allow("").optional(),
      district: Joi.string().allow("").optional(),
      province: Joi.string().allow("").optional(),
      postalCode: Joi.string()
        .pattern(/^[0-9]{5}$/)
        .allow("")
        .optional()
        .messages({
          "string.pattern.base": "Postal code must be 5 digits",
        }),
    }).optional(),

    idNumber: Joi.string()
      .pattern(/^([0-9]{9}[VXvx]|[0-9]{12}|[A-Z0-9]{6,9})$/)
      .required()
      .messages({
        "string.pattern.base": "Invalid ID number format (NIC or Passport)",
        "any.required": "Current owner ID number is required",
      }),
  }).required(),

  // Absolute Owner Information
  absoluteOwner: Joi.object({
    name: Joi.string().max(100).allow("").optional().messages({
      "string.max": "Absolute owner name cannot exceed 100 characters",
    }),

    address: Joi.object({
      street: Joi.string().allow("").optional(),
      city: Joi.string().allow("").optional(),
      district: Joi.string().allow("").optional(),
      province: Joi.string().allow("").optional(),
      postalCode: Joi.string()
        .pattern(/^[0-9]{5}$/)
        .allow("")
        .optional()
        .messages({
          "string.pattern.base": "Postal code must be 5 digits",
        }),
    }).optional(),

    idNumber: Joi.string()
      .pattern(/^([0-9]{9}[VXvx]|[0-9]{12}|[A-Z0-9]{6,9})$/)
      .allow("")
      .optional()
      .messages({
        "string.pattern.base": "Invalid absolute owner ID number format",
      }),

    relationshipToCurrentOwner: Joi.string()
      .valid("same", "parent", "spouse", "child", "company", "other")
      .default("same"),
  }).optional(),

  // Vehicle Specifications
  cylinderCapacity: Joi.number().min(50).max(10000).optional().messages({
    "number.min": "Engine capacity must be at least 50cc",
    "number.max": "Engine capacity cannot exceed 10000cc",
  }),

  classOfVehicle: Joi.string()
    .valid(
      "MOTOR CAR",
      "MOTOR CYCLE",
      "THREE WHEELER",
      "MOTOR LORRY",
      "MOTOR COACH",
      "MOTOR AMBULANCE",
      "MOTOR HEARSE",
      "DUAL PURPOSE VEHICLE",
      "LAND VEHICLE",
      "PRIME MOVER",
      "TRAILER",
      "MOTOR TRICYCLE VAN",
      "MOTOR TRICYCLE CAB"
    )
    .required()
    .messages({
      "any.only": "Invalid vehicle class",
      "any.required": "Vehicle class is required",
    }),

  taxationClass: Joi.string()
    .valid(
      "PRIVATE",
      "COMMERCIAL",
      "GOVERNMENT",
      "DIPLOMATIC",
      "DEFENCE",
      "SPECIAL"
    )
    .optional(),

  statusWhenRegistered: Joi.string()
    .valid(
      "BRAND NEW",
      "RECONDITIONED",
      "USED LOCAL",
      "ASSEMBLED LOCAL",
      "VINTAGE",
      "REBUILT"
    )
    .optional(),

  fuelType: Joi.string()
    .valid("PETROL", "DIESEL", "HYBRID", "ELECTRIC", "LPG", "CNG", "DUAL FUEL")
    .required()
    .messages({
      "any.only": "Invalid fuel type",
      "any.required": "Fuel type is required",
    }),

  make: Joi.string().max(50).required().messages({
    "string.max": "Make cannot exceed 50 characters",
    "any.required": "Vehicle make is required",
  }),

  country: Joi.string().default("JAPAN").optional(),

  model: Joi.string().max(50).required().messages({
    "string.max": "Model cannot exceed 50 characters",
    "any.required": "Vehicle model is required",
  }),

  wheelBase: Joi.number().min(500).max(10000).optional().messages({
    "number.min": "Wheel base must be at least 500mm",
    "number.max": "Wheel base cannot exceed 10000mm",
  }),

  yearOfManufacture: Joi.number()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .required()
    .messages({
      "number.min": "Year must be 1900 or later",
      "number.max": "Year cannot be in the future",
      "any.required": "Year of manufacture is required",
    }),

  color: Joi.string()
    .valid(
      "WHITE",
      "BLACK",
      "SILVER",
      "GREY",
      "RED",
      "BLUE",
      "GREEN",
      "YELLOW",
      "BROWN",
      "ORANGE",
      "PURPLE",
      "PINK",
      "GOLD",
      "MAROON",
      "NAVY",
      "CREAM",
      "BEIGE",
      "MULTICOLOR",
      "OTHER"
    )
    .required()
    .messages({
      "any.only": "Invalid vehicle color",
      "any.required": "Vehicle color is required",
    }),

  seatingCapacity: Joi.number().min(1).max(100).optional().messages({
    "number.min": "Seating capacity must be at least 1",
    "number.max": "Seating capacity cannot exceed 100",
  }),

  weight: Joi.object({
    unladenWeight: Joi.number().min(50).max(50000).optional().messages({
      "number.min": "Unladen weight must be at least 50kg",
      "number.max": "Unladen weight cannot exceed 50000kg",
    }),
    grossWeight: Joi.number().min(50).max(50000).optional().messages({
      "number.min": "Gross weight must be at least 50kg",
      "number.max": "Gross weight cannot exceed 50000kg",
    }),
  }).optional(),

  tyreSize: Joi.object({
    front: Joi.string()
      .pattern(/^[\d]+\/[\d]+R[\d]+$/)
      .allow("")
      .optional()
      .messages({
        "string.pattern.base":
          "Invalid front tyre size format (e.g., 195/65R15)",
      }),
    rear: Joi.string()
      .pattern(/^[\d]+\/[\d]+R[\d]+$/)
      .allow("")
      .optional()
      .messages({
        "string.pattern.base":
          "Invalid rear tyre size format (e.g., 195/65R15)",
      }),
  }).optional(),

  height: Joi.number().min(500).max(5000).optional().messages({
    "number.min": "Vehicle height must be at least 500mm",
    "number.max": "Vehicle height cannot exceed 5000mm",
  }),

  transmission: Joi.string()
    .valid("MANUAL", "AUTOMATIC", "CVT", "SEMI_AUTOMATIC")
    .optional(),

  mileage: Joi.number().min(0).default(0).optional().messages({
    "number.min": "Mileage cannot be negative",
  }),

  // Registration Details
  provincialCouncil: Joi.string()
    .valid(
      "Western Provincial Council",
      "Central Provincial Council",
      "Southern Provincial Council",
      "Northern Provincial Council",
      "Eastern Provincial Council",
      "North Western Provincial Council",
      "North Central Provincial Council",
      "Uva Provincial Council",
      "Sabaragamuwa Provincial Council"
    )
    .required()
    .messages({
      "any.only": "Invalid provincial council",
      "any.required": "Provincial council is required",
    }),

  dateOfRegistration: Joi.date().max("now").required().messages({
    "date.max": "Registration date cannot be in the future",
    "any.required": "Date of registration is required",
  }),

  // Insurance Details
  insuranceDetails: Joi.object({
    provider: Joi.string().max(100).allow("").optional().messages({
      "string.max": "Insurance provider name cannot exceed 100 characters",
    }),
    policyNumber: Joi.string().max(50).allow("").optional().messages({
      "string.max": "Policy number cannot exceed 50 characters",
    }),
    validFrom: Joi.date().optional(),
    validTo: Joi.date()
      .when("validFrom", {
        is: Joi.exist(),
        then: Joi.date().greater(Joi.ref("validFrom")),
        otherwise: Joi.optional(),
      })
      .messages({
        "date.greater": "Insurance end date must be after start date",
      }),
    coverageType: Joi.string()
      .valid("COMPREHENSIVE", "THIRD_PARTY", "THIRD_PARTY_FIRE_THEFT")
      .optional(),
  }).optional(),

  // Revenue License
  revenueLicense: Joi.object({
    licenseNumber: Joi.string().max(50).allow("").optional().messages({
      "string.max": "License number cannot exceed 50 characters",
    }),
    validFrom: Joi.date().optional(),
    validTo: Joi.date()
      .when("validFrom", {
        is: Joi.exist(),
        then: Joi.date().greater(Joi.ref("validFrom")),
        otherwise: Joi.optional(),
      })
      .messages({
        "date.greater": "Revenue license end date must be after start date",
      }),
  }).optional(),

  // Documents and Images
  documents: Joi.array()
    .items(
      Joi.object({
        type: Joi.string()
          .valid(
            "REGISTRATION_CERTIFICATE",
            "INSURANCE_CERTIFICATE",
            "REVENUE_LICENSE",
            "FITNESS_CERTIFICATE",
            "EMISSION_CERTIFICATE",
            "IMPORT_PERMIT",
            "CUSTOMS_CLEARANCE",
            "OTHER"
          )
          .required(),
        fileName: Joi.string().required(),
        fileUrl: Joi.string().uri().required(),
        uploadDate: Joi.date().default(Date.now),
        isVerified: Joi.boolean().default(false),
      })
    )
    .optional(),

  images: Joi.array()
    .items(
      Joi.object({
        type: Joi.string()
          .valid(
            "FRONT",
            "REAR",
            "SIDE",
            "INTERIOR",
            "ENGINE",
            "CHASSIS_NUMBER",
            "OTHER"
          )
          .required(),
        imageUrl: Joi.string().uri().required(),
        uploadDate: Joi.date().default(Date.now),
        description: Joi.string().max(200).allow("").optional().messages({
          "string.max": "Image description cannot exceed 200 characters",
        }),
      })
    )
    .optional(),

  // Additional Information
  specialNotes: Joi.string().max(1000).allow("").optional().messages({
    "string.max": "Special notes cannot exceed 1000 characters",
  }),
});

// Vehicle update validation schema (similar but all fields optional except ID)
export const vehicleUpdateValidation = Joi.object({
  registrationNumber: Joi.string()
    .pattern(/^([A-Z]{2,3}\s)?[A-Z]{2,3}-\d{4}$/)
    .optional()
    .messages({
      "string.pattern.base": "Invalid registration number format",
    }),

  chassisNumber: Joi.string().length(17).optional().messages({
    "string.length": "Chassis number must be exactly 17 characters",
  }),

  engineNumber: Joi.string().max(20).optional().messages({
    "string.max": "Engine number cannot exceed 20 characters",
  }),

  currentOwner: Joi.object({
    name: Joi.string().max(100).optional(),
    address: Joi.object({
      street: Joi.string().allow("").optional(),
      city: Joi.string().allow("").optional(),
      district: Joi.string().allow("").optional(),
      province: Joi.string().allow("").optional(),
      postalCode: Joi.string()
        .pattern(/^[0-9]{5}$/)
        .allow("")
        .optional(),
    }).optional(),
    idNumber: Joi.string()
      .pattern(/^([0-9]{9}[VXvx]|[0-9]{12}|[A-Z0-9]{6,9})$/)
      .optional(),
  }).optional(),

  absoluteOwner: Joi.object({
    name: Joi.string().max(100).allow("").optional(),
    address: Joi.object({
      street: Joi.string().allow("").optional(),
      city: Joi.string().allow("").optional(),
      district: Joi.string().allow("").optional(),
      province: Joi.string().allow("").optional(),
      postalCode: Joi.string()
        .pattern(/^[0-9]{5}$/)
        .allow("")
        .optional(),
    }).optional(),
    idNumber: Joi.string()
      .pattern(/^([0-9]{9}[VXvx]|[0-9]{12}|[A-Z0-9]{6,9})$/)
      .allow("")
      .optional(),
    relationshipToCurrentOwner: Joi.string()
      .valid("same", "parent", "spouse", "child", "company", "other")
      .optional(),
  }).optional(),

  // All other vehicle specification fields as optional
  cylinderCapacity: Joi.number().min(50).max(10000).optional(),
  classOfVehicle: Joi.string()
    .valid(
      "MOTOR CAR",
      "MOTOR CYCLE",
      "THREE WHEELER",
      "MOTOR LORRY",
      "MOTOR COACH",
      "MOTOR AMBULANCE",
      "MOTOR HEARSE",
      "DUAL PURPOSE VEHICLE",
      "LAND VEHICLE",
      "PRIME MOVER",
      "TRAILER",
      "MOTOR TRICYCLE VAN",
      "MOTOR TRICYCLE CAB"
    )
    .optional(),
  taxationClass: Joi.string()
    .valid(
      "PRIVATE",
      "COMMERCIAL",
      "GOVERNMENT",
      "DIPLOMATIC",
      "DEFENCE",
      "SPECIAL"
    )
    .optional(),
  statusWhenRegistered: Joi.string()
    .valid(
      "BRAND NEW",
      "RECONDITIONED",
      "USED LOCAL",
      "ASSEMBLED LOCAL",
      "VINTAGE",
      "REBUILT"
    )
    .optional(),
  fuelType: Joi.string()
    .valid("PETROL", "DIESEL", "HYBRID", "ELECTRIC", "LPG", "CNG", "DUAL FUEL")
    .optional(),
  make: Joi.string().max(50).optional(),
  country: Joi.string().optional(),
  model: Joi.string().max(50).optional(),
  wheelBase: Joi.number().min(500).max(10000).optional(),
  yearOfManufacture: Joi.number()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional(),
  color: Joi.string()
    .valid(
      "WHITE",
      "BLACK",
      "SILVER",
      "GREY",
      "RED",
      "BLUE",
      "GREEN",
      "YELLOW",
      "BROWN",
      "ORANGE",
      "PURPLE",
      "PINK",
      "GOLD",
      "MAROON",
      "NAVY",
      "CREAM",
      "BEIGE",
      "MULTICOLOR",
      "OTHER"
    )
    .optional(),
  seatingCapacity: Joi.number().min(1).max(100).optional(),
  weight: Joi.object({
    unladenWeight: Joi.number().min(50).max(50000).optional(),
    grossWeight: Joi.number().min(50).max(50000).optional(),
  }).optional(),
  tyreSize: Joi.object({
    front: Joi.string()
      .pattern(/^[\d]+\/[\d]+R[\d]+$/)
      .allow("")
      .optional(),
    rear: Joi.string()
      .pattern(/^[\d]+\/[\d]+R[\d]+$/)
      .allow("")
      .optional(),
  }).optional(),
  height: Joi.number().min(500).max(5000).optional(),
  transmission: Joi.string()
    .valid("MANUAL", "AUTOMATIC", "CVT", "SEMI_AUTOMATIC")
    .optional(),
  mileage: Joi.number().min(0).optional(),
  provincialCouncil: Joi.string()
    .valid(
      "Western Provincial Council",
      "Central Provincial Council",
      "Southern Provincial Council",
      "Northern Provincial Council",
      "Eastern Provincial Council",
      "North Western Provincial Council",
      "North Central Provincial Council",
      "Uva Provincial Council",
      "Sabaragamuwa Provincial Council"
    )
    .optional(),
  dateOfRegistration: Joi.date().max("now").optional(),
  insuranceDetails: Joi.object({
    provider: Joi.string().max(100).allow("").optional(),
    policyNumber: Joi.string().max(50).allow("").optional(),
    validFrom: Joi.date().optional(),
    validTo: Joi.date()
      .when("validFrom", {
        is: Joi.exist(),
        then: Joi.date().greater(Joi.ref("validFrom")),
        otherwise: Joi.optional(),
      })
      .optional(),
    coverageType: Joi.string()
      .valid("COMPREHENSIVE", "THIRD_PARTY", "THIRD_PARTY_FIRE_THEFT")
      .optional(),
  }).optional(),
  revenueLicense: Joi.object({
    licenseNumber: Joi.string().max(50).allow("").optional(),
    validFrom: Joi.date().optional(),
    validTo: Joi.date()
      .when("validFrom", {
        is: Joi.exist(),
        then: Joi.date().greater(Joi.ref("validFrom")),
        otherwise: Joi.optional(),
      })
      .optional(),
  }).optional(),
  specialNotes: Joi.string().max(1000).allow("").optional(),
});

// Vehicle query/filter validation
export const vehicleQueryValidation = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  search: Joi.string().max(100).optional(),
  verificationStatus: Joi.string()
    .valid("PENDING", "VERIFIED", "REJECTED", "INCOMPLETE")
    .optional(),
  classOfVehicle: Joi.string()
    .valid(
      "MOTOR CAR",
      "MOTOR CYCLE",
      "THREE WHEELER",
      "MOTOR LORRY",
      "MOTOR COACH",
      "MOTOR AMBULANCE",
      "MOTOR HEARSE",
      "DUAL PURPOSE VEHICLE",
      "LAND VEHICLE",
      "PRIME MOVER",
      "TRAILER",
      "MOTOR TRICYCLE VAN",
      "MOTOR TRICYCLE CAB"
    )
    .optional(),
  fuelType: Joi.string()
    .valid("PETROL", "DIESEL", "HYBRID", "ELECTRIC", "LPG", "CNG", "DUAL FUEL")
    .optional(),
  make: Joi.string().optional(),
  yearFrom: Joi.number()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional(),
  yearTo: Joi.number()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional(),
  sortBy: Joi.string()
    .valid(
      "createdAt",
      "updatedAt",
      "registrationNumber",
      "make",
      "model",
      "yearOfManufacture",
      "dateOfRegistration",
      "verificationStatus"
    )
    .optional()
    .default("createdAt"),
  sortOrder: Joi.string().valid("asc", "desc").optional().default("desc"),
});

// Vehicle verification validation (for admin/authority use)
export const vehicleVerificationValidation = Joi.object({
  verificationStatus: Joi.string()
    .valid("VERIFIED", "REJECTED", "INCOMPLETE")
    .required()
    .messages({
      "any.only": "Invalid verification status",
      "any.required": "Verification status is required",
    }),
  rejectionReason: Joi.when("verificationStatus", {
    is: "REJECTED",
    then: Joi.string().max(500).required().messages({
      "string.max": "Rejection reason cannot exceed 500 characters",
      "any.required": "Rejection reason is required when rejecting",
    }),
    otherwise: Joi.optional(),
  }),
  notes: Joi.string().max(1000).allow("").optional().messages({
    "string.max": "Verification notes cannot exceed 1000 characters",
  }),
});

// Enhanced validation middleware with vehicle-specific debugging
export const validateVehicle = (schema) => {
  return (req, res, next) => {
    console.log("🚗 === VEHICLE VALIDATION DEBUG START ===");
    console.log("📝 Request URL:", req.method, req.url);
    console.log("📦 Request Body:", JSON.stringify(req.body, null, 2));
    console.log("👤 User Info:", {
      id: req.user?._id,
      role: req.user?.role,
      nicNumber: req.user?.nicNumber,
    });

    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true,
    });

    if (error) {
      console.log("❌ === VEHICLE VALIDATION FAILED ===");
      console.log(
        "🚫 Validation Errors:",
        error.details.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          receivedValue: err.context?.value,
          type: err.type,
        }))
      );

      const errors = error.details.map((detail) => ({
        field: detail.path.join("."),
        message: detail.message,
        receivedValue: detail.context?.value,
      }));

      return res.status(400).json({
        success: false,
        message: "Vehicle validation failed",
        errors,
        debug:
          process.env.NODE_ENV === "development"
            ? {
                originalBody: req.body,
                validationDetails: error.details,
              }
            : undefined,
      });
    }

    console.log("✅ Vehicle validation passed");
    console.log("🚗 === VEHICLE VALIDATION DEBUG END ===");

    req.body = value;
    next();
  };
};
