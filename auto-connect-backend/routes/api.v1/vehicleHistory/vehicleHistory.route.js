// routes/api.v1/vehicleHistory/vehicleHistory.route.js
import express from "express";
import {
  getDashboardStats,
  getRecentServices,
  getTopVehicles,
  getPerformanceAnalytics
} from "../../../controllers/vehicleHistory.controller.js";
import { protect, restrictTo } from "../../../middleware/auth.middleware.js";
import { validate } from "../../../utils/validation.util.js";
import Joi from "joi";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Validation schemas
const timeRangeValidation = Joi.object({
  timeRange: Joi.string().valid("7days", "30days", "90days", "1year").optional().default("30days")
});

const paginationValidation = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  status: Joi.string().valid("all", "pending", "confirmed", "in-progress", "completed", "cancelled", "rejected").optional().default("all")
});

const vehicleLimitValidation = Joi.object({
  limit: Joi.number().integer().min(1).max(50).optional().default(10)
});

// Routes (All routes are restricted to service centers only)

// Get dashboard statistics
router.get(
  "/dashboard-stats",
  restrictTo("service_center"),
  validate(timeRangeValidation, "query"),
  getDashboardStats
);

// Get recent services with pagination
const recentServicesValidation = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10),
  status: Joi.string().valid("all", "pending", "confirmed", "in-progress", "completed", "cancelled", "rejected").optional().default("all"),
  timeRange: Joi.string().valid("7days", "30days", "90days", "1year").optional().default("30days")
});

router.get(
  "/recent-services",
  restrictTo("service_center"),
  validate(recentServicesValidation, "query"),
  getRecentServices
);

// Get top vehicles by service history
router.get(
  "/top-vehicles",
  restrictTo("service_center"),
  validate(vehicleLimitValidation, "query"),
  getTopVehicles
);

// Get performance analytics
router.get(
  "/analytics",
  restrictTo("service_center"),
  validate(timeRangeValidation, "query"),
  getPerformanceAnalytics
);

export default router;