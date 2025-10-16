import React, { useState, useEffect } from "react";
import EditPlanModal from "./EditSubscriptionPlan"; // Adjust path as needed
import { Check, Star, Zap, Shield, Users, TrendingUp } from "lucide-react";

export default function SubscriptionBox({ subscriptions, onEdit, onDelete }) {
  const [editingPlan, setEditingPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEditClick = (plan) => {
    setEditingPlan(plan);
    setShowModal(true);
  };

  const handleSave = (updatedPlan) => {
    if (onEdit) onEdit(updatedPlan); // call parent callback to update backend
    setShowModal(false);
  };

  return (
    <div className="tw:grid tw:grid-cols-3 sm:tw:grid-cols-2 lg:tw:grid-cols-3 tw:gap-8 tw:max-w-7xl tw:mx-auto">
      {subscriptions && subscriptions.length > 0 ? (
        subscriptions.map((plan) => {
          const title = plan.title || "Plan";
          return (
            <div
              key={plan._id}
              className="tw:bg-white tw:rounded-2xl tw:p-6 tw:shadow-xl tw:border tw:border-gray-200 tw:transition-all tw:duration-300 tw:transform tw:hover:scale-[1.03]"
            >
              <div className="tw:text-center tw:mb-6">
                <div className="tw:flex tw:justify-center tw:mb-2">
                  {title === "Monthly" && <Zap className="tw:w-8 tw:h-8 tw:text-yellow-500" />}
                  {title === "Quarterly" && <TrendingUp className="tw:w-8 tw:h-8 tw:text-blue-500" />}
                  {title === "Yearly" && <Star className="tw:w-8 tw:h-8 tw:text-purple-500" />}
                </div>
                <h3 className="tw:text-xl tw:font-bold tw:text-blue-900">{title}</h3>
                <p className="tw:!text-3xl tw:font-bold tw:text-blue-700 tw:mt-2">
                  LKR {plan.price}
                </p>
              </div>

              <div className="tw:space-y-4 tw:mb-6">
                <div className="tw:flex tw:items-start tw:gap-3 tw:text-sm">
                  <Check className="tw:w-5 tw:h-5 tw:text-green-600" />
                  <div className="tw:flex-1">
                    <div className="tw:text-gray-600">Cost Per Ad</div>
                    <div className="tw:font-semibold tw:text-gray-800">{plan.costPerAd}</div>
                  </div>
                </div>
                <div className="tw:flex tw:items-start tw:gap-3 tw:text-sm">
                  <Shield className="tw:w-5 tw:h-5 tw:text-blue-500" />
                  <div className="tw:flex-1">
                    <div className="tw:text-gray-600">Validity Period</div>
                    <div className="tw:font-semibold tw:text-gray-800">{plan.validityPeriod}</div>
                  </div>
                </div>
                <div className="tw:flex tw:items-start tw:gap-3 tw:text-sm">
                  <Users className="tw:w-5 tw:h-5 tw:text-indigo-500" />
                  <div className="tw:flex-1">
                    <div className="tw:text-gray-600">Ads Per Month</div>
                    <div className="tw:font-semibold tw:text-gray-800">{plan.adsPerMonth}</div>
                  </div>
                </div>
                <div className="tw:flex tw:items-start tw:gap-3 tw:text-sm">
                  <Star className="tw:w-5 tw:h-5 tw:text-yellow-500" />
                  <div className="tw:flex-1">
                    <div className="tw:text-gray-600">Free Promotion</div>
                    <div className="tw:font-semibold tw:text-gray-800">{plan.promotionVoucher || plan.freePromotion}</div>
                  </div>
                </div>
              </div>

              <div className="tw:flex tw:justify-between tw:gap-3">
                <button
                  onClick={() => handleEditClick(plan)}
                  className="tw:w-1/2 tw:bg-blue-600 tw:text-white tw:py-2 tw:rounded-lg tw:font-semibold hover:tw:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete && onDelete(plan._id)}
                  className="tw:w-1/2 tw:bg-red-500 tw:text-white tw:py-2 tw:rounded-lg tw:font-semibold hover:tw:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })
      ) : (
        <p className="tw:col-span-3 tw:text-center tw:text-gray-500 tw:text-lg">
          No subscription plans found.
        </p>
      )}

      {showModal && editingPlan && (
        <EditPlanModal plan={editingPlan} onSave={handleSave} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
