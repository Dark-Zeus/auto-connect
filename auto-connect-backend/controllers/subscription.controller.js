import SubscriptionService from "../services/subscription.service.js";
import LOG from "../configs/log.config.js";

// Add a new subscription
export const addSubscription = async (req, res) => {
  try {
    const subscriptionData = req.body;
    const newSubscription = await SubscriptionService.createSubscription(subscriptionData);

    LOG.info({ subscriptionId: newSubscription._id }, "Subscription created successfully");

    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      data: newSubscription,
    });
  } catch (error) {
    LOG.error({ err: error }, "Error creating subscription");
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// View all subscriptions
export const viewSubscriptions = async (req, res) => {
  try {
    const subscriptions = await SubscriptionService.getSubscriptions();

    LOG.info({ count: subscriptions.length }, "Subscriptions fetched successfully");

    res.status(200).json({
      success: true,
      data: subscriptions,
      message: "Subscriptions fetched successfully",
    });
  } catch (error) {
    LOG.error({ err: error }, "Error fetching subscriptions");
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
    const subscription = await SubscriptionService.getSubscriptionById(id);

    if (!subscription) {
      LOG.warn({ id }, "Subscription not found");
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    LOG.info({ id }, "Subscription fetched successfully");

    res.status(200).json({
      success: true,
      data: subscription,
      message: "Subscription fetched successfully",
    });
  } catch (error) {
    LOG.error({ err: error, id: req.params.id }, "Error fetching subscription by ID");
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
    const updateData = req.body;
    const updatedSubscription = await SubscriptionService.updateSubscription(id, updateData);

    if (!updatedSubscription) {
      LOG.warn({ id }, "Subscription not found for update");
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    LOG.info({ id }, "Subscription updated successfully");

    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      data: updatedSubscription,
    });
  } catch (error) {
    LOG.error({ err: error, id: req.params.id }, "Error updating subscription");
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
    const deletedSubscription = await SubscriptionService.deleteSubscription(id);

    if (!deletedSubscription) {
      LOG.warn({ id }, "Subscription not found for deletion");
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    LOG.info({ id }, "Subscription deleted successfully");

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
      data: deletedSubscription,
    });
  } catch (error) {
    LOG.error({ err: error, id: req.params.id }, "Error deleting subscription");
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
