// routes/addedVehicle.route.js - UPDATED TO USE REAL CONTROLLER
import express from "express";
import {
  addVehicle,
  getAddedVehicles,
  getAddedVehicleStats,
  getAddedVehicleById,
  updateAddedVehicle,
  deleteAddedVehicle,
  markVehicleCompleted,
  exportAddedVehicles,
  updateVehicleStatus,
  bulkUpdateStatus,
  bulkDeleteVehicles,
  getVehicleHistory,
  getAddedVehiclesByOwnerNIC,
} from "../../../controllers/addedVehicles.controller.js";

import { protect } from "../../../middleware/auth.middleware.js";

const router = express.Router();

// Test route without authentication (keep for debugging)
router.get("/test-no-auth", (req, res) => {
  console.log("🎯 Test route (no auth) hit!");
  res.json({
    success: true,
    message: "Route is working without authentication!",
    timestamp: new Date().toISOString(),
  });
});

// Apply authentication to all other routes
router.use(protect);

// Statistics route - MUST come before /:id routes
router.get("/stats", getAddedVehicleStats);

// Export route - MUST come before /:id routes
router.get("/export", exportAddedVehicles);

// Owner-specific routes - MUST come before /:id routes
router.get("/owner/:nicNumber", getAddedVehiclesByOwnerNIC);

// Main CRUD routes
router
  .route("/")
  .get(getAddedVehicles) // GET /api/v1/added-vehicles - Get user's added vehicles
  .post(addVehicle); // POST /api/v1/added-vehicles - Add a vehicle

// Individual vehicle operations
router
  .route("/:id")
  .get(getAddedVehicleById) // GET /api/v1/added-vehicles/:id
  .patch(updateAddedVehicle) // PATCH /api/v1/added-vehicles/:id
  .delete(deleteAddedVehicle); // DELETE /api/v1/added-vehicles/:id

// Status and completion operations
router.patch("/:id/complete", markVehicleCompleted); // PATCH /api/v1/added-vehicles/:id/complete
router.patch("/:id/status", updateVehicleStatus); // PATCH /api/v1/added-vehicles/:id/status

// Bulk operations
router.patch("/bulk/status", bulkUpdateStatus); // PATCH /api/v1/added-vehicles/bulk/status
router.delete("/bulk/delete", bulkDeleteVehicles); // DELETE /api/v1/added-vehicles/bulk/delete

// History and tracking
router.get("/:id/history", getVehicleHistory); // GET /api/v1/added-vehicles/:id/history

export default router;
