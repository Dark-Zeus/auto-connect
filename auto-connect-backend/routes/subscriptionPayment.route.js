import express from "express";
import {
  createSubscriptionCheckoutSession,
  confirmSubscriptionPayment,
} from "../controllers/subscriptionPayment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create-session", protect, createSubscriptionCheckoutSession);
router.post("/confirm", protect, confirmSubscriptionPayment);

export default router;