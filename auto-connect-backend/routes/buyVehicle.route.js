import express from "express";
import { getAvailableVehicles, getVehicleById, saveAd, getSavedAds } from "../controllers/buyVehicle.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAvailableVehicles);
router.get("/saved", getSavedAds);
router.get("/:id", getVehicleById);
router.post("/save", saveAd);

export default router;