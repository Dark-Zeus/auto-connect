// services/subscription.service.js
import Subscription from "../models/subscription.model.js";

class SubscriptionService {
  static async createSubscription(data) {
    const subscription = new Subscription(data);
    return subscription.save();
  }

  static async getSubscriptions(filter = {}) {
    return Subscription.find(filter);
  }

  static async getSubscriptionById(id) {
    return Subscription.findById(id);
  }

  static async updateSubscription(id, data) {
    return Subscription.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteSubscription(id) {
    return Subscription.findByIdAndDelete(id);
  }
}

export default SubscriptionService;
