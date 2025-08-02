// models/Vehicle.model.js
import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    // Link to the vehicle owner
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner ID is required"],
      index: true,
    },
    ownerNIC: {
      type: String,
      required: [true, "Owner NIC is required"],
      uppercase: true,
      trim: true,
      index: true,
    },

    // Basic Registration Details
    registrationNumber: {
      type: String,
      required: [true, "Registration number is required"],
      unique: true,
      uppercase: true,
      trim: true,
      match: [
        /^([A-Z]{2,3}\s)?[A-Z]{2,3}-\d{4}$/,
        "Invalid registration number format (e.g., ABC-1234 or WP ABC-1234)",
      ],
      index: true,
    },
    chassisNumber: {
      type: String,
      required: [true, "Chassis number is required"],
      unique: true,
      uppercase: true,
      trim: true,
      minlength: [17, "Chassis number must be exactly 17 characters"],
      maxlength: [17, "Chassis number must be exactly 17 characters"],
      index: true,
    },
    engineNumber: {
      type: String,
      required: [true, "Engine number is required"],
      uppercase: true,
      trim: true,
      maxlength: [20, "Engine number cannot exceed 20 characters"],
      index: true,
    },

    // Current Owner Information
    currentOwner: {
      name: {
        type: String,
        required: [true, "Current owner name is required"],
        trim: true,
        maxlength: [100, "Owner name cannot exceed 100 characters"],
      },
      address: {
        street: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
        },
        district: {
          type: String,
          trim: true,
        },
        province: {
          type: String,
          trim: true,
        },
        postalCode: {
          type: String,
          trim: true,
          match: [/^[0-9]{5}$/, "Postal code must be 5 digits"],
        },
      },
      idNumber: {
        type: String,
        required: [true, "Current owner ID number is required"],
        trim: true,
        validate: {
          validator: function (idNumber) {
            // Sri Lankan NIC or Passport validation
            const nicPattern = /^([0-9]{9}[VXvx]|[0-9]{12})$/;
            const passportPattern = /^[A-Z0-9]{6,9}$/;
            return nicPattern.test(idNumber) || passportPattern.test(idNumber);
          },
          message: "Invalid ID number format (NIC or Passport)",
        },
      },
    },

    // Absolute Owner Information
    absoluteOwner: {
      name: {
        type: String,
        trim: true,
        maxlength: [100, "Absolute owner name cannot exceed 100 characters"],
      },
      address: {
        street: {
          type: String,
          trim: true,
        },
        city: {
          type: String,
          trim: true,
        },
        district: {
          type: String,
          trim: true,
        },
        province: {
          type: String,
          trim: true,
        },
        postalCode: {
          type: String,
          trim: true,
          match: [/^[0-9]{5}$/, "Postal code must be 5 digits"],
        },
      },
      idNumber: {
        type: String,
        trim: true,
        validate: {
          validator: function (idNumber) {
            if (!idNumber) return true; // Optional field
            const nicPattern = /^([0-9]{9}[VXvx]|[0-9]{12})$/;
            const passportPattern = /^[A-Z0-9]{6,9}$/;
            return nicPattern.test(idNumber) || passportPattern.test(idNumber);
          },
          message: "Invalid absolute owner ID number format",
        },
      },
      relationshipToCurrentOwner: {
        type: String,
        enum: ["same", "parent", "spouse", "child", "company", "other"],
        default: "same",
      },
    },

    // Vehicle Specifications
    cylinderCapacity: {
      type: Number,
      min: [50, "Engine capacity must be at least 50cc"],
      max: [10000, "Engine capacity cannot exceed 10000cc"],
    },
    classOfVehicle: {
      type: String,
      required: [true, "Vehicle class is required"],
      enum: [
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
        "MOTOR TRICYCLE CAB",
      ],
    },
    taxationClass: {
      type: String,
      enum: [
        "PRIVATE",
        "COMMERCIAL",
        "GOVERNMENT",
        "DIPLOMATIC",
        "DEFENCE",
        "SPECIAL",
      ],
    },
    statusWhenRegistered: {
      type: String,
      enum: [
        "BRAND NEW",
        "RECONDITIONED",
        "USED LOCAL",
        "ASSEMBLED LOCAL",
        "VINTAGE",
        "REBUILT",
      ],
    },
    fuelType: {
      type: String,
      required: [true, "Fuel type is required"],
      enum: [
        "PETROL",
        "DIESEL",
        "HYBRID",
        "ELECTRIC",
        "LPG",
        "CNG",
        "DUAL FUEL",
      ],
    },
    make: {
      type: String,
      required: [true, "Vehicle make is required"],
      uppercase: true,
      trim: true,
      maxlength: [50, "Make cannot exceed 50 characters"],
    },
    country: {
      type: String,
      default: "JAPAN",
      uppercase: true,
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Vehicle model is required"],
      uppercase: true,
      trim: true,
      maxlength: [50, "Model cannot exceed 50 characters"],
    },
    wheelBase: {
      type: Number,
      min: [500, "Wheel base must be at least 500mm"],
      max: [10000, "Wheel base cannot exceed 10000mm"],
    },
    yearOfManufacture: {
      type: Number,
      required: [true, "Year of manufacture is required"],
      min: [1900, "Year must be 1900 or later"],
      max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
      validate: {
        validator: function (year) {
          return year >= 1900 && year <= new Date().getFullYear() + 1;
        },
        message: "Invalid year of manufacture",
      },
    },
    color: {
      type: String,
      required: [true, "Vehicle color is required"],
      uppercase: true,
      enum: [
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
        "OTHER",
      ],
    },
    seatingCapacity: {
      type: Number,
      min: [1, "Seating capacity must be at least 1"],
      max: [100, "Seating capacity cannot exceed 100"],
    },
    weight: {
      unladenWeight: {
        type: Number,
        min: [50, "Unladen weight must be at least 50kg"],
        max: [50000, "Unladen weight cannot exceed 50000kg"],
      },
      grossWeight: {
        type: Number,
        min: [50, "Gross weight must be at least 50kg"],
        max: [50000, "Gross weight cannot exceed 50000kg"],
      },
    },
    tyreSize: {
      front: {
        type: String,
        trim: true,
        match: [
          /^[\d]+\/[\d]+R[\d]+$/,
          "Invalid tyre size format (e.g., 195/65R15)",
        ],
      },
      rear: {
        type: String,
        trim: true,
        match: [
          /^[\d]+\/[\d]+R[\d]+$/,
          "Invalid tyre size format (e.g., 195/65R15)",
        ],
      },
    },
    height: {
      type: Number,
      min: [500, "Vehicle height must be at least 500mm"],
      max: [5000, "Vehicle height cannot exceed 5000mm"],
    },
    transmission: {
      type: String,
      enum: ["MANUAL", "AUTOMATIC", "CVT", "SEMI_AUTOMATIC"],
    },
    mileage: {
      type: Number,
      default: 0,
      min: [0, "Mileage cannot be negative"],
    },

    // Registration Details
    provincialCouncil: {
      type: String,
      required: [true, "Provincial council is required"],
      enum: [
        "Western Provincial Council",
        "Central Provincial Council",
        "Southern Provincial Council",
        "Northern Provincial Council",
        "Eastern Provincial Council",
        "North Western Provincial Council",
        "North Central Provincial Council",
        "Uva Provincial Council",
        "Sabaragamuwa Provincial Council",
      ],
    },
    dateOfRegistration: {
      type: Date,
      required: [true, "Date of registration is required"],
      validate: {
        validator: function (date) {
          return date <= new Date();
        },
        message: "Registration date cannot be in the future",
      },
    },

    // Insurance Details
    insuranceDetails: {
      provider: {
        type: String,
        trim: true,
        maxlength: [
          100,
          "Insurance provider name cannot exceed 100 characters",
        ],
      },
      policyNumber: {
        type: String,
        trim: true,
        maxlength: [50, "Policy number cannot exceed 50 characters"],
      },
      validFrom: {
        type: Date,
      },
      validTo: {
        type: Date,
        validate: {
          validator: function (validTo) {
            if (!validTo || !this.insuranceDetails.validFrom) return true;
            return validTo > this.insuranceDetails.validFrom;
          },
          message: "Insurance end date must be after start date",
        },
      },
      coverageType: {
        type: String,
        enum: ["COMPREHENSIVE", "THIRD_PARTY", "THIRD_PARTY_FIRE_THEFT"],
      },
    },

    // Revenue License
    revenueLicense: {
      licenseNumber: {
        type: String,
        trim: true,
        maxlength: [50, "License number cannot exceed 50 characters"],
      },
      validFrom: {
        type: Date,
      },
      validTo: {
        type: Date,
        validate: {
          validator: function (validTo) {
            if (!validTo || !this.revenueLicense.validFrom) return true;
            return validTo > this.revenueLicense.validFrom;
          },
          message: "Revenue license end date must be after start date",
        },
      },
    },

    // Documents and Images
    documents: [
      {
        type: {
          type: String,
          required: true,
          enum: [
            "REGISTRATION_CERTIFICATE",
            "INSURANCE_CERTIFICATE",
            "REVENUE_LICENSE",
            "FITNESS_CERTIFICATE",
            "EMISSION_CERTIFICATE",
            "IMPORT_PERMIT",
            "CUSTOMS_CLEARANCE",
            "OTHER",
          ],
        },
        fileName: {
          type: String,
          required: true,
        },
        fileUrl: {
          type: String,
          required: true,
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
        isVerified: {
          type: Boolean,
          default: false,
        },
        verifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        verifiedAt: {
          type: Date,
        },
      },
    ],
    images: [
      {
        type: {
          type: String,
          required: true,
          enum: [
            "FRONT",
            "REAR",
            "SIDE",
            "INTERIOR",
            "ENGINE",
            "CHASSIS_NUMBER",
            "OTHER",
          ],
        },
        imageUrl: {
          type: String,
          required: true,
        },
        uploadDate: {
          type: Date,
          default: Date.now,
        },
        description: {
          type: String,
          maxlength: [200, "Image description cannot exceed 200 characters"],
        },
      },
    ],

    // Status and Verification
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED", "INCOMPLETE"],
      default: "PENDING",
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    verifiedAt: {
      type: Date,
    },
    rejectionReason: {
      type: String,
      maxlength: [500, "Rejection reason cannot exceed 500 characters"],
    },

    // Additional Information
    specialNotes: {
      type: String,
      maxlength: [1000, "Special notes cannot exceed 1000 characters"],
    },

    // Audit Trail
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "vehicles",
  }
);

// Indexes for performance
vehicleSchema.index({ ownerId: 1 });
vehicleSchema.index({ ownerNIC: 1 });
vehicleSchema.index({ registrationNumber: 1 });
vehicleSchema.index({ chassisNumber: 1 });
vehicleSchema.index({ engineNumber: 1 });
vehicleSchema.index({ verificationStatus: 1 });
vehicleSchema.index({ isActive: 1 });
vehicleSchema.index({ createdAt: -1 });

// Compound indexes for common queries
vehicleSchema.index({ ownerId: 1, isActive: 1 });
vehicleSchema.index({ ownerNIC: 1, isActive: 1 });
vehicleSchema.index({ verificationStatus: 1, isActive: 1 });

// Virtual for full registration display
vehicleSchema.virtual("fullRegistration").get(function () {
  return `${this.registrationNumber} (${this.make} ${this.model})`;
});

// Virtual to check if insurance is valid
vehicleSchema.virtual("isInsuranceValid").get(function () {
  if (!this.insuranceDetails.validTo) return false;
  return new Date(this.insuranceDetails.validTo) > new Date();
});

// Virtual to check if revenue license is valid
vehicleSchema.virtual("isRevenueLicenseValid").get(function () {
  if (!this.revenueLicense.validTo) return false;
  return new Date(this.revenueLicense.validTo) > new Date();
});

// Pre-save middleware to set absolute owner same as current owner if relationship is "same"
vehicleSchema.pre("save", function (next) {
  if (this.absoluteOwner.relationshipToCurrentOwner === "same") {
    this.absoluteOwner.name = this.currentOwner.name;
    this.absoluteOwner.idNumber = this.currentOwner.idNumber;
    this.absoluteOwner.address = this.currentOwner.address;
  }
  next();
});

// Instance method to get vehicle summary
vehicleSchema.methods.getSummary = function () {
  return {
    id: this._id,
    registrationNumber: this.registrationNumber,
    make: this.make,
    model: this.model,
    year: this.yearOfManufacture,
    color: this.color,
    verificationStatus: this.verificationStatus,
    isInsuranceValid: this.isInsuranceValid,
    isRevenueLicenseValid: this.isRevenueLicenseValid,
  };
};

// Static method to find vehicles by owner NIC
vehicleSchema.statics.findByOwnerNIC = function (nicNumber) {
  return this.find({
    ownerNIC: nicNumber.toUpperCase(),
    isActive: true,
  }).sort({ createdAt: -1 });
};

// Static method to find vehicles by owner ID
vehicleSchema.statics.findByOwnerId = function (ownerId) {
  return this.find({
    ownerId: ownerId,
    isActive: true,
  }).sort({ createdAt: -1 });
};

// Static method to get vehicle statistics
vehicleSchema.statics.getStatistics = function () {
  return this.aggregate([
    {
      $group: {
        _id: null,
        totalVehicles: { $sum: 1 },
        verifiedVehicles: {
          $sum: { $cond: [{ $eq: ["$verificationStatus", "VERIFIED"] }, 1, 0] },
        },
        pendingVehicles: {
          $sum: { $cond: [{ $eq: ["$verificationStatus", "PENDING"] }, 1, 0] },
        },
      },
    },
  ]);
};

// Transform JSON output (remove sensitive data)
vehicleSchema.methods.toJSON = function () {
  const vehicleObject = this.toObject();

  // Add virtual fields
  vehicleObject.fullRegistration = this.fullRegistration;
  vehicleObject.isInsuranceValid = this.isInsuranceValid;
  vehicleObject.isRevenueLicenseValid = this.isRevenueLicenseValid;

  return vehicleObject;
};

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;
