// models/VehicleHistory.js (Updated)
import mongoose from "mongoose";

const vehicleHistorySchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    eventType: {
      type: String,
      enum: [
        "REGISTRATION",
        "OWNERSHIP_TRANSFER",
        "SERVICE_MAINTENANCE",
        "ACCIDENT",
        "INSURANCE_CLAIM",
        "EMISSION_TEST",
        "FITNESS_TEST",
        "REVENUE_LICENSE_RENEWAL",
        "INSURANCE_RENEWAL",
        "MODIFICATION",
        "REPAIR",
        "INSPECTION",
        "THEFT_REPORT",
        "RECOVERY",
        "SCRAPPING",
        "OTHER",
      ],
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    // Service/Maintenance specific
    serviceProviderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceProvider",
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
    mileageAtEvent: Number,

    // Financial Information
    cost: {
      type: Number,
      min: 0,
    },

    // Parts Information
    parts: [
      {
        name: String,
        partNumber: String,
        quantity: Number,
        unitCost: Number,
        totalCost: Number,
        warranty: {
          period: String,
          validUntil: Date,
        },
      },
    ],

    // Service Warranty
    warranty: {
      period: String,
      validUntil: Date,
      terms: String,
      warrantyProvider: String,
    },

    // Document References
    documents: [
      {
        type: String,
        name: String,
        fileUrl: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Certificates (for tests, inspections)
    certificate: {
      certificateNumber: String,
      certificateType: {
        type: String,
        enum: [
          "SERVICE_CERTIFICATE",
          "EMISSION_CERTIFICATE",
          "FITNESS_CERTIFICATE",
          "INSURANCE_CERTIFICATE",
          "REPAIR_CERTIFICATE",
          "INSPECTION_CERTIFICATE",
          "OTHER",
        ],
      },
      issuedBy: String,
      issuedDate: Date,
      validFrom: Date,
      validTo: Date,
      certificateImage: String,
    },

    // Emission Test Results (specific)
    emissionTestResults: {
      coLevel: Number, // CO level
      hcLevel: Number, // HC level
      noxLevel: Number, // NOx level
      smokeDensity: Number,
      testResult: {
        type: String,
        enum: ["PASS", "FAIL"],
      },
      testCenter: String,
      testerName: String,
      equipmentUsed: String,
    },

    // Accident Information
    accidentDetails: {
      severity: {
        type: String,
        enum: ["MINOR", "MODERATE", "MAJOR", "TOTAL_LOSS"],
      },
      policeReportNumber: String,
      insuranceClaimNumber: String,
      damageDescription: String,
      repairCost: Number,
      isVehicleDriveable: Boolean,
    },

    // Transfer Information
    transferDetails: {
      fromOwner: {
        name: String,
        idNumber: String,
      },
      toOwner: {
        name: String,
        idNumber: String,
      },
      transferReason: String,
      transferFee: Number,
      transferDate: Date,
    },

    // Location Information
    location: {
      address: String,
      city: String,
      district: String,
      province: String,
      gpsCoordinates: {
        latitude: Number,
        longitude: Number,
      },
    },

    // Additional Notes
    notes: String,
    internalNotes: String, // For service provider internal use

    // Administrative
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

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

// Indexes
vehicleHistorySchema.index({ vehicleId: 1, eventDate: -1 });
vehicleHistorySchema.index({ eventType: 1 });
vehicleHistorySchema.index({ serviceProviderId: 1 });
vehicleHistorySchema.index({ appointmentId: 1 });

export default mongoose.model("VehicleHistory", vehicleHistorySchema);
