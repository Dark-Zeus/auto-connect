// models/VehicleTransfer.js (New model for ownership transfers)
import mongoose from "mongoose";

const vehicleTransferSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    // Transfer Details
    transferType: {
      type: String,
      enum: [
        "SALE",
        "GIFT",
        "INHERITANCE",
        "COURT_ORDER",
        "COMPANY_TRANSFER",
        "OTHER",
      ],
      required: true,
    },

    // Previous Owner
    fromOwner: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
      },
      idNumber: {
        type: String,
        required: true,
      },
      address: {
        street: String,
        city: String,
        district: String,
        province: String,
        postalCode: String,
      },
      signature: String, // URL to signature image
      transferDate: Date,
    },

    // New Owner
    toOwner: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        required: true,
      },
      idNumber: {
        type: String,
        required: true,
      },
      address: {
        street: String,
        city: String,
        district: String,
        province: String,
        postalCode: String,
      },
      signature: String, // URL to signature image
      acceptanceDate: Date,
    },

    // Financial Information
    transferValue: {
      type: Number,
      min: 0,
    },

    transferFees: {
      registrationFee: Number,
      stampDuty: Number,
      agentFee: Number,
      otherFees: Number,
      totalFees: Number,
    },

    // Legal Documentation
    legalDocuments: [
      {
        type: {
          type: String,
          enum: [
            "TRANSFER_DEED",
            "SALE_AGREEMENT",
            "COURT_ORDER",
            "INHERITANCE_DOCUMENT",
            "POWER_OF_ATTORNEY",
            "OTHER",
          ],
        },
        fileName: String,
        fileUrl: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Transfer Status
    status: {
      type: String,
      enum: [
        "INITIATED",
        "PENDING_APPROVAL",
        "APPROVED",
        "COMPLETED",
        "REJECTED",
        "CANCELLED",
      ],
      default: "INITIATED",
    },

    // Administrative Approval
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvalDate: Date,

    rejectionReason: String,

    // DMT Office Information
    dmtOffice: {
      office: String,
      officerName: String,
      referenceNumber: String,
      processedDate: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
vehicleTransferSchema.index({ vehicleId: 1 });
vehicleTransferSchema.index({ "fromOwner.userId": 1 });
vehicleTransferSchema.index({ "toOwner.userId": 1 });
vehicleTransferSchema.index({ status: 1 });

export default mongoose.model("VehicleTransfer", vehicleTransferSchema);
