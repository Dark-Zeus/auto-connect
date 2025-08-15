import express from "express";
import { getAvailableVehicles, getVehicleById } from "../controllers/buyVehicle.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAvailableVehicles);
router.get("/:id", getVehicleById);

export default router;