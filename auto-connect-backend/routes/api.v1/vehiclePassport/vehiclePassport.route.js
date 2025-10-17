// routes/api.v1/vehiclePassport/vehiclePassport.route.js
import express from "express";
import {
  getVehiclePassport,
  getPassportVehicles
} from "../../../controllers/vehiclePassport.controller.js";
import { protect, restrictTo } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../utils/validation.util.js";
import Joi from "joi";

const router = express.Router();

// All routes require authentication and vehicle owner role
router.use(protect);
router.use(restrictTo("vehicle_owner"));

// Validation schemas
const vehicleIdValidation = Joi.object({
  vehicleId: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required().messages({
    'string.pattern.base': 'Vehicle ID must be a valid MongoDB ObjectId'
  })
});

// Routes

// Get all vehicles for passport selection
router.get(
  "/vehicles",
  getPassportVehicles
);

// Get complete vehicle passport data for a specific vehicle
router.get(
  "/vehicles/:vehicleId",
  validate(vehicleIdValidation, "params"),
  getVehiclePassport
);

export default router;