import User from "../models/User.model.js";
import LOG from "../configs/log.config.js";
import {
  generatePasswordResetToken,
  generateEmailVerificationToken,
  isTokenExpired,
  validatePasswordStrength,
} from "../utils/password.util.js";
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendEmailVerificationReminder,
  sendPasswordChangeConfirmation,
  sendAccountLockedNotification,
  sendAccountVerificationSuccess,
} from "../utils/email.util.js";
import jwt from "jsonwebtoken";

/**
 * Register a new user
 */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    LOG.info("User registration attempt", {
      email,
      role,
      ip: clientIp,
      userAgent: req.get("user-agent"),
    });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      LOG.warn("Registration failed - email already exists", {
        email,
        ip: clientIp,
      });
      return res.status(400).json({
        success: false,
        message: "Email address is already registered",
      });
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      LOG.warn("Registration failed - weak password", {
        email,
        passwordScore: passwordValidation.score,
        ip: clientIp,
      });
      return res.status(400).json({
        success: false,
        message: "Password does not meet security requirements",
        errors: passwordValidation.feedback,
      });
    }

    // Generate email verification token
    const { token: emailVerificationToken, expires: emailVerificationExpires } =
      generateEmailVerificationToken();

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
      emailVerificationToken,
      emailVerificationExpires,
    });

    await user.save();

    // Send welcome email with verification link
    try {
      await sendWelcomeEmail(user, emailVerificationToken);
      LOG.info("Welcome email sent", {
        userId: user._id,
        email: user.email,
      });
    } catch (emailError) {
      LOG.error("Failed to send welcome email", {
        userId: user._id,
        email: user.email,
        error: emailError.message,
      });
      // Don't fail registration if email fails
    }

    // Generate tokens
    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // Store refresh token
    user.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date(),
    });
    await user.save();

    LOG.auth.register(user._id, user.email, user.role, true, {
      ip: clientIp,
      userAgent: req.get("user-agent"),
    });

    // Return user data without sensitive information
    const userData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
      data: {
        user: userData,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    LOG.error("Registration error", {
      error: error.message,
      stack: error.stack,
      email: req.body?.email,
      ip: req.ip,
    });

    // Handle specific mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } is already registered`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Registration failed. Please try again later.",
    });
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    LOG.info("User login attempt", {
      email,
      ip: clientIp,
      userAgent: req.get("user-agent"),
    });

    // Find user with password field
    const user = await User.findByEmailWithPassword(email);

    if (!user) {
      LOG.auth.login(null, email, false, {
        reason: "user_not_found",
        ip: clientIp,
      });
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      const unlockTime = new Date(user.lockUntil);
      LOG.auth.login(user._id, email, false, {
        reason: "account_locked",
        unlockTime: unlockTime.toISOString(),
        ip: clientIp,
      });

      return res.status(423).json({
        success: false,
        message: `Account is temporarily locked. Try again after ${unlockTime.toLocaleString()}`,
        unlockTime: unlockTime.toISOString(),
      });
    }

    // Check if account is active
    if (!user.isActive) {
      LOG.auth.login(user._id, email, false, {
        reason: "account_inactive",
        ip: clientIp,
      });
      return res.status(401).json({
        success: false,
        message: "Account has been deactivated. Please contact support.",
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      // Handle failed login attempt
      await user.handleFailedLogin();

      // Check if account is now locked after this attempt
      const updatedUser = await User.findById(user._id).select(
        "+lockUntil +loginAttempts"
      );

      if (updatedUser.isLocked) {
        const unlockTime = new Date(updatedUser.lockUntil);
        try {
          await sendAccountLockedNotification(user, unlockTime, clientIp);
        } catch (emailError) {
          LOG.error("Failed to send account locked email", {
            userId: user._id,
            error: emailError.message,
          });
        }

        LOG.auth.login(user._id, email, false, {
          reason: "account_locked_after_failed_attempt",
          unlockTime: unlockTime.toISOString(),
          ip: clientIp,
        });

        return res.status(423).json({
          success: false,
          message: `Too many failed login attempts. Account locked until ${unlockTime.toLocaleString()}`,
          unlockTime: unlockTime.toISOString(),
        });
      }

      LOG.auth.login(user._id, email, false, {
        reason: "invalid_password",
        attemptsRemaining: 5 - updatedUser.loginAttempts,
        ip: clientIp,
      });

      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        attemptsRemaining: 5 - updatedUser.loginAttempts,
      });
    }

    // Handle successful login
    await user.handleSuccessfulLogin();

    // Generate tokens
    const accessToken = user.generateAuthToken();
    const refreshToken = user.generateRefreshToken();

    // Store refresh token (limit to 5 active tokens per user)
    user.refreshTokens.push({
      token: refreshToken,
      createdAt: new Date(),
    });

    // Keep only the 5 most recent refresh tokens
    if (user.refreshTokens.length > 5) {
      user.refreshTokens = user.refreshTokens.slice(-5);
    }

    await user.save();

    LOG.auth.login(user._id, user.email, true, {
      ip: clientIp,
      userAgent: req.get("user-agent"),
    });

    // Return user data without sensitive information
    const userData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
      lastLogin: new Date(),
      createdAt: user.createdAt,
    };

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: userData,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    LOG.error("Login error", {
      error: error.message,
      stack: error.stack,
      email: req.body?.email,
      ip: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Login failed. Please try again later.",
    });
  }
};

/**
 * Refresh access token using refresh token
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, {
        issuer: "auto-connect",
        audience: "auto-connect-refresh",
      });

      // Find user and check if refresh token exists
      const user = await User.findById(decoded.userId);

      if (!user) {
        LOG.auth.tokenRefresh(decoded.userId, null, false, {
          reason: "user_not_found",
          ip: clientIp,
        });
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      if (!user.isActive) {
        LOG.auth.tokenRefresh(user._id, user.email, false, {
          reason: "account_inactive",
          ip: clientIp,
        });
        return res.status(401).json({
          success: false,
          message: "Account has been deactivated",
        });
      }

      // Check if refresh token exists in user's tokens
      const tokenExists = user.refreshTokens.some(
        (token) => token.token === refreshToken
      );

      if (!tokenExists) {
        LOG.auth.tokenRefresh(user._id, user.email, false, {
          reason: "token_not_found",
          ip: clientIp,
        });
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      // Generate new tokens
      const newAccessToken = user.generateAuthToken();
      const newRefreshToken = user.generateRefreshToken();

      // Replace old refresh token with new one
      user.refreshTokens = user.refreshTokens.filter(
        (token) => token.token !== refreshToken
      );
      user.refreshTokens.push({
        token: newRefreshToken,
        createdAt: new Date(),
      });

      await user.save();

      LOG.auth.tokenRefresh(user._id, user.email, true, {
        ip: clientIp,
      });

      res.json({
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (jwtError) {
      LOG.auth.tokenRefresh(null, null, false, {
        reason: "jwt_error",
        error: jwtError.message,
        ip: clientIp,
      });

      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      });
    }
  } catch (error) {
    LOG.error("Token refresh error", {
      error: error.message,
      stack: error.stack,
      ip: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Token refresh failed. Please try again later.",
    });
  }
};

/**
 * Logout user
 */
export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const user = req.user;
    const clientIp = req.ip || req.connection.remoteAddress;

    // Remove the specific refresh token if provided
    if (refreshToken && user) {
      user.refreshTokens = user.refreshTokens.filter(
        (token) => token.token !== refreshToken
      );
      await user.save();
    }

    LOG.auth.logout(user?._id, user?.email, {
      ip: clientIp,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    LOG.error("Logout error", {
      error: error.message,
      userId: req.user?._id,
      ip: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Logout failed. Please try again later.",
    });
  }
};

/**
 * Logout from all devices
 */
export const logoutAll = async (req, res) => {
  try {
    const user = req.user;
    const clientIp = req.ip || req.connection.remoteAddress;

    // Remove all refresh tokens
    user.refreshTokens = [];
    await user.save();

    LOG.auth.logout(user._id, user.email, {
      type: "logout_all_devices",
      ip: clientIp,
      userAgent: req.get("user-agent"),
    });

    res.json({
      success: true,
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    LOG.error("Logout all devices error", {
      error: error.message,
      userId: req.user?._id,
      ip: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Logout failed. Please try again later.",
    });
  }
};

/**
 * Verify email address
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const clientIp = req.ip || req.connection.remoteAddress;

    LOG.info("Email verification attempt", {
      token: token.substring(0, 10) + "...",
      ip: clientIp,
    });

    // Find user with verification token
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      LOG.warn("Email verification failed - invalid or expired token", {
        token: token.substring(0, 10) + "...",
        ip: clientIp,
      });
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    }

    // Update user verification status
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send verification success email
    try {
      await sendAccountVerificationSuccess(user);
    } catch (emailError) {
      LOG.error("Failed to send verification success email", {
        userId: user._id,
        error: emailError.message,
      });
    }

    LOG.info("Email verification successful", {
      userId: user._id,
      email: user.email,
      ip: clientIp,
    });

    res.json({
      success: true,
      message: "Email verified successfully",
      data: {
        user: {
          _id: user._id,
          email: user.email,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    LOG.error("Email verification error", {
      error: error.message,
      stack: error.stack,
      ip: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Email verification failed. Please try again later.",
    });
  }
};

/**
 * Resend email verification
 */
export const resendEmailVerification = async (req, res) => {
  try {
    const user = req.user;
    const clientIp = req.ip || req.connection.remoteAddress;

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified",
      });
    }

    // Generate new verification token
    const { token: emailVerificationToken, expires: emailVerificationExpires } =
      generateEmailVerificationToken();

    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationExpires = emailVerificationExpires;
    await user.save();

    // Send verification email
    try {
      await sendEmailVerificationReminder(user, emailVerificationToken);
      LOG.info("Verification email resent", {
        userId: user._id,
        email: user.email,
        ip: clientIp,
      });
    } catch (emailError) {
      LOG.error("Failed to resend verification email", {
        userId: user._id,
        email: user.email,
        error: emailError.message,
      });
      return res.status(500).json({
        success: false,
        message: "Failed to send verification email. Please try again later.",
      });
    }

    res.json({
      success: true,
      message: "Verification email sent successfully",
    });
  } catch (error) {
    LOG.error("Resend verification email error", {
      error: error.message,
      userId: req.user?._id,
      ip: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Failed to resend verification email. Please try again later.",
    });
  }
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    LOG.info("Password reset request", {
      email,
      ip: clientIp,
    });

    // Find user by email
    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    const successResponse = {
      success: true,
      message:
        "If the email address exists, a password reset link has been sent.",
    };

    if (!user) {
      LOG.warn("Password reset requested for non-existent email", {
        email,
        ip: clientIp,
      });
      return res.json(successResponse);
    }

    if (!user.isActive) {
      LOG.warn("Password reset requested for inactive account", {
        userId: user._id,
        email,
        ip: clientIp,
      });
      return res.json(successResponse);
    }

    // Generate password reset token
    const { token: passwordResetToken, expires: passwordResetExpires } =
      generatePasswordResetToken();

    user.passwordResetToken = passwordResetToken;
    user.passwordResetExpires = passwordResetExpires;
    await user.save();

    // Send password reset email
    try {
      await sendPasswordResetEmail(user, passwordResetToken);
      LOG.auth.passwordReset(user.email, true, {
        userId: user._id,
        ip: clientIp,
      });
    } catch (emailError) {
      LOG.error("Failed to send password reset email", {
        userId: user._id,
        email: user.email,
        error: emailError.message,
      });
      // Still return success to prevent email enumeration
    }

    res.json(successResponse);
  } catch (error) {
    LOG.error("Password reset request error", {
      error: error.message,
      stack: error.stack,
      email: req.body?.email,
      ip: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Password reset request failed. Please try again later.",
    });
  }
};

/**
 * Reset password using token
 */
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const clientIp = req.ip || req.connection.remoteAddress;

    LOG.info("Password reset attempt", {
      token: token.substring(0, 10) + "...",
      ip: clientIp,
    });

    // Find user with valid reset token
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      LOG.warn("Password reset failed - invalid or expired token", {
        token: token.substring(0, 10) + "...",
        ip: clientIp,
      });
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      LOG.warn("Password reset failed - weak password", {
        userId: user._id,
        passwordScore: passwordValidation.score,
        ip: clientIp,
      });
      return res.status(400).json({
        success: false,
        message: "Password does not meet security requirements",
        errors: passwordValidation.feedback,
      });
    }

    // Update password and clear reset token
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Clear all refresh tokens to force re-login
    user.refreshTokens = [];

    // Reset login attempts if account was locked
    user.loginAttempts = undefined;
    user.lockUntil = undefined;

    await user.save();

    // Send confirmation email
    try {
      await sendPasswordChangeConfirmation(user, clientIp);
    } catch (emailError) {
      LOG.error("Failed to send password change confirmation", {
        userId: user._id,
        error: emailError.message,
      });
    }

    LOG.auth.passwordReset(user.email, true, {
      userId: user._id,
      type: "password_reset_completed",
      ip: clientIp,
    });

    res.json({
      success: true,
      message:
        "Password reset successful. Please login with your new password.",
    });
  } catch (error) {
    LOG.error("Password reset error", {
      error: error.message,
      stack: error.stack,
      ip: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Password reset failed. Please try again later.",
    });
  }
};

/**
 * Change password (for authenticated users)
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    const clientIp = req.ip || req.connection.remoteAddress;

    LOG.info("Password change attempt", {
      userId: user._id,
      email: user.email,
      ip: clientIp,
    });

    // Get user with password field
    const userWithPassword = await User.findById(user._id).select("+password");

    // Verify current password
    const isCurrentPasswordValid = await userWithPassword.comparePassword(
      currentPassword
    );
    if (!isCurrentPasswordValid) {
      LOG.warn("Password change failed - invalid current password", {
        userId: user._id,
        ip: clientIp,
      });
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(newPassword);
    if (!passwordValidation.isValid) {
      LOG.warn("Password change failed - weak new password", {
        userId: user._id,
        passwordScore: passwordValidation.score,
        ip: clientIp,
      });
      return res.status(400).json({
        success: false,
        message: "New password does not meet security requirements",
        errors: passwordValidation.feedback,
      });
    }

    // Check if new password is different from current
    const isSamePassword = await userWithPassword.comparePassword(newPassword);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Update password
    userWithPassword.password = newPassword;
    await userWithPassword.save();

    // Send confirmation email
    try {
      await sendPasswordChangeConfirmation(user, clientIp);
    } catch (emailError) {
      LOG.error("Failed to send password change confirmation", {
        userId: user._id,
        error: emailError.message,
      });
    }

    LOG.info("Password changed successfully", {
      userId: user._id,
      email: user.email,
      ip: clientIp,
    });

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    LOG.error("Password change error", {
      error: error.message,
      userId: req.user?._id,
      ip: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Password change failed. Please try again later.",
    });
  }
};

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = req.user;

    const userData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({
      success: true,
      data: {
        user: userData,
      },
    });
  } catch (error) {
    LOG.error("Get profile error", {
      error: error.message,
      userId: req.user?._id,
      ip: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Failed to retrieve profile. Please try again later.",
    });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const user = req.user;
    const clientIp = req.ip || req.connection.remoteAddress;

    LOG.info("Profile update attempt", {
      userId: user._id,
      email: user.email,
      ip: clientIp,
    });

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;

    await user.save();

    LOG.info("Profile updated successfully", {
      userId: user._id,
      email: user.email,
      updatedFields: Object.keys(req.body),
      ip: clientIp,
    });

    const userData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: userData,
      },
    });
  } catch (error) {
    LOG.error("Profile update error", {
      error: error.message,
      userId: req.user?._id,
      ip: req.ip,
    });

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Profile update failed. Please try again later.",
    });
  }
};

/**
 * Get user statistics (for admin dashboard)
 */
export const getUserStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const stats = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ isActive: true }),
      User.countDocuments({ role: "vehicle_owner" }),
      User.countDocuments({ role: "service_provider" }),
      User.countDocuments({ role: "insurance_company" }),
      User.countDocuments({
        createdAt: {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    const userStats = {
      total: stats[0],
      verified: stats[1],
      active: stats[2],
      vehicleOwners: stats[3],
      serviceProviders: stats[4],
      insuranceCompanies: stats[5],
      newUsersLast30Days: stats[6],
      verificationRate:
        stats[0] > 0 ? ((stats[1] / stats[0]) * 100).toFixed(2) : 0,
      activeRate: stats[0] > 0 ? ((stats[2] / stats[0]) * 100).toFixed(2) : 0,
    };

    res.json({
      success: true,
      data: {
        stats: userStats,
      },
    });
  } catch (error) {
    LOG.error("Get user stats error", {
      error: error.message,
      userId: req.user?._id,
      ip: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Failed to retrieve user statistics.",
    });
  }
};

/**
 * Get user list (admin only with pagination and filtering)
 */
export const getUserList = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const {
      page = 1,
      limit = 10,
      role,
      isVerified,
      isActive,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter object
    const filter = {};
    if (role) filter.role = role;
    if (isVerified !== undefined) filter.isVerified = isVerified === "true";
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute queries
    const [users, totalCount] = await Promise.all([
      User.find(filter)
        .select(
          "-password -refreshTokens -emailVerificationToken -passwordResetToken"
        )
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  } catch (error) {
    LOG.error("Get user list error", {
      error: error.message,
      userId: req.user?._id,
      ip: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Failed to retrieve user list.",
    });
  }
};

/**
 * Update user status (admin only)
 */
export const updateUserStatus = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const { userId } = req.params;
    const { isActive, isVerified } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deactivating their own account
    if (userId === req.user._id.toString() && isActive === false) {
      return res.status(400).json({
        success: false,
        message: "Cannot deactivate your own account",
      });
    }

    // Update status fields
    if (isActive !== undefined) user.isActive = isActive;
    if (isVerified !== undefined) user.isVerified = isVerified;

    await user.save();

    LOG.info("User status updated by admin", {
      adminId: req.user._id,
      targetUserId: userId,
      changes: { isActive, isVerified },
      ip: req.ip,
    });

    res.json({
      success: true,
      message: "User status updated successfully",
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    LOG.error("Update user status error", {
      error: error.message,
      userId: req.user?._id,
      ip: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Failed to update user status.",
    });
  }
};

/**
 * Delete user account (admin only or self-deletion)
 */
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    // Check if user is trying to delete their own account or is an admin
    const isOwnAccount = userId === currentUser._id.toString();
    const isAdmin = currentUser.role === "admin";

    if (!isOwnAccount && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You can only delete your own account or admin privileges required.",
      });
    }

    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deleting their own account if they're the only admin
    if (isOwnAccount && currentUser.role === "admin") {
      const adminCount = await User.countDocuments({
        role: "admin",
        isActive: true,
      });
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: "Cannot delete the last active admin account",
        });
      }
    }

    // Soft delete by deactivating the account
    userToDelete.isActive = false;
    userToDelete.email = `deleted_${Date.now()}_${userToDelete.email}`;
    userToDelete.refreshTokens = [];
    await userToDelete.save();

    LOG.info("User account deleted", {
      deletedBy: currentUser._id,
      deletedUser: userId,
      isOwnAccount,
      ip: req.ip,
    });

    res.json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    LOG.error("Delete user error", {
      error: error.message,
      userId: req.user?._id,
      ip: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Failed to delete user account.",
    });
  }
};

/**
 * Check if email exists (for frontend validation)
 */
export const checkEmailExists = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email parameter is required",
      });
    }

    const user = await User.findOne({ email });

    res.json({
      success: true,
      data: {
        exists: !!user,
      },
    });
  } catch (error) {
    LOG.error("Check email exists error", {
      error: error.message,
      ip: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Failed to check email existence.",
    });
  }
};

/**
 * Get user activity log (admin only)
 */
export const getUserActivity = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin privileges required.",
      });
    }

    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // This would typically come from a separate activity log collection
    // For now, we'll return basic user information
    const activity = {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        loginAttempts: user.loginAttempts || 0,
        lockUntil: user.lockUntil,
      },
      recentActivity: [
        {
          action: "account_created",
          timestamp: user.createdAt,
          details: "User account created",
        },
        ...(user.lastLogin
          ? [
              {
                action: "last_login",
                timestamp: user.lastLogin,
                details: "Last successful login",
              },
            ]
          : []),
        ...(user.isVerified
          ? [
              {
                action: "email_verified",
                timestamp: user.updatedAt,
                details: "Email address verified",
              },
            ]
          : []),
      ],
    };

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    LOG.error("Get user activity error", {
      error: error.message,
      userId: req.user?._id,
      ip: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Failed to retrieve user activity.",
    });
  }
};

/**
 * Verify JWT token (for frontend token validation)
 */
export const verifyToken = async (req, res) => {
  try {
    const user = req.user;

    res.json({
      success: true,
      message: "Token is valid",
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          isActive: user.isActive,
        },
      },
    });
  } catch (error) {
    LOG.error("Token verification error", {
      error: error.message,
      userId: req.user?._id,
      ip: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Token verification failed.",
    });
  }
};
