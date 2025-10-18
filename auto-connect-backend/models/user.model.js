// models/User.model.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // Don't include password in queries by default
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^[0-9+\-\s()]+$/, "Please enter a valid phone number"],
    },

    // User Role - 6 types as specified
    role: {
      type: String,
      required: [true, "User role is required"],
      enum: {
        values: [
          "vehicle_owner",
          "service_center",
          "repair_center",
          "insurance_agent",
          "police",
          "system_admin",
        ],
        message: "Invalid user role",
      },
    },

    // NIC Number (National Identity Card) - Only for vehicle owners
    nicNumber: {
      type: String,
      required: function () {
        return this.role === "vehicle_owner";
      },
      unique: true, // Ensure no duplicate NICs
      sparse: true, // Allows multiple null values for non-vehicle owners
      validate: [
        {
          validator: function (nicNumber) {
            // Skip validation if not a vehicle owner
            if (this.role !== "vehicle_owner") return true;

            // Must have a value if role is vehicle_owner
            return nicNumber && nicNumber.trim().length > 0;
          },
          message: "NIC number is required for vehicle owners",
        },
        {
          validator: function (nicNumber) {
            // Only validate format if role is vehicle_owner and value exists
            if (this.role !== "vehicle_owner" || !nicNumber) return true;

            // Sri Lankan NIC validation patterns
            // Old format: 9 digits + V/X (e.g., 123456789V)
            // New format: 12 digits (e.g., 199901234567)
            const oldNicPattern = /^[0-9]{9}[vVxX]$/;
            const newNicPattern = /^[0-9]{12}$/;
            const cleanNic = nicNumber.trim().toUpperCase();

            return oldNicPattern.test(cleanNic) || newNicPattern.test(cleanNic);
          },
          message:
            "Please enter a valid Sri Lankan NIC number (9 digits + V/X or 12 digits)",
        },
      ],
      uppercase: true, // Convert to uppercase for consistency
      trim: true,
    },

    // Address Information
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      district: {
        type: String,
        required: [true, "District is required"],
      },
      province: {
        type: String,
        required: [true, "Province is required"],
      },
      postalCode: {
        type: String,
        required: [true, "Postal code is required"],
      },
    },

    // Account Status
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },

    // Profile Image
    profileImage: {
      type: String,
      default: null,
    },

    // Role-specific Business Information
    businessInfo: {
      // For service_center, repair_center, insurance_agent
      businessName: {
        type: String,
        required: function () {
          return [
            "service_center",
            "repair_center",
            "insurance_agent",
          ].includes(this.role);
        },
      },
      licenseNumber: {
        type: String,
        required: function () {
          return [
            "service_center",
            "repair_center",
            "insurance_agent",
          ].includes(this.role);
        },
      },
      businessRegistrationNumber: {
        type: String,
        required: function () {
          return [
            "service_center",
            "repair_center",
            "insurance_agent",
          ].includes(this.role);
        },
      },
      taxIdentificationNumber: {
        type: String,
        required: function () {
          return [
            "service_center",
            "repair_center",
            "insurance_agent",
          ].includes(this.role);
        },
      },
      // For service/repair centers - Fixed validation
      servicesOffered: {
        type: [String],
        default: [],
        validate: {
          validator: function (services) {
            // Only require services for service/repair centers if they want to validate this
            // You can enable this validation if needed
            // if (["service_center", "repair_center"].includes(this.role)) {
            //   return services && services.length > 0;
            // }
            return true;
          },
          message:
            "At least one service must be offered for service/repair centers",
        },
      },
      operatingHours: {
        type: Map,
        of: {
          open: String,
          close: String,
          isOpen: Boolean,
          breakStart: String,
          breakEnd: String,
        },
        default: function () {
          if (["service_center", "repair_center"].includes(this.role)) {
            return new Map([
              ["monday", { open: "08:00", close: "18:00", isOpen: true }],
              ["tuesday", { open: "08:00", close: "18:00", isOpen: true }],
              ["wednesday", { open: "08:00", close: "18:00", isOpen: true }],
              ["thursday", { open: "08:00", close: "18:00", isOpen: true }],
              ["friday", { open: "08:00", close: "18:00", isOpen: true }],
              ["saturday", { open: "08:00", close: "16:00", isOpen: true }],
              ["sunday", { open: "09:00", close: "14:00", isOpen: false }],
            ]);
          }
          return undefined;
        },
      },
      slotSettings: {
        type: {
          defaultDuration: {
            type: Number,
            default: 60, // minutes
            min: 15,
            max: 480,
          },
          bufferTime: {
            type: Number,
            default: 15, // minutes
            min: 0,
            max: 120,
          },
          maxAdvanceBooking: {
            type: Number,
            default: 30, // days
            min: 1,
            max: 365,
          },
          minAdvanceBooking: {
            type: Number,
            default: 1, // hours
            min: 1,
            max: 168,
          },
        },
        default: function () {
          if (["service_center", "repair_center"].includes(this.role)) {
            return {
              defaultDuration: 60,
              bufferTime: 15,
              maxAdvanceBooking: 30,
              minAdvanceBooking: 1,
            };
          }
          return undefined;
        },
      },
      certifications: [
        {
          name: String,
          issuedBy: String,
          issueDate: Date,
          expiryDate: Date,
          certificateNumber: String,
        },
      ],
      // For police
      badgeNumber: {
        type: String,
        required: function () {
          return this.role === "police";
        },
      },
      department: {
        type: String,
        required: function () {
          return this.role === "police";
        },
      },
      rank: {
        type: String,
        required: function () {
          return this.role === "police";
        },
      },
    },

    // Rating and Reviews (for service providers)
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
    },

    // Security
    lastLogin: {
      type: Date,
      default: null,
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,

    // Audit Trail
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ nicNumber: 1 }, { sparse: true }); // Sparse index for NIC
userSchema.index({ role: 1 });
userSchema.index({ "businessInfo.licenseNumber": 1 });
userSchema.index({ isVerified: 1, isActive: 1 });
userSchema.index({ createdAt: -1 });

// Additional compound indexes for common queries
userSchema.index({ role: 1, isActive: 1 }); // For role-based user queries
userSchema.index({ role: 1, isVerified: 1 }); // For verification status queries
userSchema.index({ email: 1, isActive: 1 }); // For login queries

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual to check if account is locked
userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  // Only run if password is modified
  if (!this.isModified("password")) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update passwordChangedAt
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure token is created after password change
  next();
});

// Instance method to check password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if password changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method to handle failed login attempts
userSchema.methods.incLoginAttempts = function () {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };

  // Lock account after 5 failed attempts for 30 minutes
  if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + 30 * 60 * 1000 }; // 30 minutes
  }

  return this.updateOne(updates);
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function () {
  return this.updateOne({
    $unset: { loginAttempts: 1, lockUntil: 1 },
  });
};

// Instance method to create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Instance method to create email verification token
userSchema.methods.createEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");

  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

// Static method to get user roles
userSchema.statics.getUserRoles = function () {
  return [
    "vehicle_owner",
    "service_center",
    "repair_center",
    "insurance_agent",
    "police",
    "system_admin",
  ];
};

// Static method to find by role
userSchema.statics.findByRole = function (role) {
  return this.find({ role, isActive: true });
};

// Static method to find vehicle owners by NIC
userSchema.statics.findByNic = function (nicNumber) {
  return this.findOne({
    nicNumber: nicNumber.toUpperCase(),
    role: "vehicle_owner",
    isActive: true,
  });
};

// Transform JSON output
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.passwordResetToken;
  delete userObject.passwordResetExpires;
  delete userObject.emailVerificationToken;
  delete userObject.emailVerificationExpires;
  delete userObject.loginAttempts;
  delete userObject.lockUntil;
  return userObject;
};

const User = mongoose.model("User", userSchema);

export default User;
