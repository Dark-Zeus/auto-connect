// models/ServiceReport.model.js
import mongoose from "mongoose";

const serviceReportSchema = new mongoose.Schema(
  {
    // Link to the booking
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking reference is required"],
      unique: true, // One report per booking
    },

    // Basic report information
    reportId: {
      type: String,
      unique: true,
      required: true,
    },

    // Service center that performed the work
    serviceCenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Service center is required"],
    },

    // Vehicle information (for quick reference)
    vehicle: {
      registrationNumber: {
        type: String,
        required: true,
      },
      make: String,
      model: String,
      year: Number,
    },

    // Completed services
    completedServices: [{
      serviceName: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        maxlength: [500, "Service description cannot exceed 500 characters"],
      },
      partsUsed: [{
        partName: {
          type: String,
          required: true,
        },
        partNumber: {
          type: String,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        totalPrice: {
          type: Number,
          required: true,
          min: 0,
        },
        condition: {
          type: String,
          enum: ["NEW", "REFURBISHED", "USED"],
          default: "NEW",
        },
      }],
      laborDetails: {
        hoursWorked: {
          type: Number,
          required: true,
          min: 0,
        },
        laborRate: {
          type: Number,
          required: true,
          min: 0,
        },
        laborCost: {
          type: Number,
          required: true,
          min: 0,
        },
      },
      serviceCost: {
        type: Number,
        required: true,
        min: 0,
      },
      serviceAmount: {
        type: Number,
        default: 0,
        min: 0,
      },
      partsRequired: {
        type: Boolean,
        default: false,
      },
      serviceStatus: {
        type: String,
        enum: ["COMPLETED", "PARTIALLY_COMPLETED", "NOT_COMPLETED"],
        default: "COMPLETED",
      },
      notes: {
        type: String,
        maxlength: [1000, "Service notes cannot exceed 1000 characters"],
      },
    }],

    // Additional work performed
    additionalWork: [{
      workDescription: {
        type: String,
        required: true,
        maxlength: [500, "Work description cannot exceed 500 characters"],
      },
      reason: {
        type: String,
        required: true,
        maxlength: [500, "Reason cannot exceed 500 characters"],
      },
      cost: {
        type: Number,
        required: true,
        min: 0,
      },
      customerApproved: {
        type: Boolean,
        default: false,
      },
      approvalDate: {
        type: Date,
      },
    }],

    // Cost breakdown
    totalCostBreakdown: {
      partsTotal: {
        type: Number,
        required: true,
        default: 0,
      },
      laborTotal: {
        type: Number,
        required: true,
        default: 0,
      },
      servicesTotal: {
        type: Number,
        required: true,
        default: 0,
      },
      additionalWorkTotal: {
        type: Number,
        default: 0,
      },
      taxes: {
        type: Number,
        default: 0,
      },
      discount: {
        type: Number,
        default: 0,
      },
      finalTotal: {
        type: Number,
        required: true,
        default: 0,
      },
    },

    // Work timeline
    workStartTime: {
      type: Date,
      required: true,
    },
    workEndTime: {
      type: Date,
      required: true,
    },
    totalTimeSpent: {
      type: String, // e.g., "3 hours 45 minutes"
    },

    // Vehicle condition documentation
    vehicleCondition: {
      before: {
        mileage: {
          type: Number,
        },
        fuelLevel: {
          type: String,
          enum: ["EMPTY", "1/4", "1/2", "3/4", "FULL"],
        },
        externalCondition: {
          type: String,
          maxlength: [500, "External condition description too long"],
        },
        internalCondition: {
          type: String,
          maxlength: [500, "Internal condition description too long"],
        },
        photos: [{
          type: String, // URLs to photos
        }],
      },
      after: {
        mileage: {
          type: Number,
        },
        fuelLevel: {
          type: String,
          enum: ["EMPTY", "1/4", "1/2", "3/4", "FULL"],
        },
        externalCondition: {
          type: String,
          maxlength: [500, "External condition description too long"],
        },
        internalCondition: {
          type: String,
          maxlength: [500, "Internal condition description too long"],
        },
        photos: [{
          type: String, // URLs to photos
        }],
      },
    },

    // Technician information
    technician: {
      name: {
        type: String,
        required: true,
      },
      employeeId: {
        type: String,
      },
      signature: {
        type: String, // URL to signature image or base64 data
      },
    },

    // Quality assurance
    qualityCheck: {
      performed: {
        type: Boolean,
        default: false,
      },
      performedBy: {
        type: String,
      },
      checklist: [{
        item: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["PASS", "FAIL", "N/A"],
          required: true,
        },
        notes: {
          type: String,
        },
      }],
      overallRating: {
        type: String,
        enum: ["EXCELLENT", "GOOD", "SATISFACTORY", "NEEDS_IMPROVEMENT"],
      },
      notes: {
        type: String,
        maxlength: [1000, "Quality check notes cannot exceed 1000 characters"],
      },
    },

    // Recommendations for future work
    recommendations: [{
      type: {
        type: String,
        enum: ["IMMEDIATE", "SOON", "ROUTINE", "OBSERVATION"],
        required: true,
      },
      description: {
        type: String,
        required: true,
        maxlength: [500, "Recommendation description too long"],
      },
      estimatedCost: {
        type: Number,
        min: 0,
      },
      priority: {
        type: String,
        enum: ["HIGH", "MEDIUM", "LOW"],
        default: "MEDIUM",
      },
    }],

    // Customer notification tracking
    customerNotification: {
      notified: {
        type: Boolean,
        default: false,
      },
      notificationDate: {
        type: Date,
      },
      notificationMethod: {
        type: String,
        enum: ["PHONE", "EMAIL", "SMS", "IN_PERSON"],
      },
    },

    // Report metadata
    reportGeneratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportGeneratedAt: {
      type: Date,
      default: Date.now,
    },
    digitalSignature: {
      type: String, // Digital signature or hash for report integrity
    },

    // Report status
    status: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "APPROVED", "ARCHIVED"],
      default: "SUBMITTED",
    },

    // Supporting documents
    supportingDocuments: [{
      fileName: {
        type: String,
        required: true,
      },
      fileUrl: {
        type: String,
        required: true,
      },
      fileType: {
        type: String,
        required: true,
      },
      fileSize: {
        type: Number,
        required: true,
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
      description: {
        type: String,
        maxlength: [200, "Document description cannot exceed 200 characters"],
      },
    }],

    // Soft delete
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "service_reports",
  }
);

// Indexes for performance
serviceReportSchema.index({ booking: 1 });
serviceReportSchema.index({ reportId: 1 });
serviceReportSchema.index({ serviceCenter: 1 });
serviceReportSchema.index({ "vehicle.registrationNumber": 1 });
serviceReportSchema.index({ reportGeneratedAt: -1 });
serviceReportSchema.index({ status: 1 });

// Compound indexes
serviceReportSchema.index({ serviceCenter: 1, status: 1 });
serviceReportSchema.index({ serviceCenter: 1, reportGeneratedAt: -1 });

// Pre-save middleware to generate report ID
serviceReportSchema.pre("save", function (next) {
  if (this.isNew && !this.reportId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.reportId = `SR-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

// Virtual for report reference
serviceReportSchema.virtual("reportReference").get(function () {
  return `${this.reportId} - ${this.vehicle.registrationNumber}`;
});

// Method to calculate total cost
serviceReportSchema.methods.calculateTotalCost = function () {
  let partsTotal = 0;
  let laborTotal = 0;
  let servicesTotal = 0;
  let additionalWorkTotal = 0;

  this.completedServices.forEach(service => {
    if (service.partsUsed) {
      service.partsUsed.forEach(part => {
        partsTotal += part.totalPrice || 0;
      });
    }
    laborTotal += service.laborDetails.laborCost || 0;
    servicesTotal += (service.serviceCost || 0) + (service.serviceAmount || 0);
  });

  this.additionalWork.forEach(work => {
    additionalWorkTotal += work.cost || 0;
  });

  const finalTotal = partsTotal + laborTotal + servicesTotal + additionalWorkTotal + 
                    this.totalCostBreakdown.taxes - this.totalCostBreakdown.discount;

  return {
    partsTotal,
    laborTotal,
    servicesTotal,
    additionalWorkTotal,
    finalTotal,
  };
};

// Static method to get reports by service center
serviceReportSchema.statics.findByServiceCenter = function (serviceCenterId) {
  return this.find({ serviceCenter: serviceCenterId, isActive: true });
};

// Static method to get reports by date range
serviceReportSchema.statics.findByDateRange = function (startDate, endDate) {
  return this.find({
    reportGeneratedAt: {
      $gte: startDate,
      $lte: endDate,
    },
    isActive: true,
  });
};

const ServiceReport = mongoose.models.ServiceReport || mongoose.model("ServiceReport", serviceReportSchema);

export default ServiceReport;