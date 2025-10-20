// routes/api.v1/reviews/reviews.route.js
import express from "express";
import { protect } from "../../../middleware/auth.middleware.js";
import reviewsController from "../../../controllers/reviews.controller.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get service center reviews (service_center role only)
router.get("/my-reviews", reviewsController.getServiceCenterReviews);

export default router;
