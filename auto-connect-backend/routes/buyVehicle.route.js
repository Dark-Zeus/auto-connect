import express from "express";
import { getAvailableVehicles, getVehicleById, saveAd, getSavedAds, unsaveAd, filterVehicles, reportAd, checkIfReported, incrementVehicleViews } from "../controllers/buyVehicle.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAvailableVehicles);
router.get("/saved", getSavedAds);
router.get("/check-reported", checkIfReported);
router.get("/:id", getVehicleById);
router.post("/save", saveAd);
router.post("/unsave", unsaveAd);
router.post("/filter", filterVehicles);
router.post("/report", reportAd);
router.post("/:id/increment-views", incrementVehicleViews);

export default router;