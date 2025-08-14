const express = require("express");
const router = express.Router();
const subscriptionController = require("../controllers/subscription.controller");

// Create
router.post("/", subscriptionController.addSubscription);

// Read all
router.get("/", subscriptionController.viewSubscriptions);

// Read one
router.get("/:id", subscriptionController.viewSubscriptionById);

// Update
router.put("/:id", subscriptionController.updateSubscription);

// Delete
router.delete("/:id", subscriptionController.deleteSubscription);

module.exports = router;
