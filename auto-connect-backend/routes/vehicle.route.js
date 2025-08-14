// routes/vehicle.route.js (Simple version - use this to replace your current file)
import express from "express";
import {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
  getVehicleStats,
  exportVehicles,
  getVehiclesByOwnerNIC,
  verifyVehicle,
  rejectVehicle,
  getUserVehiclesForBooking,
} from "../controllers/vehicle.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

// All vehicle routes require authentication
router.use(protect);

// Public vehicle routes (authenticated users)
router
  .route("/")
  .get(getVehicles) // GET /api/v1/vehicles - This is what your frontend calls
  .post(createVehicle); // Simplified without file upload for now

// Vehicle statistics and export
router.get("/stats", getVehicleStats); // GET /api/v1/vehicles/stats
router.get("/export", exportVehicles); // GET /api/v1/vehicles/export

// Get user's vehicles for booking (must be before /:id route)
router.get(
  "/my-vehicles",
  restrictTo("vehicle_owner"),
  getUserVehiclesForBooking
);

// Get vehicles by owner NIC - IMPORTANT FOR YOUR USE CASE
router.get("/owner/:nicNumber", getVehiclesByOwnerNIC); // GET /api/v1/vehicles/owner/123456789V

// Individual vehicle operations
router.route("/:id").get(getVehicle).patch(updateVehicle).delete(deleteVehicle);

// Admin-only routes for verification (commented out for now)
// router.use(restrictTo("admin", "vehicle_verifier"));
// router.patch("/:id/verify", verifyVehicle);
// router.patch("/:id/reject", rejectVehicle);

export default router;
