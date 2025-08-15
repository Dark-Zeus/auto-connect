import express from "express";
import { getAvailableVehicles } from "../controllers/buyVehicle.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getAvailableVehicles);

export default router;