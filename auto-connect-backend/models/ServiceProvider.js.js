// models/ServiceProvider.js
import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
    },
    businessRegistrationNumber: {
      type: String,
      required: true,
      unique: true,
    },
    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
    serviceCategories: [
      {
        type: String,
        enum: [
          "general_maintenance",
          "engine_repair",
          "brake_service",
          "transmission_repair",
          "electrical_work",
          "bodywork",
          "tire_service",
          "air_conditioning",
          "emission_testing",
          "inspection_services",
          "towing_service",
          "parts_replacement",
        ],
      },
    ],
    location: {
      address: {
        street: String,
        city: String,
        province: String,
        postalCode: String,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere",
      },
    },
    operatingHours: {
      monday: { open: String, close: String, isOpen: Boolean },
      tuesday: { open: String, close: String, isOpen: Boolean },
      wednesday: { open: String, close: String, isOpen: Boolean },
      thursday: { open: String, close: String, isOpen: Boolean },
      friday: { open: String, close: String, isOpen: Boolean },
      saturday: { open: String, close: String, isOpen: Boolean },
      sunday: { open: String, close: String, isOpen: Boolean },
    },
    certifications: [
      {
        name: String,
        issuedBy: String,
        issuedDate: Date,
        expiryDate: Date,
        certificateImage: String,
      },
    ],
    images: [String], // Array of image URLs
    contactInfo: {
      primaryPhone: String,
      secondaryPhone: String,
      email: String,
      website: String,
    },
    bankingDetails: {
      bankName: String,
      accountNumber: String,
      accountHolderName: String,
      branchCode: String,
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: Date,
    rejectionReason: String,
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      totalReviews: { type: Number, default: 0 },
    },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ServiceProvider", serviceProviderSchema);
