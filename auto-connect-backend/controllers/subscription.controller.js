import SubscriptionService from "../services/subscription.service.js";
//import SubscriptionService from "../models/subscription.model.js";
// Add a new subscription
export const addSubscription = async (req, res) => {
  try {
    // Optionally associate with user: const userId = req.user?.id || req.user?._id;
    const subscriptionData = req.body;
    // If user-specific: subscriptionData.userId = userId;
    const newSubscription = await SubscriptionService.createSubscription(subscriptionData);
    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: newSubscription,
    });
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// View all subscriptions
export const viewSubscriptions = async (req, res) => {
  try {
    // Optionally filter by user: const userId = req.user?.id || req.user?._id;
    // const subscriptions = await SubscriptionService.getSubscriptions({ userId });
    const subscriptions = await SubscriptionService.getSubscriptions();
    res.status(200).json({
      success: true,
      data: subscriptions,
      message: "Subscriptions fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// View subscription by ID
export const viewSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    // Optionally check user ownership
    const subscription = await SubscriptionService.getSubscriptionById(id);
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }
    res.status(200).json({
      success: true,
      data: subscription,
      message: "Subscription fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching subscription by ID:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update a subscription
export const updateSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    // Optionally check user ownership
    const updateData = req.body;
    const updatedSubscription = await SubscriptionService.updateSubscription(id, updateData);
    if (!updatedSubscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: updatedSubscription,
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete a subscription
export const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    // Optionally check user ownership
    const deletedSubscription = await SubscriptionService.deleteSubscription(id);
    if (!deletedSubscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
      data: deletedSubscription,
    });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
