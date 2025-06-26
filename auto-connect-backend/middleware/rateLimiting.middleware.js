import rateLimit from "express-rate-limit";
import LOG from "../configs/log.config.js";

// General rate limiting for all routes
export const generalRateLimit = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
    retryAfter: Math.ceil(
      (parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000
    ),
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    LOG.security.rateLimitHit(req.ip, req.originalUrl, {
      userAgent: req.get("user-agent"),
      method: req.method,
    });

    res.status(429).json({
      success: false,
      message: "Too many requests from this IP, please try again later.",
      retryAfter: Math.ceil(
        (parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000
      ),
    });
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === "/api/v1/q/health";
  },
});

// Strict rate limiting for authentication routes
export const authRateLimit = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 5, // limit each IP to 5 auth attempts per windowMs
  message: {
    success: false,
    message:
      "Too many authentication attempts from this IP, please try again later.",
    retryAfter: Math.ceil(
      (parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) / 1000
    ),
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    LOG.security.rateLimitHit(req.ip, req.originalUrl, {
      userAgent: req.get("user-agent"),
      method: req.method,
      severity: "high",
    });

    res.status(429).json({
      success: false,
      message:
        "Too many authentication attempts from this IP, please try again later.",
      retryAfter: Math.ceil(
        (parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000) /
          1000
      ),
    });
  },
});

// Rate limiting for password reset requests
export const passwordResetRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 password reset requests per hour
  message: {
    success: false,
    message:
      "Too many password reset requests from this IP, please try again later.",
    retryAfter: 3600, // 1 hour in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    LOG.security.rateLimitHit(req.ip, req.originalUrl, {
      userAgent: req.get("user-agent"),
      method: req.method,
      type: "password_reset",
      severity: "medium",
    });

    res.status(429).json({
      success: false,
      message:
        "Too many password reset requests from this IP, please try again later.",
      retryAfter: 3600,
    });
  },
});

// Rate limiting for email verification requests
export const emailVerificationRateLimit = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // limit each IP to 3 verification requests per 10 minutes
  message: {
    success: false,
    message:
      "Too many email verification requests from this IP, please try again later.",
    retryAfter: 600, // 10 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    LOG.security.rateLimitHit(req.ip, req.originalUrl, {
      userAgent: req.get("user-agent"),
      method: req.method,
      type: "email_verification",
      severity: "medium",
    });

    res.status(429).json({
      success: false,
      message:
        "Too many email verification requests from this IP, please try again later.",
      retryAfter: 600,
    });
  },
});

// Dynamic rate limiting based on user role (for authenticated routes)
export const createDynamicRateLimit = (baseMax = 100) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: (req) => {
      // Increase limits for admin users
      if (req.user && req.user.role === "admin") {
        return baseMax * 3;
      }
      // Increase limits for verified users
      if (req.user && req.user.isVerified) {
        return baseMax * 2;
      }
      // Default limit for unverified or unauthenticated users
      return baseMax;
    },
    keyGenerator: (req) => {
      // Use user ID for authenticated users, IP for unauthenticated
      return req.user ? req.user._id.toString() : req.ip;
    },
    message: {
      success: false,
      message: "Rate limit exceeded for your account, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      const identifier = req.user ? req.user._id.toString() : req.ip;
      LOG.security.rateLimitHit(identifier, req.originalUrl, {
        userId: req.user?._id,
        userRole: req.user?.role,
        userAgent: req.get("user-agent"),
        method: req.method,
        type: "dynamic",
      });

      res.status(429).json({
        success: false,
        message:
          "Rate limit exceeded for your account, please try again later.",
      });
    },
  });
};

// Rate limiting for file uploads
export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // limit each IP to 20 file uploads per hour
  message: {
    success: false,
    message: "Too many file uploads from this IP, please try again later.",
    retryAfter: 3600,
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    LOG.security.rateLimitHit(req.ip, req.originalUrl, {
      userAgent: req.get("user-agent"),
      method: req.method,
      type: "file_upload",
      severity: "medium",
    });

    res.status(429).json({
      success: false,
      message: "Too many file uploads from this IP, please try again later.",
      retryAfter: 3600,
    });
  },
});
