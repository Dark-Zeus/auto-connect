import React, { useState, useEffect } from "react";
import SubscriptionBox from "@components/AdminComponents/SubscriptionPlans/SubscriptionBox";
import AddPlanModal from "@components/AdminComponents/SubscriptionPlans/AddSubscriptionPlan";
import {
  subscriptionAPI,
  handleSubscriptionSuccess,
  handleSubscriptionError,
} from "@/services/subscriptionApiService";

export default function Subscriptions() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);

  // Fetch subscriptions on mount
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await subscriptionAPI.getSubscriptions();
      if (res.success) {
        setSubscriptions(res.data);
      }
    } catch (err) {
      handleSubscriptionError(err, "fetch subscriptions");
    }
  };

  // Add new subscription plan
  const handleAddPlan = async (newPlan) => {
    try {
      const res = await subscriptionAPI.createSubscription(newPlan);
      if (res.success) {
        handleSubscriptionSuccess(res, "create subscription");
        setShowAddModal(false);
        fetchSubscriptions(); // reload subscriptions to show the new plan
      }
    } catch (err) {
      handleSubscriptionError(err, "create subscription");
    }
  };

  // Edit subscription plan
  const handleEditPlan = async (updatedPlan) => {
    try {
      const res = await subscriptionAPI.updateSubscription(updatedPlan._id, updatedPlan);
      if (res.success) {
        handleSubscriptionSuccess(res, "update subscription");
        fetchSubscriptions();
      }
    } catch (err) {
      handleSubscriptionError(err, "update subscription");
    }
  };

  // Delete subscription plan
  const handleDeletePlan = async (id) => {
    try {
      const res = await subscriptionAPI.deleteSubscription(id);
      if (res.success) {
        handleSubscriptionSuccess(res, "delete subscription");
        fetchSubscriptions();
      }
    } catch (err) {
      handleSubscriptionError(err, "delete subscription");
    }
  };

  return (
    <div className="tw:min-h-screen tw:py-12 tw:px-4 sm:tw:px-6 lg:tw:px-20 tw:bg-gray-50">
      <h2 className="tw:text-3xl tw:font-bold tw:text-center tw:text-blue-800 tw:mb-8">
        Manage Subscription Tiers
      </h2>

      <div className="tw:flex tw:justify-end tw:mb-6 tw:max-w-7xl tw:mx-auto">
        <button
          className="tw:bg-green-600 tw:text-white tw:py-3 tw:px-6 tw:rounded-lg tw:font-semibold hover:tw:bg-green-700 tw:transition"
          onClick={() => setShowAddModal(true)}
        >
          Add New Plan
        </button>
      </div>

      {/* Subscription list */}
      <SubscriptionBox
        subscriptions={subscriptions}
        onEdit={handleEditPlan}
        onDelete={handleDeletePlan}
      />

      {/* Add plan modal */}
      {showAddModal && (
        <AddPlanModal
          onSuccess={handleAddPlan} // use onSuccess for new modal
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
