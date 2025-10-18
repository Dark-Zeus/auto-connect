// routes/api.v1.route.js (Updated with Vehicle Routes)
import express from "express";

const router = express.Router({ mergeParams: true });

/* Route Imports */
import healthRoute from "./health.route.js";
import authRoute from "./auth.route.js";
import adminRoute from "./admin.route.js";
import vehicleRoute from "./vehicle.route.js";
import addedVehicleRoute from "./addedVehicle.route.js";
import listVehicleRoute from "./listVehicle.route.js";
import subscriptionRoute from "./subscription.route.js";
import notificationRoute from "./notificationRoute.route.js";
import contactRoute from "./contactRequest.routes.js";

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

// Added Vehicle routes - NEW
router.use("/added-vehicles", generalLimiter, addedVehicleRoute);

router.use("/list-vehicles", generalLimiter, listVehicleRoute);

// Subscription routes
router.use("/subscriptions", generalLimiter, subscriptionRoute);

// Notification routes
router.use("/notifications", generalLimiter, notificationRoute);

// Contact Request routes
router.use("/usercontacts", generalLimiter, contactRoute);

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
      addedVehicles: {
        description: "Added vehicles management (service bookings, etc.)",
        routes: [
          "GET /added-vehicles - List user's added vehicles",
          "POST /added-vehicles - Add a vehicle for service/booking",
          "GET /added-vehicles/stats - Added vehicles statistics",
          "GET /added-vehicles/export - Export added vehicles data",
          "GET /added-vehicles/owner/:nicNumber - Get by owner NIC",
          "GET /added-vehicles/:id - Get added vehicle details",
          "PATCH /added-vehicles/:id - Update added vehicle",
          "DELETE /added-vehicles/:id - Remove added vehicle",
          "PATCH /added-vehicles/:id/complete - Mark as completed",
        ],
      },

      subscriptions: {
        description: "Subscription management for users",
        routes: [
          "GET /subscriptions - List all subscriptions",
          "POST /subscriptions - Create a new subscription",
          "GET /subscriptions/:id - Get subscription details",
          "PUT /subscriptions/:id - Update subscription",
          "DELETE /subscriptions/:id - Delete subscription",
        ],
      },

      notifications: {
        description: "Notification management for admins",
        routes: [
          "GET /notifications - List all sent notifications (for Sent Notifications table)",
          "POST /notifications/ - Create a new notification"
        ],
      },

      usercontacts: {
        description: "Contact request management",
        routes: [
          "POST /usercontacts/ - Create new contact request",
          "GET /usercontacts/ - Get all contact requests",
          "PUT /usercontacts/:id - Update contact request (status or reply)",
          "DELETE /usercontacts/:id - Delete contact request",
          "PUT /usercontacts/:id/reply - Reply to contact request and mark as resolved"
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
