import express from "express";
import * as subscriptionController from "../controllers/subscription.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to all subscription routes
router.use(protect);

// Create a new subscription
router.post("/", subscriptionController.addSubscription);

// Get all subscriptions
router.get("/", subscriptionController.viewSubscriptions);

// Get a subscription by ID
router.get("/:id", subscriptionController.viewSubscriptionById);

// Update a subscription
router.put("/:id", subscriptionController.updateSubscription);

// Delete a subscription
router.delete("/:id", subscriptionController.deleteSubscription);

export default router;
