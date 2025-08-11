import express from "express";
import { createVehicleAd, getMyVehicleAds } from "../controllers/listVehicle.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Add authentication middleware
router.use(protect);

router.post("/", createVehicleAd);

router.get("/my", getMyVehicleAds);

export default router;