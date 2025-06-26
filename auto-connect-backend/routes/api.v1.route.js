import express from "express";

const router = express.Router({ mergeParams: true });

/* Route Imports */
import healthRoute from "./health.route.js";
import authRoute from "./auth.route.js";

/* Routes */

// Health check routes
router.use("/", healthRoute);

// Authentication routes
router.use("/auth", authRoute);

// Future routes will be added here:
// router.use("/users", userRoute);
// router.use("/vehicles", vehicleRoute);
// router.use("/services", serviceRoute);
// router.use("/insurance", insuranceRoute);
// router.use("/marketplace", marketplaceRoute);

export default router;
