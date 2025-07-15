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
    <div className="tw:fixed tw:inset-0 tw:z-50 tw:bg-black/50 tw:flex tw:items-center tw:justify-center tw:backdrop-blur-sm">
      <div className="tw:bg-white tw:rounded-2xl tw:p-8 tw:w-full tw:max-w-xl tw:shadow-2xl tw:relative tw:animate-fadeIn">
        {/* Header */}
        <div className="tw:flex tw:justify-between tw:items-center tw:mb-6">
          <h2 className="tw:text-2xl tw:font-bold tw:text-blue-700">
            Add New Subscription Plan
          </h2>
          <button
            onClick={onClose}
            className="tw:text-gray-500 hover:tw:text-red-500 tw:text-xl tw:font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="tw:space-y-5">
          {[
            { label: "Plan Title", name: "title" },
            { label: "Price", name: "price" },
            { label: "Cost Per Ad", name: "costPerAd" },
            { label: "Validity Period", name: "validityPeriod" },
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
                className="tw:w-full tw:border tw:border-blue-300 tw:rounded-xl tw:px-4 tw:py-2.5 tw:text-sm focus:tw:ring-2 focus:tw:ring-blue-200 tw:outline-none"
                required
              />
            </div>
          ))}

          {/* Buttons */}
          <div className="tw:flex tw:justify-end tw:gap-4 tw:pt-6">
            <button
              type="button"
              onClick={onClose}
              className="tw:bg-gray-200 tw:text-gray-800 tw:px-5 tw:py-2 tw:rounded-lg hover:tw:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="tw:bg-blue-600 tw:text-white tw:px-5 tw:py-2 tw:rounded-lg hover:tw:bg-blue-700"
            >
              Save Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
