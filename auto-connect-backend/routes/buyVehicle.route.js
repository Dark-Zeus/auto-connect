import express from "express";
import { getAvailableVehicles, getVehicleById, saveAd, getSavedAds, unsaveAd, filterVehicles, reportAd, checkIfReported } from "../controllers/buyVehicle.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAvailableVehicles);
router.get("/saved", getSavedAds);
router.get("/:id", getVehicleById);
router.post("/save", saveAd);
router.post("/unsave", unsaveAd);
router.post("/filter", filterVehicles);
router.get("/check-reported", checkIfReported);
router.post("/report", reportAd);

export default router;