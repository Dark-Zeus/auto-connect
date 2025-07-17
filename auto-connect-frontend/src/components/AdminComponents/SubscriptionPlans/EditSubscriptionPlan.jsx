import React, { useState, useEffect } from "react";

export default function EditPlanModal({ plan, onSave, onClose }) {
  const [formData, setFormData] = useState({ ...plan });

  useEffect(() => {
    setFormData({ ...plan });
  }, [plan]);

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
    <div className="tw:fixed tw:inset-0 tw:bg-black/40 tw:backdrop-blur-sm tw:flex tw:items-center tw:justify-center tw:z-50 tw:px-4">
      <div className="tw:bg-white tw:rounded-2xl tw:p-8 tw:w-full tw:max-w-lg tw:shadow-2xl tw:animate-fadeIn tw:relative">
        <h2 className="tw:text-2xl tw:font-bold tw:text-center tw:text-blue-800 tw:mb-6">
          ✏️ Edit {formData.title} Plan
        </h2>
        <div className="tw:space-y-5">
          {[
            { name: "title", label: "Plan Title" },
            { name: "price", label: "Price (LKR)" },
            { name: "costPerAd", label: "Cost Per Ad (LKR)" },
            { name: "validityPeriod", label: "Validity Period" },
            { name: "adsPerMonth", label: "Ads Per Month" },
            { name: "promotionVoucher", label: "Promotion Voucher (LKR)" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="tw:block tw:text-sm tw:font-semibold tw:text-gray-700 tw:mb-1">
                {label}
              </label>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="tw:w-full tw:border tw:border-blue-300 tw:rounded-xl tw:py-2 tw:px-3 tw:text-gray-800 focus:tw:ring-2 focus:tw:ring-blue-300 focus:tw:outline-none tw:transition"
              />
            </div>
          ))}
          <div className="tw:flex tw:justify-end tw:gap-3 tw:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="tw:bg-gray-200 tw:text-gray-800 tw:px-4 tw:py-2 tw:rounded-lg hover:tw:bg-gray-300 tw:transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="tw:bg-blue-600 tw:text-white tw:px-5 tw:py-2 tw:rounded-lg hover:tw:bg-blue-700 tw:transition tw:font-semibold"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}