// models/User.js (Updated with Sri Lankan fields)
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["vehicle_owner", "service_provider", "insurance_company", "admin"],
      default: "vehicle_owner",
    },
    // Sri Lankan specific fields
    nationalIdNumber: {
      type: String,
      required: function () {
        return this.role === "vehicle_owner";
      },
      unique: true,
      sparse: true,
      trim: true,
    },
    passportNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      district: String,
      province: {
        type: String,
        enum: [
          "Western Province",
          "Central Province",
          "Southern Province",
          "Northern Province",
          "Eastern Province",
          "North Western Province",
          "North Central Province",
          "Uva Province",
          "Sabaragamuwa Province",
        ],
      },
      postalCode: String,
      country: { type: String, default: "Sri Lanka" },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profileImage: String,
    dateOfBirth: Date,
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
