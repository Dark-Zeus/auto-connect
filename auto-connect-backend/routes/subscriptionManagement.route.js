import express from "express";
import { getMyActivePlan, requestCancelAtPeriodEnd } from "../controllers/subscriptionManagement.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getMyActivePlan);
router.post("/cancel", protect, requestCancelAtPeriodEnd);

export default router;