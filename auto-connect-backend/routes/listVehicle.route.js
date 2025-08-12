import express from "express";
import { createVehicleAd, getMyVehicleAds, getVehicleAdById } from "../controllers/listVehicle.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Add authentication middleware
router.use(protect);

router.post("/", createVehicleAd);

router.get("/my", getMyVehicleAds);

router.get("/:id", getVehicleAdById);

export default router;