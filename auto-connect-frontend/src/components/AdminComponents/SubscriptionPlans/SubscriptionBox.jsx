import React, { useState } from "react";
import EditPlanModal from "./EditSubscriptionPlan"; // Adjust import path as needed

// Initial pricing data
const initialPlans = {
  monthly: {
    title: "Monthly",
    price: "21,800",
    currency: "LKR",
    costPerAd: "1090",
    validityPeriod: "1 Month",
    adsPerMonth: "20",
    promotionVoucher: "13,500",
  },
  quarterly: {
    title: "Quarterly",
    price: "62,130",
    currency: "LKR",
    costPerAd: "1035",
    validityPeriod: "3 Months",
    adsPerMonth: "20",
    promotionVoucher: "40,500",
  },
  yearly: {
    title: "Yearly",
    price: "209,280",
    currency: "LKR",
    costPerAd: "872",
    validityPeriod: "12 Months",
    adsPerMonth: "20",
    promotionVoucher: "162,000",
  },
};

// Feature row with emoji
const FeatureRow = ({ label, value, emoji }) => (
  <div className="tw:flex tw:items-start tw:gap-2 tw:text-sm">
    <span className="tw:text-xl">{emoji}</span>
    <div className="tw:flex-1">
      <div className="tw:text-gray-600">{label}</div>
      <div className="tw:font-semibold tw:text-gray-800">{value}</div>
    </div>
  </div>
);

// Price box with Edit & Delete buttons
const PriceBox = ({ plan, onEdit, onDelete }) => (
  <div className="tw:bg-white tw:rounded-2xl tw:p-6 tw:shadow-xl tw:border tw:border-gray-200 tw:transition-all tw:duration-300 tw:transform tw:hover:scale-[1.03]">
    <div className="tw:text-center tw:mb-6">
      <h3 className="tw:text-xl tw:font-bold tw:text-blue-900">{plan.title}</h3>
      <p className="tw:!text-3xl tw:font-bold tw:text-blue-700 tw:mt-2">
        {plan.currency} {plan.price}
      </p>
    </div>

    <div className="tw:space-y-4 tw:mb-6">
      <FeatureRow label="Cost Per Ad" value={`${plan.currency} ${plan.costPerAd}`} emoji="💰" />
      <FeatureRow label="Validity Period" value={plan.validityPeriod} emoji="📅" />
      <FeatureRow label="Ads Per Month" value={plan.adsPerMonth} emoji="📢" />
      <FeatureRow label="Promotion Voucher" value={`${plan.currency} ${plan.promotionVoucher}`} emoji="🎁" />
    </div>

    <div className="tw:flex tw:justify-between tw:gap-3">
      <button
        onClick={onEdit}
        className="tw:w-1/2 tw:bg-blue-600 tw:text-white tw:py-2 tw:rounded-lg tw:font-semibold hover:tw:bg-yellow-600"
      >
        Edit
      </button>
      <button
        onClick={onDelete}
        className="tw:w-1/2 tw:bg-red-500 tw:text-white tw:py-2 tw:rounded-lg tw:font-semibold hover:tw:bg-red-600"
      >
        Delete
      </button>
    </div>
  </div>
);

// Main SubscriptionBox
export default function SubscriptionBox() {
  const [plans, setPlans] = useState(initialPlans);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEdit = (key) => {
    setEditingPlan({ key, ...plans[key] });
    setShowModal(true);
  };

  const handleDelete = (key) => {
    const updated = { ...plans };
    delete updated[key];
    setPlans(updated);
  };

  const handleSave = (updatedPlan) => {
    const key = updatedPlan.title.toLowerCase();
    setPlans((prev) => ({
      ...prev,
      [key]: updatedPlan,
    }));
    setShowModal(false);
  };

  return (
    <div className="tw:bg-gray-50 tw:py-12 tw:px-4 sm:tw:px-6 lg:tw:px-20">
      <div className="tw:grid tw:grid-cols-3 sm:tw:grid-cols-2 lg:tw:grid-cols-3 tw:gap-8 tw:max-w-7xl tw:mx-auto">
        {Object.entries(plans).map(([key, plan]) => (
          <PriceBox
            key={key}
            plan={plan}
            onEdit={() => handleEdit(key)}
            onDelete={() => handleDelete(key)}
          />
        ))}
      </div>

      {showModal && editingPlan && (
        <EditPlanModal
          plan={editingPlan}
          onSave={handleSave}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
