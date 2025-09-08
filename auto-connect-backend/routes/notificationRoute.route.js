import express from "express";
import { addNotification,viewNotifications } from "../controllers/notifications.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect all notification routes
router.use(protect);

// Create a new notification
router.post("/", addNotification);

// Get all notifications for the authenticated user
router.get("/", viewNotifications);

export default router;