// routes/serviceCenter.route.js
import express from "express";
import {
  getServiceCenters,
  getServiceCenter,
  getServiceCategories,
  getServiceCenterStats,
} from "../controllers/serviceCenter.controller.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";
import { validate } from "../utils/validation.util.js";
import Joi from "joi";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Validation schemas
const getServiceCentersValidation = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(50).optional(),
  search: Joi.string().max(100).optional(),
  serviceCategory: Joi.string().max(50).optional(),
  location: Joi.string().max(50).optional(),
  sortBy: Joi.string()
    .valid("rating", "reviews", "name", "location", "newest")
    .optional(),
});

const getServiceCenterValidation = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    "string.hex": "Invalid service center ID format",
    "string.length": "Invalid service center ID length",
    "any.required": "Service center ID is required",
  }),
});

// Routes accessible by vehicle owners
router.get(
  "/",
  restrictTo("vehicle_owner"), // Only vehicle owners can access
  validate(getServiceCentersValidation, "query"),
  getServiceCenters
);

router.get(
  "/categories",
  restrictTo("vehicle_owner"), // Only vehicle owners can access
  getServiceCategories
);

router.get(
  "/stats",
  restrictTo("vehicle_owner", "system_admin"), // Vehicle owners and admins
  getServiceCenterStats
);

router.get(
  "/:id",
  restrictTo("vehicle_owner"), // Only vehicle owners can access
  validate(getServiceCenterValidation, "params"),
  getServiceCenter
);

export default router;
