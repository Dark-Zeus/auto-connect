// models/AddedVehicle.model.js
import mongoose from "mongoose";

const addedVehicleSchema = new mongoose.Schema(
  {
    // Reference to the original vehicle
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "Vehicle ID is required"],
      index: true,
    },

    // User who added the vehicle (could be different from vehicle owner)
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Added by user ID is required"],
      index: true,
    },

    // Vehicle owner information (from original vehicle)
    vehicleOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vehicle owner ID is required"],
      index: true,
    },

    // Vehicle owner NIC for easy filtering
    ownerNIC: {
      type: String,
      required: [true, "Owner NIC is required"],
      uppercase: true,
      trim: true,
      index: true,
    },

    // Purpose of adding the vehicle
    purpose: {
      type: String,
      enum: [
        "SERVICE_BOOKING",
        "INSURANCE_CLAIM",
        "MAINTENANCE_SCHEDULE",
        "REPAIR_REQUEST",
        "INSPECTION",
        "SALE_LISTING",
        "RENTAL",
        "OTHER",
      ],
      default: "SERVICE_BOOKING",
    },

    // Additional notes or comments
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
      trim: true,
    },

    // Status of the added vehicle
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED", "PENDING"],
      default: "ACTIVE",
    },

    // Priority level
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },

    // Scheduled date (if applicable)
    scheduledDate: {
      type: Date,
      validate: {
        validator: function (date) {
          // Allow null/undefined, but if provided, should be in the future
          return !date || date >= new Date();
        },
        message: "Scheduled date cannot be in the past",
      },
    },

    // Service/Action details
    serviceDetails: {
      serviceType: {
        type: String,
        enum: [
          "OIL_CHANGE",
          "BRAKE_SERVICE",
          "ENGINE_REPAIR",
          "TRANSMISSION_SERVICE",
          "ELECTRICAL_REPAIR",
          "BODY_WORK",
          "TIRE_SERVICE",
          "AC_SERVICE",
          "GENERAL_MAINTENANCE",
          "INSPECTION",
          "OTHER",
        ],
      },
      estimatedCost: {
        type: Number,
        min: [0, "Estimated cost cannot be negative"],
      },
      estimatedDuration: {
        type: String, // e.g., "2 hours", "1 day"
      },
      urgency: {
        type: Boolean,
        default: false,
      },
    },

    // Contact information for follow-up
    contactInfo: {
      phone: {
        type: String,
        trim: true,
        match: [/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format"],
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      },
      preferredContactMethod: {
        type: String,
        enum: ["PHONE", "EMAIL", "SMS", "WHATSAPP"],
        default: "PHONE",
      },
    },

    // Location information
    location: {
      address: {
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
      coordinates: {
        latitude: {
          type: Number,
          min: [-90, "Invalid latitude"],
          max: [90, "Invalid latitude"],
        },
        longitude: {
          type: Number,
          min: [-180, "Invalid longitude"],
          max: [180, "Invalid longitude"],
        },
      },
    },

    // Tracking information
    tracking: {
      submittedAt: {
        type: Date,
        default: Date.now,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      completedAt: {
        type: Date,
      },
      completedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },

    // Additional metadata
    metadata: {
      source: {
        type: String,
        enum: ["WEB_APP", "MOBILE_APP", "API", "ADMIN_PANEL"],
        default: "WEB_APP",
      },
      ipAddress: {
        type: String,
      },
      userAgent: {
        type: String,
      },
      sessionId: {
        type: String,
      },
    },

    // Soft delete flag
    isActive: {
      type: Boolean,
      default: true,
    },

    // Audit trail
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "added_vehicles", // This matches your requested schema name
  }
);

// Indexes for performance
addedVehicleSchema.index({ vehicleId: 1 });
addedVehicleSchema.index({ addedBy: 1 });
addedVehicleSchema.index({ vehicleOwner: 1 });
addedVehicleSchema.index({ ownerNIC: 1 });
addedVehicleSchema.index({ status: 1 });
addedVehicleSchema.index({ purpose: 1 });
addedVehicleSchema.index({ createdAt: -1 });
addedVehicleSchema.index({ scheduledDate: 1 });

// Compound indexes
addedVehicleSchema.index({ addedBy: 1, status: 1 });
addedVehicleSchema.index({ ownerNIC: 1, isActive: 1 });
addedVehicleSchema.index({ vehicleId: 1, addedBy: 1 });
addedVehicleSchema.index({ purpose: 1, status: 1 });

// Virtual for days since added
addedVehicleSchema.virtual("daysSinceAdded").get(function () {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for status display
addedVehicleSchema.virtual("statusDisplay").get(function () {
  const statusMap = {
    ACTIVE: "Active",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    PENDING: "Pending",
  };
  return statusMap[this.status] || this.status;
});

// Pre-save middleware to update lastUpdated
addedVehicleSchema.pre("save", function (next) {
  if (this.isModified() && !this.isNew) {
    this.tracking.lastUpdated = new Date();
  }
  next();
});

// Pre-save middleware to set completion date
addedVehicleSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "COMPLETED" &&
    !this.tracking.completedAt
  ) {
    this.tracking.completedAt = new Date();
  }
  next();
});

// Instance method to mark as completed
addedVehicleSchema.methods.markCompleted = function (userId) {
  this.status = "COMPLETED";
  this.tracking.completedAt = new Date();
  this.tracking.completedBy = userId;
  this.lastModifiedBy = userId;
  return this.save();
};

// Instance method to cancel
addedVehicleSchema.methods.cancel = function (userId, reason) {
  this.status = "CANCELLED";
  this.notes = reason
    ? `${this.notes || ""}\nCancelled: ${reason}`.trim()
    : this.notes;
  this.lastModifiedBy = userId;
  return this.save();
};

// Static method to get user's added vehicles
addedVehicleSchema.statics.findByUser = function (userId, options = {}) {
  const query = {
    addedBy: userId,
    isActive: true,
    ...options.filter,
  };

  return this.find(query)
    .populate(
      "vehicleId",
      "registrationNumber make model yearOfManufacture color verificationStatus"
    )
    .populate("addedBy", "firstName lastName email")
    .populate("vehicleOwner", "firstName lastName email nicNumber")
    .sort(options.sort || { createdAt: -1 })
    .limit(options.limit || 50);
};

// Static method to get vehicles by owner NIC
addedVehicleSchema.statics.findByOwnerNIC = function (nicNumber, options = {}) {
  const query = {
    ownerNIC: nicNumber.toUpperCase(),
    isActive: true,
    ...options.filter,
  };

  return this.find(query)
    .populate(
      "vehicleId",
      "registrationNumber make model yearOfManufacture color verificationStatus"
    )
    .populate("addedBy", "firstName lastName email")
    .populate("vehicleOwner", "firstName lastName email nicNumber")
    .sort(options.sort || { createdAt: -1 })
    .limit(options.limit || 50);
};

// Static method to get statistics
addedVehicleSchema.statics.getStatistics = function (filter = {}) {
  return this.aggregate([
    {
      $match: { isActive: true, ...filter },
    },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { $sum: { $cond: [{ $eq: ["$status", "ACTIVE"] }, 1, 0] } },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "COMPLETED"] }, 1, 0] },
        },
        pending: { $sum: { $cond: [{ $eq: ["$status", "PENDING"] }, 1, 0] } },
        cancelled: {
          $sum: { $cond: [{ $eq: ["$status", "CANCELLED"] }, 1, 0] },
        },
        thisMonth: {
          $sum: {
            $cond: [
              {
                $gte: [
                  "$createdAt",
                  new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);
};

// Transform JSON output
addedVehicleSchema.methods.toJSON = function () {
  const addedVehicleObject = this.toObject();

  // Add virtual fields
  addedVehicleObject.daysSinceAdded = this.daysSinceAdded;
  addedVehicleObject.statusDisplay = this.statusDisplay;

  return addedVehicleObject;
};

const AddedVehicle = mongoose.model("AddedVehicle", addedVehicleSchema);

export default AddedVehicle;
