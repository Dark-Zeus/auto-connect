import React, { useState } from "react";

export default function AddPlanModal({ onSave, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    currency: "LKR",
    costPerAd: "",
    validityPeriod: "",
    adsPerMonth: "",
    promotionVoucher: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="tw:fixed tw:inset-0 tw:z-50 tw:bg-black/40 tw:flex tw:items-center tw:justify-center tw:p-4">
      <div className="tw:bg-white tw:rounded-2xl tw:p-8 tw:w-full tw:max-w-2xl tw:shadow-xl tw:relative tw:animate-fadeIn">
        {/* Header */}
        <div className="tw:flex tw:justify-between tw:items-center tw:mb-6">
          <h2 className="tw:text-2xl tw:font-extrabold tw:text-blue-700">
            Add Subscription Plan
          </h2>
          <button
            onClick={onClose}
            className="tw:text-gray-400 hover:tw:text-red-500 tw:text-2xl"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-6">
          {[
            { label: "Plan Title", name: "title" },
            { label: "Price (LKR)", name: "price" },
            { label: "Cost Per Ad", name: "costPerAd" },
            { label: "Validity Period (Days)", name: "validityPeriod" },
            { label: "Ads Per Month", name: "adsPerMonth" },
            { label: "Promotion Voucher", name: "promotionVoucher" },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-1">
                {label}
              </label>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="tw:w-full tw:border tw:border-gray-300 tw:rounded-xl tw:px-4 tw:py-2.5 tw:text-sm tw:bg-gray-50 focus:tw:ring-2 focus:tw:ring-blue-300 tw:outline-none tw:transition tw:duration-200"
                placeholder={`Enter ${label.toLowerCase()}`}
                required
              />
            </div>
          ))}

          {/* Buttons */}
          <div className="tw:col-span-1 md:tw:col-span-2 tw:flex tw:justify-end tw:gap-4 tw:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="tw:bg-gray-100 tw:text-gray-700 tw:px-5 tw:py-2.5 tw:rounded-lg hover:tw:bg-gray-200 tw:transition tw:duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="tw:bg-blue-600 tw:text-white tw:px-6 tw:py-2.5 tw:rounded-lg hover:tw:bg-blue-700 tw:transition tw:duration-200"
            >
              Save Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
