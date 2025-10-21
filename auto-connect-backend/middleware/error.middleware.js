// middleware/error.middleware.js
import LOG from "../configs/log.config.js";
import { AppError } from "../utils/appError.util.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";

// Handle cast errors (invalid MongoDB ObjectId)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handle duplicate field errors
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `${
    field.charAt(0).toUpperCase() + field.slice(1)
  } '${value}' already exists. Please use a different ${field}.`;
  return new AppError(message, 400);
};

// Handle validation errors
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// Handle JWT errors
const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

// Handle JWT expired error
const handleJWTExpiredError = () =>
  new AppError("Your token has expired! Please log in again.", 401);

// Send error for development
const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      success: false,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // RENDERED WEBSITE
  console.error("ERROR 💥", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

// Send error for production
const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith("/api")) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }

    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    LOG.error({
      message: "Unexpected error occurred",
      error: err.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get("user-agent"),
      userId: req.user?._id,
    });

    // 2) Send generic message
    return res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }

  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error("ERROR 💥", err);

  // 2) Send generic message
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later.",
  });
};

// Global error handling middleware
export const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

// Handle unhandled routes
export const handleUnhandledRoutes = (req, res, next) => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(err);
};

// Rate limiting middleware
export const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      LOG.warn({
        message: "Rate limit exceeded",
        ip: req.ip,
        userAgent: req.get("user-agent"),
        endpoint: req.originalUrl,
        method: req.method,
      });

      res.status(429).json({
        success: false,
        message,
      });
    },
  });
};

// Specific rate limiters
export const authLimiter = createRateLimit(
  1 * 60 * 1000, // 1 minutes
  5, // limit each IP to 5 requests per windowMs
  "Too many authentication attempts, please try again later."
);

export const generalLimiter = createRateLimit(
  1 * 60 * 1000, // 1 minutes
  100, // limit each IP to 100 requests per windowMs
  "Too many requests, please try again later."
);

export const passwordResetLimiter = createRateLimit(
  6 * 60 * 1000, // 1 min
  3, // limit each IP to 3 password reset requests per hour
  "Too many password reset attempts, please try again later."
);

// Security middleware
export const securityMiddleware = [
  // Set security HTTP headers
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        scriptSrc: ["'self'", "https:"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),

  // Data sanitization against NoSQL query injection
  mongoSanitize(),

  // Data sanitization against XSS
  xss(),

  // Prevent parameter pollution
  hpp({
    whitelist: [
      "sort",
      "fields",
      "page",
      "limit",
      "role",
      "isVerified",
      "isActive",
    ],
  }),
];

// Request logging middleware
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log request
  LOG.info({
    message: "Incoming request",
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    userId: req.user?._id,
    userEmail: req.user?.email,
    timestamp: new Date().toISOString(),
  });

  // Log response
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;

    LOG.info({
      message: "Request completed",
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: req.user?._id,
      timestamp: new Date().toISOString(),
    });

    originalSend.call(this, data);
  };

  next();
};

// CORS configuration
export const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.AUTO_CONNECT_FRONTEND_URL || "http://localhost:3001",
      "http://localhost:3000",
      "http://localhost:3001",
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      LOG.warn({
        message: "CORS policy violation",
        origin,
        allowedOrigins,
      });
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["X-Total-Count"],
};

// Health check middleware
export const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
};
