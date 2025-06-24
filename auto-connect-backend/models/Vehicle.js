// models/Vehicle.js (Updated for Sri Lankan vehicle registration)
import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    // Basic Registration Details
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      // Sri Lankan format: ABC-1234 or WP ABC-1234
      validate: {
        validator: function (v) {
          return /^([A-Z]{2,3}\s)?[A-Z]{2,3}-\d{4}$/.test(v);
        },
        message: "Invalid registration number format",
      },
    },
    chassisNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      minlength: 17,
      maxlength: 17,
      trim: true,
    },
    engineNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    // Owner Information
    currentOwner: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        street: String,
        city: String,
        district: String,
        province: String,
        postalCode: String,
      },
      idNumber: {
        type: String,
        required: true,
        trim: true,
      },
    },

    absoluteOwner: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      address: {
        street: String,
        city: String,
        district: String,
        province: String,
        postalCode: String,
      },
      idNumber: {
        type: String,
        required: true,
        trim: true,
      },
      relationshipToCurrentOwner: {
        type: String,
        enum: ["same", "parent", "spouse", "child", "company", "other"],
        default: "same",
      },
    },

    previousOwners: [
      {
        name: String,
        address: {
          street: String,
          city: String,
          district: String,
          province: String,
          postalCode: String,
        },
        idNumber: String,
        ownershipPeriod: {
          from: Date,
          to: Date,
        },
        transferDate: Date,
        transferReason: String,
      },
    ],

    // Vehicle Specifications
    cylinderCapacity: {
      type: Number,
      required: true,
      min: 50, // Minimum CC for motorcycles
      max: 10000, // Maximum CC for large vehicles
    },

    classOfVehicle: {
      type: String,
      required: true,
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
      required: true,
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
      required: true,
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
      required: true,
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
      required: true,
      uppercase: true,
      trim: true,
    },

    country: {
      type: String,
      required: true,
      uppercase: true,
      default: "JAPAN",
      // Common vehicle manufacturing countries
      enum: [
        "JAPAN",
        "INDIA",
        "SOUTH KOREA",
        "GERMANY",
        "USA",
        "UK",
        "FRANCE",
        "ITALY",
        "CHINA",
        "THAILAND",
        "MALAYSIA",
        "SWEDEN",
        "CZECH REPUBLIC",
        "SPAIN",
        "BRAZIL",
        "MEXICO",
        "TURKEY",
        "OTHER",
      ],
    },

    model: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    wheelBase: {
      type: Number, // in millimeters
      required: true,
      min: 500, // Minimum for three-wheelers
      max: 10000, // Maximum for large trucks
    },

    yearOfManufacture: {
      type: Number,
      required: true,
      min: 1900,
      max: new Date().getFullYear() + 1,
      validate: {
        validator: function (v) {
          return v <= new Date().getFullYear() + 1;
        },
        message: "Year of manufacture cannot be in the future",
      },
    },

    color: {
      type: String,
      required: true,
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
      required: true,
      min: 1,
      max: 100,
    },

    weight: {
      unladenWeight: {
        type: Number, // in kg
        required: true,
        min: 50,
        max: 50000,
      },
      grossWeight: {
        type: Number, // in kg
        required: true,
        min: 50,
        max: 50000,
      },
    },

    tyreSize: {
      front: {
        type: String,
        required: true,
        // Format: 195/65R15
        validate: {
          validator: function (v) {
            return /^\d{3}\/\d{2}R\d{2}$/.test(v);
          },
          message: "Invalid tyre size format (should be like 195/65R15)",
        },
      },
      rear: {
        type: String,
        required: true,
        validate: {
          validator: function (v) {
            return /^\d{3}\/\d{2}R\d{2}$/.test(v);
          },
          message: "Invalid tyre size format (should be like 195/65R15)",
        },
      },
    },

    height: {
      type: Number, // in millimeters
      required: true,
      min: 500,
      max: 5000,
    },

    // Registration Details
    provincialCouncil: {
      type: String,
      required: true,
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
      required: true,
      validate: {
        validator: function (v) {
          return v <= new Date();
        },
        message: "Registration date cannot be in the future",
      },
    },

    // Additional Vehicle Information
    transmission: {
      type: String,
      enum: ["MANUAL", "AUTOMATIC", "CVT", "SEMI_AUTOMATIC"],
    },

    mileage: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Inspection and Insurance
    lastInspectionDate: Date,
    nextInspectionDue: Date,

    insuranceDetails: {
      provider: String,
      policyNumber: String,
      validFrom: Date,
      validTo: Date,
      coverageType: {
        type: String,
        enum: ["COMPREHENSIVE", "THIRD_PARTY", "THIRD_PARTY_FIRE_THEFT"],
      },
    },

    // Revenue License
    revenueLicense: {
      licenseNumber: String,
      validFrom: Date,
      validTo: Date,
      isValid: {
        type: Boolean,
        default: true,
      },
    },

    // Fitness Certificate (for commercial vehicles)
    fitnessCertificate: {
      certificateNumber: String,
      validFrom: Date,
      validTo: Date,
      issuedBy: String,
    },

    // Emission Test
    emissionTest: {
      lastTestDate: Date,
      nextTestDue: Date,
      testResult: {
        type: String,
        enum: ["PASS", "FAIL", "PENDING"],
      },
      certificateNumber: String,
    },

    // Vehicle Status
    status: {
      type: String,
      enum: [
        "ACTIVE",
        "SOLD",
        "TRANSFERRED",
        "SCRAPPED",
        "STOLEN",
        "IMPOUNDED",
        "SUSPENDED",
      ],
      default: "ACTIVE",
    },

    // Documents
    documents: [
      {
        type: {
          type: String,
          enum: [
            "REGISTRATION_CERTIFICATE",
            "REVENUE_LICENSE",
            "INSURANCE_CERTIFICATE",
            "FITNESS_CERTIFICATE",
            "EMISSION_CERTIFICATE",
            "IMPORT_PERMIT",
            "CUSTOMS_CLEARANCE",
            "PREVIOUS_REGISTRATION",
            "TRANSFER_DOCUMENT",
            "OTHER",
          ],
        },
        fileName: String,
        fileUrl: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
        expiryDate: Date,
        isVerified: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Vehicle Images
    images: [
      {
        type: {
          type: String,
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
        imageUrl: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
        description: String,
      },
    ],

    // Additional Notes
    specialNotes: String,

    // Administrative
    isVerified: {
      type: Boolean,
      default: false,
    },

    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    verifiedDate: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
vehicleSchema.index({ registrationNumber: 1 });
vehicleSchema.index({ chassisNumber: 1 });
vehicleSchema.index({ engineNumber: 1 });
vehicleSchema.index({ "currentOwner.userId": 1 });
vehicleSchema.index({ make: 1, model: 1 });
vehicleSchema.index({ yearOfManufacture: 1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ provincialCouncil: 1 });

// Virtual for vehicle age
vehicleSchema.virtual("vehicleAge").get(function () {
  return new Date().getFullYear() - this.yearOfManufacture;
});

// Method to check if revenue license is valid
vehicleSchema.methods.isRevenueLicenseValid = function () {
  if (!this.revenueLicense || !this.revenueLicense.validTo) return false;
  return (
    this.revenueLicense.validTo > new Date() && this.revenueLicense.isValid
  );
};

// Method to check if insurance is valid
vehicleSchema.methods.isInsuranceValid = function () {
  if (!this.insuranceDetails || !this.insuranceDetails.validTo) return false;
  return this.insuranceDetails.validTo > new Date();
};

// Method to check if emission test is due
vehicleSchema.methods.isEmissionTestDue = function () {
  if (!this.emissionTest || !this.emissionTest.nextTestDue) return true;
  return this.emissionTest.nextTestDue <= new Date();
};

export default mongoose.model("Vehicle", vehicleSchema);
