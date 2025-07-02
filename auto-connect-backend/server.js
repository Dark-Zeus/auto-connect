// server.js (Updated with Authentication System)
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";

import LOG from "./configs/log.config.js";

// Security and error handling middleware
import {
  globalErrorHandler,
  handleUnhandledRoutes,
  securityMiddleware,
  requestLogger,
  corsOptions,
  generalLimiter,
  healthCheck,
} from "./middleware/error.middleware.js";

/*** Configs ***/

/* Database Connection */
import connectToDatabase from "./configs/db.config.js";
connectToDatabase();

/* Default Records */
import addDefaultRecords from "./configs/defaultRecords.config.js";
addDefaultRecords();

/* App Config */
const app = express();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Trust proxy (for rate limiting and IP detection behind reverse proxies)
app.set("trust proxy", 1);

// Global middleware stack
app.use(compression()); // Compress all responses

// CORS configuration - now using advanced CORS options
app.use(cors(corsOptions));

// Security middleware stack
app.use(...securityMiddleware);

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(
  express.json({
    limit: "10mb",
    verify: (req, res, buf) => {
      req.rawBody = buf; // Store raw body for webhook verification if needed
    },
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// Cookie parser for JWT tokens
app.use(cookieParser());

// Request logging middleware (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(requestLogger);
}

// Static file serving (for uploaded files, documentation, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/docs", express.static(path.join(__dirname, "docs")));

// Health check routes (before other routes for quick health checks)
app.get("/health", healthCheck);
app.get("/ping", (req, res) => {
  res.status(200).json({
    success: true,
    message: "pong",
    timestamp: new Date().toISOString(),
  });
});

/*** API Routes ***/
import apiV1 from "./routes/api.v1.route.js";
app.use("/api/v1", apiV1);

// Serve API documentation (fallback route)
app.get("/", (req, res) => {
  try {
    // Check if docs/index.html exists, otherwise send API info
    res.sendFile(path.join(__dirname, "docs", "index.html"), (err) => {
      if (err) {
        // If no docs file, send API information
        res.status(200).json({
          success: true,
          message: "AutoConnect Vehicle Lifecycle Management API",
          version: "1.0.0",
          environment: process.env.NODE_ENV || "development",
          endpoints: {
            health: "/health",
            api: "/api/v1",
            auth: "/api/v1/auth",
            admin: "/api/v1/admin",
          },
          documentation: "/docs",
          timestamp: new Date().toISOString(),
        });
      }
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: "AutoConnect Vehicle Lifecycle Management API",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
    });
  }
});

// Handle unhandled routes (404 handler)
app.all("*", handleUnhandledRoutes);

// Global error handling middleware (must be last)
app.use(globalErrorHandler);

/*** Server Startup and Graceful Shutdown ***/

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  LOG.error({
    message: "Uncaught exception - shutting down...",
    error: err.message,
    stack: err.stack,
  });

  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  process.exit(1);
});

// Start server
const server = app.listen(process.env.AUTO_CONNECT_PORT || 3000, () => {
  LOG.info({
    message: `🚀 AutoConnect server running on port ${
      process.env.AUTO_CONNECT_PORT || 3000
    }`,
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    pid: process.pid,
  });

  // Log important information
  console.log("\n🎉 ===================================");
  console.log("🚀 AutoConnect Server Started!");
  console.log("===================================");
  console.log(`📡 Port: ${process.env.AUTO_CONNECT_PORT || 3000}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(
    `🔗 API Base: http://localhost:${
      process.env.AUTO_CONNECT_PORT || 3000
    }/api/v1`
  );
  console.log(
    `❤️  Health Check: http://localhost:${
      process.env.AUTO_CONNECT_PORT || 3000
    }/health`
  );
  console.log(
    `📚 Documentation: http://localhost:${
      process.env.AUTO_CONNECT_PORT || 3000
    }/docs`
  );

  if (process.env.NODE_ENV === "development") {
    console.log(`\n🔐 Authentication Endpoints:`);
    console.log(`   📝 Register: POST /api/v1/auth/register`);
    console.log(`   🔑 Login: POST /api/v1/auth/login`);
    console.log(`   👤 Profile: GET /api/v1/auth/me`);
    console.log(`   🔒 Admin: /api/v1/admin/*`);
  }

  console.log("===================================\n");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  LOG.error({
    message: "Unhandled rejection - shutting down...",
    error: err.message,
    stack: err.stack,
  });

  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown on SIGTERM (production deployments)
process.on("SIGTERM", () => {
  LOG.info({
    message: "SIGTERM received. Starting graceful shutdown...",
    timestamp: new Date().toISOString(),
  });

  console.log("👋 SIGTERM received. Starting graceful shutdown...");

  server.close(() => {
    LOG.info({
      message: "Process terminated gracefully",
      timestamp: new Date().toISOString(),
    });

    console.log("✅ Server closed. Process terminated!");
  });
});

// Graceful shutdown on SIGINT (Ctrl+C)
process.on("SIGINT", () => {
  LOG.info({
    message: "SIGINT received. Starting graceful shutdown...",
    timestamp: new Date().toISOString(),
  });

  console.log("\n👋 SIGINT received. Starting graceful shutdown...");

  server.close(() => {
    LOG.info({
      message: "Process terminated gracefully",
      timestamp: new Date().toISOString(),
    });

    console.log("✅ Server closed. Process terminated!");
    process.exit(0);
  });
});

// Handle server errors
server.on("error", (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      LOG.error({
        message: `${bind} requires elevated privileges`,
        error: error.message,
      });
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      LOG.error({
        message: `${bind} is already in use`,
        error: error.message,
      });
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Export app for testing
export default app;

// Log memory usage periodically in development
if (process.env.NODE_ENV === "development") {
  setInterval(() => {
    const memoryUsage = process.memoryUsage();
    const memoryInfo = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024) + " MB",
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024) + " MB",
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024) + " MB",
      external: Math.round(memoryUsage.external / 1024 / 1024) + " MB",
    };

    LOG.debug({
      message: "Memory usage report",
      memory: memoryInfo,
      uptime: Math.round(process.uptime()) + "s",
    });
  }, 60000); // Every minute
}
