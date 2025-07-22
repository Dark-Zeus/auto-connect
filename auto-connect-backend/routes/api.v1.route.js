// routes/api.v1.route.js (Updated with Vehicle Routes)
import express from "express";

const router = express.Router({ mergeParams: true });

/* Route Imports */
import healthRoute from "./health.route.js";
import authRoute from "./auth.route.js";
import adminRoute from "./admin.route.js";
import vehicleRoute from "./vehicle.route.js";

// Import rate limiters for specific routes
import {
  authLimiter,
  passwordResetLimiter,
  generalLimiter,
} from "../middleware/error.middleware.js";

/* Routes */
router.use("/", healthRoute);

// Authentication routes with specific rate limiting
router.use("/auth/login", authLimiter);
router.use("/auth/register", authLimiter);
router.use("/auth/forgot-password", passwordResetLimiter);
router.use("/auth/reset-password", passwordResetLimiter);
router.use("/auth", authRoute);

// Admin routes
router.use("/admin", adminRoute);

// Vehicle routes - Protected and rate limited
router.use("/vehicles", generalLimiter, vehicleRoute);

// API Documentation route
router.get("/docs", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AutoConnect API Documentation",
    version: "1.0.0",
    endpoints: {
      health: {
        description: "Health check endpoints",
        routes: ["/health", "/ping"],
      },
      auth: {
        description: "Authentication and user management",
        routes: [
          "/auth/login",
          "/auth/register",
          "/auth/logout",
          "/auth/profile",
        ],
      },
      vehicles: {
        description: "Vehicle management for vehicle owners",
        routes: [
          "GET /vehicles - List user vehicles",
          "POST /vehicles - Create new vehicle",
          "GET /vehicles/stats - Vehicle statistics",
          "GET /vehicles/export - Export vehicle data",
          "GET /vehicles/:id - Get vehicle details",
          "PATCH /vehicles/:id - Update vehicle",
          "DELETE /vehicles/:id - Delete vehicle",
        ],
      },
      admin: {
        description: "Administrative functions",
        routes: ["/admin/*"],
      },
    },
    documentation: "Visit /api/v1/docs for full API documentation",
  });
});

export default router;
