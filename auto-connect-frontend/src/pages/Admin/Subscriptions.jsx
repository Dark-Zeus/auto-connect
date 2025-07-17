import React, { useState } from "react";
import SubscriptionBox from "@components/AdminComponents/SubscriptionPlans/SubscriptionBox";
import AddPlanModal from "@components/AdminComponents/SubscriptionPlans/AddSubscriptionPlan";

export default function Subscriptions() {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddPlan = (newPlan) => {
    console.log("New Plan Added:", newPlan);
    // TODO: Add the new plan to the data/state or trigger API
  };

  return (
    <div className="tw:min-h-screen tw:py-12 tw:px-4 sm:tw:px-6 lg:tw:px-20 tw:bg-gray-50">
      <h2 className="tw:text-3xl tw:font-bold tw:text-center tw:text-blue-800 tw:mb-8">
        Manage Subscription Tiers
      </h2>

      <div className="tw:flex tw:justify-end tw:mb-6 tw:max-w-7xl tw:mx-auto">
        <button
          className="tw:bg-blue-600 tw:text-white tw:py-3 tw:px-6 tw:rounded-lg tw:font-semibold hover:tw:bg-green-700 tw:transition"
          onClick={() => setShowAddModal(true)}
        >
          Add New Plan
        </button>
      </div>

      <SubscriptionBox />

      {showAddModal && (
        <AddPlanModal
          onSave={handleAddPlan}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
