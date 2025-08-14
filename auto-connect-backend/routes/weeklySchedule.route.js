// routes/weeklySchedule.route.js
import express from "express";
import {
  getMyWeeklySchedule,
  updateWeeklySchedule,
  getAvailableSlots,
  blockDate,
  unblockDate,
  getScheduleStats,
} from "../controllers/weeklySchedule.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Routes for service centers only
router.get("/my-schedule", getMyWeeklySchedule);
router.put("/my-schedule", updateWeeklySchedule);
router.post("/block-date", blockDate);
router.delete("/unblock-date/:date", unblockDate);
router.get("/stats", getScheduleStats);

// Public route for getting available slots (can be accessed by vehicle owners)
router.get("/available-slots", getAvailableSlots);

export default router;
