// controllers/auth.controller.js
import crypto from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import LOG from "../configs/log.config.js";
import { createSendToken, signToken } from "../middleware/auth.middleware.js";
import { sendEmail } from "../utils/email.util.js";
import { catchAsync } from "../utils/catchAsync.util.js";
import { AppError } from "../utils/appError.util.js";

// Optimized register controller for your multi-step frontend

export const register = catchAsync(async (req, res, next) => {
  // Enhanced debugging
  console.log("🔥 === REGISTER CONTROLLER START ===");
  console.log("📦 Request body:", JSON.stringify(req.body, null, 2));
  console.log("🌐 Request headers:", {
    "content-type": req.headers["content-type"],
    "user-agent": req.headers["user-agent"],
    origin: req.headers["origin"],
  });
  console.log("🔍 Body keys:", Object.keys(req.body || {}));
  console.log("===============================");

  const {
    firstName,
    lastName,
    email,
    phone,
    role,
    password,
    passwordConfirm,
    address,
    businessInfo,
  } = req.body;

  // 1) Validate password confirmation
  if (password !== passwordConfirm) {
    console.log("❌ Password mismatch:", {
      password: "***",
      passwordConfirm: "***",
    });
    return next(new AppError("Passwords do not match", 400));
  }

  // 2) Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("❌ User already exists:", email);
    LOG.warn({
      message: "Registration attempt with existing email",
      email,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });

    return next(new AppError("User with this email already exists", 400));
  }

  // 3) Validate role-specific required fields
  if (["service_center", "repair_center", "insurance_agent"].includes(role)) {
    if (
      !businessInfo ||
      !businessInfo.businessName ||
      !businessInfo.licenseNumber ||
      !businessInfo.businessRegistrationNumber ||
      !businessInfo.taxIdentificationNumber
    ) {
      console.log("❌ Missing business info for role:", role, businessInfo);
      return next(
        new AppError(
          "Complete business information is required for this role",
          400
        )
      );
    }
  }

  if (role === "police") {
    if (
      !businessInfo ||
      !businessInfo.badgeNumber ||
      !businessInfo.department ||
      !businessInfo.rank
    ) {
      console.log("❌ Missing police info for role:", role, businessInfo);
      return next(
        new AppError(
          "Badge number, department, and rank are required for police registration",
          400
        )
      );
    }
  }

  // 4) Create user data object
  const userData = {
    firstName,
    lastName,
    email,
    phone,
    role,
    password,
    address: {
      street: address?.street || "",
      city: address?.city || "",
      district: address?.district || "",
      province: address?.province || "",
      postalCode: address?.postalCode || "",
    },
    businessInfo: businessInfo || {},
  };

  console.log("✅ User data prepared:", {
    ...userData,
    password: "***", // Hide password in logs
  });

  // 5) System admin can only be created by another system admin (or if no admins exist)
  if (role === "system_admin") {
    const adminCount = await User.countDocuments({ role: "system_admin" });
    console.log("👑 Admin count:", adminCount);

    if (adminCount > 0) {
      // Check if current user is admin
      if (!req.user || req.user.role !== "system_admin") {
        console.log("❌ Unauthorized admin creation attempt");
        return next(
          new AppError(
            "Only system administrators can create admin accounts",
            403
          )
        );
      }
      userData.isVerified = true; // Auto-verify admin-created accounts
      userData.emailVerified = true;
    } else {
      // First admin - auto-verify
      console.log("👑 Creating first system admin");
      userData.isVerified = true;
      userData.emailVerified = true;
    }
  }

  try {
    // 6) Create new user
    console.log("💾 Creating user in database...");
    const newUser = await User.create(userData);
    console.log("✅ User created successfully:", newUser._id);

    // 7) Generate email verification token (unless auto-verified)
    let verificationToken;
    if (!newUser.isVerified && !newUser.emailVerified) {
      console.log("📧 Generating verification token...");
      verificationToken = newUser.createEmailVerificationToken();
      await newUser.save({ validateBeforeSave: false });
      console.log("✅ Verification token generated");
    }

    // 8) Log successful registration
    LOG.info({
      message: "New user registered",
      userId: newUser._id,
      email: newUser.email,
      role: newUser.role,
      isVerified: newUser.isVerified,
      emailVerified: newUser.emailVerified,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });

    // 9) Send verification email (if needed)
    if (verificationToken) {
      try {
        console.log("📧 Sending verification email...");
        const verifyURL = `${req.protocol}://${req.get(
          "host"
        )}/api/v1/auth/verify-email/${verificationToken}`;

        await sendEmail({
          email: newUser.email,
          subject: "AutoConnect - Email Verification",
          message: `Please verify your email by clicking this link: ${verifyURL}`,
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #2c3e50;">Welcome to AutoConnect!</h2>
              <p>Hello ${newUser.firstName},</p>
              <p>Thank you for registering with AutoConnect. Please verify your email address by clicking the button below:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyURL}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a>
              </div>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create this account, please ignore this email.</p>
              <hr style="margin: 30px 0;">
              <p style="font-size: 12px; color: #666;">This is an automated message from AutoConnect. Please do not reply to this email.</p>
            </div>
          `,
        });

        console.log("✅ Verification email sent successfully");
        LOG.info({
          message: "Verification email sent",
          userId: newUser._id,
          email: newUser.email,
        });
      } catch (error) {
        console.log("❌ Failed to send verification email:", error.message);
        LOG.error({
          message: "Failed to send verification email",
          userId: newUser._id,
          email: newUser.email,
          error: error.message,
        });

        // Clean up user and token
        newUser.emailVerificationToken = undefined;
        newUser.emailVerificationExpires = undefined;
        await newUser.save({ validateBeforeSave: false });
      }
    }

    // 10) Send response (auto-login if verified, otherwise require verification)
    if (newUser.isVerified || newUser.emailVerified) {
      console.log("✅ Auto-logging in verified user");
      createSendToken(
        newUser,
        201,
        res,
        "User registered and logged in successfully"
      );
    } else {
      console.log("✅ Registration successful, verification required");
      res.status(201).json({
        success: true,
        message:
          "Registration successful! Please check your email for verification instructions.",
        data: {
          user: {
            id: newUser._id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role,
            isVerified: newUser.isVerified,
            emailVerified: newUser.emailVerified,
          },
        },
        requiresVerification: true,
      });
    }

    console.log("🔥 === REGISTER CONTROLLER END ===");
  } catch (error) {
    console.log("💥 Registration error:", error);
    console.log("🔥 === REGISTER CONTROLLER END (ERROR) ===");

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const message = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } already exists`;
      return next(new AppError(message, 400));
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((val) => val.message);
      const message = `Invalid input data: ${errors.join(", ")}`;
      return next(new AppError(message, 400));
    }

    return next(new AppError("Registration failed. Please try again.", 500));
  }
});

// Login user
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if user exists and password is correct
  const user = await User.findOne({ email }).select(
    "+password +loginAttempts +lockUntil"
  );

  // 3) Check if account is locked
  if (user && user.isLocked) {
    LOG.warn({
      message: "Login attempt on locked account",
      userId: user._id,
      email: user.email,
      lockUntil: user.lockUntil,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });

    return next(
      new AppError(
        "Account is temporarily locked due to multiple failed login attempts. Please try again later.",
        423
      )
    );
  }

  // 4) Verify user and password
  if (!user || !(await user.correctPassword(password, user.password))) {
    if (user) {
      // Increment failed login attempts
      await user.incLoginAttempts();

      LOG.warn({
        message: "Failed login attempt - incorrect password",
        userId: user._id,
        email: user.email,
        loginAttempts: user.loginAttempts + 1,
        ip: req.ip,
        userAgent: req.get("user-agent"),
      });
    } else {
      LOG.warn({
        message: "Failed login attempt - user not found",
        email,
        ip: req.ip,
        userAgent: req.get("user-agent"),
      });
    }

    return next(new AppError("Incorrect email or password", 401));
  }

  // 5) Check if user is active
  if (!user.isActive) {
    LOG.warn({
      message: "Login attempt on inactive account",
      userId: user._id,
      email: user.email,
      ip: req.ip,
    });

    return next(
      new AppError(
        "Your account has been deactivated. Please contact support.",
        401
      )
    );
  }

  // 6) Reset login attempts on successful login
  if (user.loginAttempts > 0) {
    await user.resetLoginAttempts();
  }

  // 7) Check email verification for certain roles
  if (
    ["service_center", "repair_center", "insurance_agent"].includes(
      user.role
    ) &&
    !user.emailVerified
  ) {
    LOG.warn({
      message: "Login attempt with unverified email",
      userId: user._id,
      email: user.email,
      role: user.role,
      ip: req.ip,
    });

    return res.status(401).json({
      success: false,
      message: "Please verify your email address before logging in.",
      requiresEmailVerification: true,
    });
  }

  // 8) All checks passed - create and send token
  createSendToken(user, 200, res, "Logged in successfully");
});

// Logout user
export const logout = (req, res) => {
  // Clear cookies
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.cookie("refreshToken", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  LOG.info({
    message: "User logged out",
    userId: req.user?._id,
    email: req.user?.email,
    ip: req.ip,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

// Forgot password
export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    // Don't reveal if email exists or not
    return res.status(200).json({
      success: true,
      message:
        "If your email is registered, you will receive a password reset link.",
    });
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/reset-password/${resetToken}`;

    await sendEmail({
      email: user.email,
      subject: "AutoConnect - Password Reset Request",
      message: `You requested a password reset. Please use this link to reset your password: ${resetURL}`,
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your AutoConnect account.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetURL}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
      `,
    });

    LOG.info({
      message: "Password reset email sent",
      userId: user._id,
      email: user.email,
      ip: req.ip,
    });

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    LOG.error({
      message: "Failed to send password reset email",
      userId: user._id,
      email: user.email,
      error: err.message,
      ip: req.ip,
    });

    return next(
      new AppError(
        "There was an error sending the email. Please try again later.",
        500
      )
    );
  }
});

// Reset password
export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  // 3) Validate password confirmation
  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError("Passwords do not match", 400));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  LOG.info({
    message: "Password reset successfully",
    userId: user._id,
    email: user.email,
    ip: req.ip,
  });

  // 4) Log the user in, send JWT
  createSendToken(user, 200, res, "Password reset successfully");
});

// Update password (for logged in users)
export const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is incorrect.", 401));
  }

  // 3) Validate new password confirmation
  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError("Passwords do not match", 400));
  }

  // 4) If so, update password
  user.password = req.body.password;
  await user.save();

  LOG.info({
    message: "Password updated successfully",
    userId: user._id,
    email: user.email,
    ip: req.ip,
  });

  // 5) Log user in, send JWT
  createSendToken(user, 200, res, "Password updated successfully");
});

// Verify email
export const verifyEmail = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, verify the email
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  LOG.info({
    message: "Email verified successfully",
    userId: user._id,
    email: user.email,
    ip: req.ip,
  });

  res.status(200).json({
    success: true,
    message: "Email verified successfully!",
  });
});

// Resend verification email
export const resendVerificationEmail = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("User not found with this email address", 404));
  }

  if (user.emailVerified) {
    return next(new AppError("Email is already verified", 400));
  }

  // Generate new verification token
  const verificationToken = user.createEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  try {
    const verifyURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/verify-email/${verificationToken}`;

    await sendEmail({
      email: user.email,
      subject: "AutoConnect - Email Verification",
      message: `Please verify your email by clicking this link: ${verifyURL}`,
      html: `
        <h2>Email Verification</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verifyURL}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });

    LOG.info({
      message: "Verification email resent",
      userId: user._id,
      email: user.email,
      ip: req.ip,
    });

    res.status(200).json({
      success: true,
      message: "Verification email sent successfully!",
    });
  } catch (error) {
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    LOG.error({
      message: "Failed to resend verification email",
      userId: user._id,
      email: user.email,
      error: error.message,
      ip: req.ip,
    });

    return next(
      new AppError(
        "There was an error sending the email. Please try again later.",
        500
      )
    );
  }
});

// Get current user
export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

// Update current user profile
export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /update-password.",
        400
      )
    );
  }

  // 2) Filter out unwanted fields that are not allowed to be updated
  const filteredBody = filterObj(
    req.body,
    "firstName",
    "lastName",
    "phone",
    "address",
    "profileImage"
  );

  // 3) Allow business info updates for service providers
  if (
    ["service_center", "repair_center", "insurance_agent"].includes(
      req.user.role
    )
  ) {
    if (req.body.businessInfo) {
      filteredBody.businessInfo = req.body.businessInfo;
    }
  }

  // 4) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  updatedUser.lastModifiedBy = req.user.id;
  await updatedUser.save({ validateBeforeSave: false });

  LOG.info({
    message: "User profile updated",
    userId: req.user._id,
    email: req.user.email,
    updatedFields: Object.keys(filteredBody),
    ip: req.ip,
  });

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      user: updatedUser,
    },
  });
});

// Deactivate current user account
export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    isActive: false,
    lastModifiedBy: req.user.id,
  });

  LOG.info({
    message: "User account deactivated",
    userId: req.user._id,
    email: req.user.email,
    ip: req.ip,
  });

  res.status(204).json({
    success: true,
    message: "Account deactivated successfully",
  });
});

// Check auth status
export const checkAuthStatus = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    authenticated: !!req.user,
    data: {
      user: req.user || null,
    },
  });
});

// Helper function to filter object
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
