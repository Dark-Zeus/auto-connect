// routes/serviceCenter.route.js - SIMPLIFIED VERSION
import express from "express";
import {
  getServiceCenters,
  getServiceCenter,
  getServiceCategories,
  getServiceCenterStats,
} from "../controllers/serviceCenter.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import mongoose from "mongoose";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Simple validation middleware for ObjectId
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid service center ID format",
      error: {
        code: "INVALID_OBJECT_ID",
        details: "The provided ID is not a valid MongoDB ObjectId",
      },
    });
  }
  next();
};

// Simplified routes
router.get("/", getServiceCenters); // GET /api/v1/service-centers
router.get("/categories", getServiceCategories); // GET /api/v1/service-centers/categories
router.get("/stats", getServiceCenterStats); // GET /api/v1/service-centers/stats
router.get("/:id", validateObjectId, getServiceCenter); // GET /api/v1/service-centers/:id

export default router;
