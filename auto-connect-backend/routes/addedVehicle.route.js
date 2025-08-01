// backend/routes/addedVehicles.route.js (Updated to match controller exports)
import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  addVehicle,
  getAddedVehicles,
  getAddedVehicleById, // Changed from getAddedVehicle
  updateAddedVehicle,
  deleteAddedVehicle,
  updateVehicleStatus,
  markVehicleCompleted,
  getAddedVehicleStats,
  exportAddedVehicles,
  bulkUpdateStatus,
  bulkDeleteVehicles,
  getVehicleHistory,
  getAddedVehiclesByOwnerNIC,
} from "../controllers/addedVehicles.controller.js"; // Make sure this matches your actual file name

const router = express.Router();

// Protect all routes (require authentication)
router.use(protect);

// Main CRUD routes
router.post("/", addVehicle); // POST /api/v1/added-vehicles
router.get("/", getAddedVehicles); // GET /api/v1/added-vehicles
router.get("/stats", getAddedVehicleStats); // GET /api/v1/added-vehicles/stats
router.get("/export", exportAddedVehicles); // GET /api/v1/added-vehicles/export
router.get("/owner/:nicNumber", getAddedVehiclesByOwnerNIC); // GET /api/v1/added-vehicles/owner/:nicNumber

// Bulk operations
router.patch("/bulk/status", bulkUpdateStatus); // PATCH /api/v1/added-vehicles/bulk/status
router.delete("/bulk/delete", bulkDeleteVehicles); // DELETE /api/v1/added-vehicles/bulk/delete

// Individual vehicle routes
router.get("/:id", getAddedVehicleById); // GET /api/v1/added-vehicles/:id
router.put("/:id", updateAddedVehicle); // PUT /api/v1/added-vehicles/:id
router.delete("/:id", deleteAddedVehicle); // DELETE /api/v1/added-vehicles/:id
router.patch("/:id/status", updateVehicleStatus); // PATCH /api/v1/added-vehicles/:id/status
router.patch("/:id/complete", markVehicleCompleted); // PATCH /api/v1/added-vehicles/:id/complete
router.get("/:id/history", getVehicleHistory); // GET /api/v1/added-vehicles/:id/history

export default router;
