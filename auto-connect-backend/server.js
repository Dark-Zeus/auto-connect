import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";

dotenv.config();

import LOG from "./configs/log.config.js";
import { generalRateLimit } from "./middleware/rateLimiting.middleware.js";

/*** Configs ***/

/* Database Connection */
import connectToDatabase from "./configs/db.config.js";
connectToDatabase();

/* Default Records */
import addDefaultRecords from "./configs/defaultRecords.config.js";
addDefaultRecords();

/* App Config */
const app = express();
const PORT = process.env.AUTO_CONNECT_PORT || 3000;

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        process.env.AUTO_CONNECT_FRONTEND_URL || "http://localhost:3001",
        "http://localhost:3001",
        "http://localhost:3000",
      ];

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// Request logging middleware
app.use(
  pinoHttp({
    logger: LOG,
    customLogLevel: function (req, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return "warn";
      } else if (res.statusCode >= 500) {
        return "error";
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        return "silent";
      }
      return "info";
    },
    customSuccessMessage: function (req, res) {
      if (res.statusCode === 404) {
        return "resource not found";
      }
      return `${req.method} ${req.url} completed`;
    },
    customErrorMessage: function (req, res, err) {
      return `${req.method} ${req.url} failed: ${err.message}`;
    },
    customAttributeKeys: {
      req: "request",
      res: "response",
      err: "error",
      responseTime: "responseTimeMs",
    },
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        headers: {
          host: req.headers.host,
          userAgent: req.headers["user-agent"],
          referer: req.headers.referer,
        },
        remoteAddress: req.remoteAddress,
        remotePort: req.remotePort,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
        headers: {
          contentType: res.get("content-type"),
          contentLength: res.get("content-length"),
        },
      }),
    },
  })
);

// Apply general rate limiting
app.use(generalRateLimit);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Trust proxy (important for rate limiting and logging)
app.set("trust proxy", 1);

/*** Routes ***/
import apiV1 from "./routes/api.v1.route.js";

// API routes
app.use("/api/v1", apiV1);

// Health check route (before catch-all)
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API Documentation route
app.use("/", (req, res, next) => {
  if (req.path === "/" || req.path === "/docs") {
    // Serve API documentation
    res.json({
      message: "AutoConnect API",
      version: "1.0.0",
      documentation: {
        Authentication: {
          "POST /api/v1/auth/register": "Register a new user",
          "POST /api/v1/auth/login": "Login user",
          "POST /api/v1/auth/refresh-token": "Refresh access token",
          "POST /api/v1/auth/logout": "Logout user",
          "POST /api/v1/auth/logout-all": "Logout from all devices",
          "GET /api/v1/auth/verify-email/:token": "Verify email address",
          "POST /api/v1/auth/resend-verification": "Resend email verification",
          "POST /api/v1/auth/request-password-reset": "Request password reset",
          "POST /api/v1/auth/reset-password": "Reset password using token",
          "POST /api/v1/auth/change-password": "Change password",
          "GET /api/v1/auth/profile": "Get user profile",
          "PUT /api/v1/auth/profile": "Update user profile",
        },
        Health: {
          "GET /api/v1/q/health": "API health check",
          "GET /health": "Server health check",
        },
      },
      "User Roles": [
        "vehicle_owner",
        "service_provider",
        "insurance_company",
        "admin",
      ],
    });
  } else {
    next();
  }
});

// 404 handler
app.use("*", (req, res) => {
  LOG.warn("Route not found", {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  res.status(404).json({
    success: false,
    message: "Route not found",
    requestedPath: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler
app.use((error, req, res, next) => {
  LOG.error("Unhandled error", {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  // Handle specific error types
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
    });
  }

  if (error.type === "entity.too.large") {
    return res.status(413).json({
      success: false,
      message: "Request payload too large",
    });
  }

  // CORS error
  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS policy violation",
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
    timestamp: new Date().toISOString(),
  });
});

// Graceful shutdown handlers
process.on("SIGTERM", () => {
  LOG.info("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  LOG.info("SIGINT received, shutting down gracefully");
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  LOG.error("Uncaught Exception", {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  LOG.error("Unhandled Rejection", {
    reason: reason,
    promise: promise,
  });
  process.exit(1);
});

// Start server
app.listen(PORT, () => {
  LOG.info(`Server running on port: ${PORT}`, {
    environment: process.env.NODE_ENV || "development",
    nodeVersion: process.version,
    platform: process.platform,
  });
});

export default app;
