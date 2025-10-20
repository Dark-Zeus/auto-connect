// routes/servicePayment.route.js
import express from "express";
import {
  createServicePaymentSession,
  verifyServicePayment,
  getPaymentByBooking,
  getUserPayments,
  getPaymentStats,
  handleStripeWebhook,
} from "../controllers/servicePayment.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Webhook endpoint (must be before protect middleware)
// Stripe sends raw body, so this should be handled specially
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Protected routes (require authentication)
router.use(protect);

// Create payment session for a completed service
router.post("/create-session", createServicePaymentSession);

// Verify payment after Stripe checkout
router.get("/verify", verifyServicePayment);

// Get payment by booking ID
router.get("/booking/:bookingId", getPaymentByBooking);

// Get all payments for current user
router.get("/", getUserPayments);

// Get payment statistics
router.get("/stats", getPaymentStats);

export default router;
