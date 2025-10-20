import React, { useState } from "react";
import EditPlanModal from "./EditSubscriptionPlan"; // Adjust path as needed
import { Check, Star, Zap, Shield, Users, TrendingUp, X } from "lucide-react";

export default function SubscriptionBox({ subscriptions, onEdit, onDelete }) {
  const [editingPlan, setEditingPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null); // stores plan id to confirm
  const [toastMessage, setToastMessage] = useState(""); // optional for feedback

  const handleEditClick = (plan) => {
    setEditingPlan(plan);
    setShowModal(true);
  };

  const handleDeleteClick = (planId) => {
    setConfirmDelete(planId);
  };

  const confirmDeletePlan = () => {
    if (onDelete && confirmDelete) {
      onDelete(confirmDelete);
      setToastMessage("Plan deleted successfully!");
    }
    setConfirmDelete(null);
  };

  const cancelDelete = () => setConfirmDelete(null);

  const handleSave = (updatedPlan) => {
    if (onEdit) onEdit(updatedPlan); // call parent callback to update backend
    setShowModal(false);
  };

  return (
    <div className="tw:grid tw:grid-cols-3 sm:tw:grid-cols-2 lg:tw:grid-cols-3 tw:gap-8 tw:max-w-7xl tw:mx-auto tw:relative">
      {/* Subscription Cards */}
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
                  onClick={() => handleDeleteClick(plan._id)}
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

      {/* Edit Modal */}
      {showModal && editingPlan && (
        <EditPlanModal plan={editingPlan} onSave={handleSave} onClose={() => setShowModal(false)} />
      )}

      {/* Delete Confirmation Box */}
      {confirmDelete && (
        <div className="tw:fixed tw:text-lg tw:inset-0 tw:flex tw:items-center tw:justify-center tw:bg-black/30 tw:z-50">
          <div className="tw:bg-white tw:border tw:border-red-500 tw:shadow-lg tw:rounded-xl tw:p-10 tw:w-200 tw:max-w-sm">
            <p className="tw:text-lg tw:text-gray-700 tw:mb-4">
              Are you sure you want to delete this plan?
            </p>
            <div className="tw:flex tw:justify-end tw:gap-3 tw:mt-6">
              <button
                onClick={cancelDelete}
                className="tw:bg-gray-100 tw:text-gray-700 tw:px-4 tw:py-2 tw:rounded-lg hover:tw:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeletePlan}
                className="tw:bg-red-500 tw:text-white tw:px-4 tw:py-2 tw:rounded-lg hover:tw:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Optional Toast */}
      {toastMessage && (
        <div className="tw:fixed tw:bottom-4 tw:right-4 tw:bg-green-500 tw:text-white tw:px-4 tw:py-2 tw:rounded-lg tw:shadow-md">
          {toastMessage}
          <X
            size={16}
            className="tw:inline tw:ml-2 tw:cursor-pointer"
            onClick={() => setToastMessage("")}
          />
        </div>
      )}
    </div>
  );
}
