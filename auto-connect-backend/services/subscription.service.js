const Subscription = require("../models/subscription.model");

class SubscriptionService {
  static async createSubscription(data) {
    return await Subscription.create(data);
  }

  static async getSubscriptions() {
    return await Subscription.find();
  }

  static async getSubscriptionById(id) {
    return await Subscription.findById(id);
  }

  static async updateSubscription(id, data) {
    return await Subscription.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteSubscription(id) {
    return await Subscription.findByIdAndDelete(id);
  }
}

module.exports = SubscriptionService;
