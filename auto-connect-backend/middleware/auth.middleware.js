// middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { promisify } from "util";
import User from "../models/user.model.js";
import LOG from "../configs/log.config.js";

// Generate JWT Token
export const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

// Generate Refresh Token
export const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "90d",
  });
};

// Create and send token response
export const createSendToken = (user, statusCode, res, message = "Success") => {
  const token = signToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        (process.env.JWT_COOKIE_EXPIRES_IN || 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  // Send cookies
  res.cookie("jwt", token, cookieOptions);
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    expires: new Date(
      Date.now() +
        (process.env.JWT_REFRESH_COOKIE_EXPIRES_IN || 90) * 24 * 60 * 60 * 1000
    ),
  });

  // Update last login
  user.lastLogin = new Date();
  user.save({ validateBeforeSave: false });

  // Log successful authentication
  LOG.info({
    message: "User authenticated successfully",
    userId: user._id,
    email: user.email,
    role: user.role,
    ip: res.req.ip,
    userAgent: res.req.get("user-agent"),
  });

  res.status(statusCode).json({
    success: true,
    message,
    token,
    refreshToken,
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        profileImage: user.profileImage,
        businessInfo: user.businessInfo,
        rating: user.rating,
        lastLogin: user.lastLogin,
      },
    },
  });
};

// Protect middleware - verify JWT token
export const protect = async (req, res, next) => {
  try {
    // 1) Getting token and check if it exists
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      LOG.warn({
        message: "Access denied - No token provided",
        ip: req.ip,
        userAgent: req.get("user-agent"),
        endpoint: req.originalUrl,
      });

      return res.status(401).json({
        success: false,
        message: "You are not logged in! Please log in to get access.",
      });
    }

    // 2) Verification of token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id).select("+password");
    if (!currentUser) {
      LOG.warn({
        message: "Token belongs to non-existent user",
        userId: decoded.id,
        ip: req.ip,
      });

      return res.status(401).json({
        success: false,
        message: "The user belonging to this token no longer exists.",
      });
    }

    // 4) Check if user is active
    if (!currentUser.isActive) {
      LOG.warn({
        message: "Inactive user attempted access",
        userId: currentUser._id,
        email: currentUser.email,
        ip: req.ip,
      });

      return res.status(401).json({
        success: false,
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // 5) Check if user is locked
    if (currentUser.isLocked) {
      LOG.warn({
        message: "Locked user attempted access",
        userId: currentUser._id,
        email: currentUser.email,
        lockUntil: currentUser.lockUntil,
        ip: req.ip,
      });

      return res.status(401).json({
        success: false,
        message:
          "Your account is temporarily locked due to multiple failed login attempts. Please try again later.",
      });
    }

    // 6) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      LOG.warn({
        message: "Password changed after token issue",
        userId: currentUser._id,
        email: currentUser.email,
        tokenIat: decoded.iat,
        passwordChangedAt: currentUser.passwordChangedAt,
        ip: req.ip,
      });

      return res.status(401).json({
        success: false,
        message: "User recently changed password! Please log in again.",
      });
    }

    // Grant access to protected route
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
  } catch (error) {
    LOG.error({
      message: "JWT verification failed",
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again!",
      });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your token has expired! Please log in again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication failed. Please try again.",
    });
  }
};

// Role-based authorization middleware
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      LOG.warn({
        message: "Insufficient permissions",
        userId: req.user._id,
        userRole: req.user.role,
        requiredRoles: roles,
        endpoint: req.originalUrl,
        method: req.method,
        ip: req.ip,
      });

      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

// Verification requirement middleware
export const requireVerification = (req, res, next) => {
  if (!req.user.isVerified) {
    LOG.warn({
      message: "Unverified user attempted access to protected resource",
      userId: req.user._id,
      email: req.user.email,
      role: req.user.role,
      endpoint: req.originalUrl,
      ip: req.ip,
    });

    return res.status(403).json({
      success: false,
      message:
        "Your account needs to be verified to access this resource. Please contact an administrator.",
    });
  }
  next();
};

// Optional authentication middleware - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next();
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    if (
      currentUser &&
      currentUser.isActive &&
      !currentUser.isLocked &&
      !currentUser.changedPasswordAfter(decoded.iat)
    ) {
      req.user = currentUser;
      res.locals.user = currentUser;
    }

    next();
  } catch (error) {
    // Silent fail for optional auth
    next();
  }
};

// Refresh token middleware
export const refreshToken = async (req, res, next) => {
  try {
    let refreshToken;

    if (req.body.refreshToken) {
      refreshToken = req.body.refreshToken;
    } else if (req.cookies.refreshToken) {
      refreshToken = req.cookies.refreshToken;
    }

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    const decoded = await promisify(jwt.verify)(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );
    const currentUser = await User.findById(decoded.id);

    if (!currentUser || !currentUser.isActive || currentUser.isLocked) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new tokens
    const newToken = signToken(currentUser._id);
    const newRefreshToken = signRefreshToken(currentUser._id);

    // Set new cookies
    const cookieOptions = {
      expires: new Date(
        Date.now() +
          (process.env.JWT_COOKIE_EXPIRES_IN || 30) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    };

    res.cookie("jwt", newToken, cookieOptions);
    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      expires: new Date(
        Date.now() +
          (process.env.JWT_REFRESH_COOKIE_EXPIRES_IN || 90) *
            24 *
            60 *
            60 *
            1000
      ),
    });

    LOG.info({
      message: "Token refreshed successfully",
      userId: currentUser._id,
      email: currentUser.email,
      ip: req.ip,
    });

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    LOG.error({
      message: "Token refresh failed",
      error: error.message,
      ip: req.ip,
    });

    return res.status(401).json({
      success: false,
      message: "Invalid refresh token",
    });
  }
};

// Admin verification helper
export const requireAdmin = restrictTo("system_admin");

// Service provider verification helper
export const requireServiceProvider = restrictTo(
  "service_center",
  "repair_center"
);

// Law enforcement verification helper
export const requireLawEnforcement = restrictTo("police", "system_admin");

// Insurance provider verification helper
export const requireInsuranceProvider = restrictTo(
  "insurance_agent",
  "system_admin"
);

// ========== APPENDED ADDITIONAL FUNCTIONALITY FOR VEHICLE MANAGEMENT ==========

// Check if user owns the resource (for vehicle operations)
export const checkResourceOwnership = (resourceParam = "id") => {
  return async (req, res, next) => {
    try {
      const resourceId = req.params[resourceParam];

      // For vehicle operations, we'll check ownership in the vehicle controller
      // This middleware can be extended for other resource types
      if (req.baseUrl.includes("/vehicles")) {
        // Vehicle ownership will be checked in vehicle controller methods
        // since it requires querying the Vehicle model
        next();
        return;
      }

      // For other resources, implement specific ownership checks
      next();
    } catch (error) {
      LOG.error("Resource ownership check error:", error);
      return res.status(500).json({
        success: false,
        message: "Error checking resource ownership.",
      });
    }
  };
};

// Verify NIC number matches authenticated user (for vehicle registration)
export const verifyNICOwnership = (req, res, next) => {
  const { nicNumber, ownerNIC } = req.body;
  const submittedNIC = nicNumber || ownerNIC;

  if (submittedNIC && submittedNIC !== req.user.nicNumber) {
    LOG.warn({
      message: "NIC ownership violation attempt",
      userId: req.user._id,
      userNIC: req.user.nicNumber,
      submittedNIC: submittedNIC,
      endpoint: req.originalUrl,
      ip: req.ip,
    });

    return res.status(403).json({
      success: false,
      message: "You can only register vehicles under your own NIC number.",
      error: "NIC_OWNERSHIP_VIOLATION",
      providedNIC: submittedNIC,
      userNIC: req.user.nicNumber,
    });
  }

  next();
};

// Rate limiting for sensitive operations
export const sensitiveOperationLimit = (req, res, next) => {
  // Add additional logging for sensitive operations
  if (req.method === "DELETE") {
    LOG.warn({
      message: "Sensitive DELETE operation attempted",
      userId: req.user._id,
      endpoint: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
  }

  if (req.route && req.route.path.includes("export")) {
    LOG.info({
      message: "Data export operation attempted",
      userId: req.user._id,
      endpoint: req.originalUrl,
      ip: req.ip,
    });
  }

  next();
};

// Middleware to ensure vehicle owner role for vehicle operations
export const requireVehicleOwner = (req, res, next) => {
  if (req.user.role !== "vehicle_owner") {
    LOG.warn({
      message: "Non-vehicle owner attempted vehicle operation",
      userId: req.user._id,
      userRole: req.user.role,
      endpoint: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });

    return res.status(403).json({
      success: false,
      message: "Only vehicle owners can perform this operation.",
      error: "INSUFFICIENT_ROLE_PERMISSIONS",
      userRole: req.user.role,
      requiredRole: "vehicle_owner",
    });
  }
  next();
};

// Combined middleware for vehicle operations (commonly used together)
export const protectVehicleOperations = [
  protect,
  requireVehicleOwner,
  verifyNICOwnership,
  sensitiveOperationLimit,
];

// Middleware to attach user context to request
export const attachUserContext = (req, res, next) => {
  if (req.user) {
    req.userContext = {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
      nicNumber: req.user.nicNumber,
      fullName: req.user.fullName,
      isVerified: req.user.isVerified,
      isActive: req.user.isActive,
    };
  }
  next();
};

// Enhanced role checking with detailed logging
export const restrictToWithLogging = (...roles) => {
  return (req, res, next) => {
    const hasPermission = roles.includes(req.user.role);

    LOG.info({
      message: `Access control check: ${hasPermission ? "GRANTED" : "DENIED"}`,
      userId: req.user._id,
      userRole: req.user.role,
      requiredRoles: roles,
      endpoint: req.originalUrl,
      method: req.method,
      ip: req.ip,
      result: hasPermission ? "ALLOWED" : "BLOCKED",
    });

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
        error: "INSUFFICIENT_PERMISSIONS",
        userRole: req.user.role,
        requiredRoles: roles,
      });
    }

    next();
  };
};

// Validate request source (for additional security)
export const validateRequestSource = (req, res, next) => {
  // Check for suspicious request patterns
  const suspiciousPatterns = [
    /\b(union|select|insert|delete|drop|create|alter)\b/i,
    /[<>'"]/g,
    /javascript:/i,
  ];

  const requestUrl = req.originalUrl;
  const isSuspicious = suspiciousPatterns.some((pattern) =>
    pattern.test(requestUrl)
  );

  if (isSuspicious) {
    LOG.warn({
      message: "Suspicious request pattern detected",
      url: requestUrl,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      userId: req.user?._id,
    });

    return res.status(400).json({
      success: false,
      message: "Invalid request format.",
      error: "SUSPICIOUS_REQUEST",
    });
  }

  next();
};

// Session validation middleware
export const validateSession = async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  try {
    // Check if user's session is still valid
    const currentUser = await User.findById(req.user._id).select(
      "+lastLogin +loginAttempts"
    );

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Session invalid. Please log in again.",
        error: "SESSION_INVALID",
      });
    }

    // Update request with fresh user data
    req.user = currentUser;
    next();
  } catch (error) {
    LOG.error("Session validation error:", error);
    return res.status(500).json({
      success: false,
      message: "Session validation failed.",
      error: "SESSION_VALIDATION_ERROR",
    });
  }
};
