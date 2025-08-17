// models/Booking.model.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // Basic booking information
    bookingId: {
      type: String,
      unique: true,
      required: true,
    },

    // Vehicle owner (who is booking)
    vehicleOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Vehicle owner is required"],
    },
    ownerNIC: {
      type: String,
      required: [true, "Owner NIC is required"],
    },

    // Service center (who provides the service)
    serviceCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Service center is required"],
    },

    // Vehicle information
    vehicle: {
      registrationNumber: {
        type: String,
        required: [true, "Vehicle registration number is required"],
      },
      make: {
        type: String,
        required: [true, "Vehicle make is required"],
      },
      model: {
        type: String,
        required: [true, "Vehicle model is required"],
      },
      year: {
        type: Number,
        required: [true, "Vehicle year is required"],
      },
    },

    // Service details
    services: {
      type: [String],
      required: [true, "At least one service must be selected"],
      validate: {
        validator: function (services) {
          return services && services.length > 0;
        },
        message: "At least one service must be selected",
      },
    },

    // Booking details
    preferredDate: {
      type: Date,
      required: [true, "Preferred date is required"],
    },
    preferredTimeSlot: {
      type: String,
      required: [true, "Preferred time slot is required"],
    },

    // Pricing
    estimatedCost: {
      type: Number,
      default: 0,
    },
    finalCost: {
      type: Number,
      default: 0,
    },

    // Status tracking
    status: {
      type: String,
      enum: [
        "PENDING", // Just submitted
        "CONFIRMED", // Service center confirmed
        "IN_PROGRESS", // Work started
        "COMPLETED", // Work finished
        "CANCELLED", // Cancelled by either party
        "REJECTED", // Rejected by service center
      ],
      default: "PENDING",
    },

    // Contact information
    contactInfo: {
      phone: {
        type: String,
        required: [true, "Contact phone is required"],
      },
      email: {
        type: String,
        required: [true, "Contact email is required"],
      },
      preferredContactMethod: {
        type: String,
        enum: ["PHONE", "EMAIL", "SMS", "WHATSAPP"],
        default: "PHONE",
      },
    },

    // Additional information
    specialRequests: {
      type: String,
      maxlength: [500, "Special requests cannot exceed 500 characters"],
    },
    notes: {
      type: String,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },

    // Timestamps for different statuses
    timestamps: {
      bookedAt: {
        type: Date,
        default: Date.now,
      },
      confirmedAt: {
        type: Date,
      },
      startedAt: {
        type: Date,
      },
      completedAt: {
        type: Date,
      },
      cancelledAt: {
        type: Date,
      },
    },

    // Service center response
    serviceCenterResponse: {
      responseDate: {
        type: Date,
      },
      message: {
        type: String,
        maxlength: [500, "Response message cannot exceed 500 characters"],
      },
      proposedDate: {
        type: Date,
      },
      proposedTimeSlot: {
        type: String,
      },
      estimatedDuration: {
        type: String, // e.g., "2-3 hours", "1 day"
      },
    },

    // Rating and feedback (after completion)
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        maxlength: [500, "Feedback comment cannot exceed 500 characters"],
      },
      submittedAt: {
        type: Date,
      },
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

    // Soft delete
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "bookings",
  }
);

// Indexes for performance
bookingSchema.index({ bookingId: 1 });
bookingSchema.index({ vehicleOwner: 1 });
bookingSchema.index({ serviceCenter: 1 });
bookingSchema.index({ ownerNIC: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ preferredDate: 1 });
bookingSchema.index({ createdAt: -1 });

// Compound indexes
bookingSchema.index({ vehicleOwner: 1, status: 1 });
bookingSchema.index({ serviceCenter: 1, status: 1 });
bookingSchema.index({ serviceCenter: 1, preferredDate: 1 });
bookingSchema.index({ status: 1, preferredDate: 1 });

// Pre-save middleware to generate booking ID
bookingSchema.pre("save", function (next) {
  if (this.isNew && !this.bookingId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.bookingId = `BK-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

// Virtual for booking reference
bookingSchema.virtual("bookingReference").get(function () {
  return `${this.bookingId} - ${this.vehicle.registrationNumber}`;
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function () {
  return ["PENDING", "CONFIRMED"].includes(this.status);
};

// Method to check if booking can be modified
bookingSchema.methods.canBeModified = function () {
  return this.status === "PENDING";
};

// Static method to get bookings by status
bookingSchema.statics.findByStatus = function (status) {
  return this.find({ status, isActive: true });
};

// Static method to get upcoming bookings
bookingSchema.statics.findUpcoming = function () {
  return this.find({
    preferredDate: { $gte: new Date() },
    status: { $in: ["PENDING", "CONFIRMED"] },
    isActive: true,
  });
};

const Booking = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);

export default Booking;
