// routes/api.v1.route.js (Updated)
import express from "express";

const router = express.Router({ mergeParams: true });

/* Route Imports */
import healthRoute from "./health.route.js";
import authRoute from "./auth.route.js";
import adminRoute from "./admin.route.js";

// Import rate limiters for specific routes
import {
  authLimiter,
  passwordResetLimiter,
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

export default router;
