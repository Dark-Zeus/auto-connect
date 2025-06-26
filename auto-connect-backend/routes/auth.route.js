import express from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  verifyEmail,
  resendEmailVerification,
  requestPasswordReset,
  resetPassword,
  changePassword,
  getProfile,
  updateProfile,
} from "../controllers/auth.controller.js";
import {
  authenticate,
  requireVerification,
} from "../middleware/auth.middleware.js";
import {
  validateUserRegistration,
  validateUserLogin,
  validatePasswordResetRequest,
  validatePasswordReset,
  validateChangePassword,
  validateEmailVerification,
  validateRefreshToken,
  validateProfileUpdate,
  sanitizeInput,
} from "../middleware/validation.middleware.js";
import {
  authRateLimit,
  passwordResetRateLimit,
  emailVerificationRateLimit,
  createDynamicRateLimit,
} from "../middleware/rateLimiting.middleware.js";

const router = express.Router();

// Apply input sanitization to all routes
router.use(sanitizeInput);

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", authRateLimit, validateUserRegistration, register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", authRateLimit, validateUserLogin, login);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token
 * @access  Public
 */
router.post(
  "/refresh-token",
  authRateLimit,
  validateRefreshToken,
  refreshToken
);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post("/logout", authenticate, logout);

/**
 * @route   POST /api/v1/auth/logout-all
 * @desc    Logout from all devices
 * @access  Private
 */
router.post("/logout-all", authenticate, logoutAll);

/**
 * @route   GET /api/v1/auth/verify-email/:token
 * @desc    Verify email address
 * @access  Public
 */
router.get(
  "/verify-email/:token",
  emailVerificationRateLimit,
  validateEmailVerification,
  verifyEmail
);

/**
 * @route   POST /api/v1/auth/resend-verification
 * @desc    Resend email verification
 * @access  Private
 */
router.post(
  "/resend-verification",
  authenticate,
  emailVerificationRateLimit,
  resendEmailVerification
);

/**
 * @route   POST /api/v1/auth/request-password-reset
 * @desc    Request password reset
 * @access  Public
 */
router.post(
  "/request-password-reset",
  passwordResetRateLimit,
  validatePasswordResetRequest,
  requestPasswordReset
);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password using token
 * @access  Public
 */
router.post(
  "/reset-password",
  authRateLimit,
  validatePasswordReset,
  resetPassword
);

/**
 * @route   POST /api/v1/auth/change-password
 * @desc    Change password for authenticated user
 * @access  Private
 */
router.post(
  "/change-password",
  authenticate,
  authRateLimit,
  validateChangePassword,
  changePassword
);

/**
 * @route   GET /api/v1/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/profile", authenticate, createDynamicRateLimit(50), getProfile);

/**
 * @route   PUT /api/v1/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  "/profile",
  authenticate,
  createDynamicRateLimit(20),
  validateProfileUpdate,
  updateProfile
);

/**
 * @route   GET /api/v1/auth/profile/verified
 * @desc    Get current user profile (verified users only)
 * @access  Private (Verified)
 */
router.get(
  "/profile/verified",
  authenticate,
  requireVerification,
  createDynamicRateLimit(50),
  getProfile
);

export default router;
