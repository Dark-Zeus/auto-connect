// routes/addedVehicle.route.js
import express from "express";
import {
  addVehicle,
  getAddedVehicles,
  getAddedVehiclesByOwnerNIC,
  getAddedVehicle,
  updateAddedVehicle,
  deleteAddedVehicle,
  markCompleted,
  getAddedVehicleStats,
  exportAddedVehicles,
} from "../controllers/addedVehicle.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Public routes (authenticated users)
router
  .route("/")
  .get(getAddedVehicles) // GET /api/v1/added-vehicles - Get user's added vehicles
  .post(addVehicle); // POST /api/v1/added-vehicles - Add a vehicle

// Statistics and export
router.get("/stats", getAddedVehicleStats); // GET /api/v1/added-vehicles/stats
router.get("/export", exportAddedVehicles); // GET /api/v1/added-vehicles/export

// Get added vehicles by owner NIC
router.get("/owner/:nicNumber", getAddedVehiclesByOwnerNIC); // GET /api/v1/added-vehicles/owner/123456789V

// Individual added vehicle operations
router
  .route("/:id")
  .get(getAddedVehicle) // GET /api/v1/added-vehicles/:id
  .patch(updateAddedVehicle) // PATCH /api/v1/added-vehicles/:id
  .delete(deleteAddedVehicle); // DELETE /api/v1/added-vehicles/:id

// Mark as completed
router.patch("/:id/complete", markCompleted); // PATCH /api/v1/added-vehicles/:id/complete

export default router;
