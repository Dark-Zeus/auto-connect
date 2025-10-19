import React, { useState, useEffect } from "react";
import { X, Star, Shield, Check, Users, AlertCircle } from "lucide-react";

export default function AddPlanModal({ onSuccess, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    currency: "LKR",
    costPerAd: "",
    validityPeriod: "",
    adsPerMonth: "",
    promotionVoucher: "",
  });

  const [errors, setErrors] = useState({});

  // Auto-update validityPeriod based on title
  useEffect(() => {
    let validity = "";
    switch (formData.title) {
      case "Monthly": validity = 30; break;
      case "Quarterly": validity = 90; break;
      case "Yearly": validity = 365; break;
      default: validity = "";
    }
    setFormData(prev => ({ ...prev, validityPeriod: validity }));
  }, [formData.title]);

  // Auto-calculate adsPerMonth based on price and costPerAd
  useEffect(() => {
    const price = parseFloat(formData.price);
    const cost = parseFloat(formData.costPerAd);
    setFormData(prev => ({
      ...prev,
      adsPerMonth: !isNaN(price) && !isNaN(cost) && cost > 0 ? Math.floor(price / cost) : ""
    }));
  }, [formData.price, formData.costPerAd]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Allow only numeric input for numeric fields
    if (["price", "costPerAd", "promotionVoucher"].includes(name)) {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" })); // clear error when user types
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Please enter a valid positive price.";
    }
    if (!formData.costPerAd || isNaN(formData.costPerAd) || parseFloat(formData.costPerAd) <= 0) {
      newErrors.costPerAd = "Please enter a valid positive cost per ad.";
    }
    if (formData.promotionVoucher && (!/^\d+$/.test(formData.promotionVoucher) || parseInt(formData.promotionVoucher) < 0)) {
      newErrors.promotionVoucher = "Promotion days must be a non-negative number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (onSuccess) onSuccess(formData);
    onClose();
  };

  const fieldIcons = {
    title: <Star className="tw:w-5 tw:h-5 tw:text-yellow-500" />,
    price: <Shield className="tw:w-5 tw:h-5 tw:text-blue-500" />,
    costPerAd: <Check className="tw:w-5 tw:h-5 tw:text-green-600" />,
    validityPeriod: <Shield className="tw:w-5 tw:h-5 tw:text-blue-500" />,
    adsPerMonth: <Users className="tw:w-5 tw:h-5 tw:text-indigo-500" />,
    promotionVoucher: <Star className="tw:w-5 tw:h-5 tw:text-yellow-500" />,
  };

  const fields = [
    { label: "Plan Title", name: "title", type: "select", options: ["Monthly", "Quarterly", "Yearly"] },
    { label: "Price (LKR)", name: "price", placeholder: "Enter price" },
    { label: "Cost Per Ad", name: "costPerAd", placeholder: "Enter cost per ad" },
    { label: "Validity Period (Days)", name: "validityPeriod", placeholder: "Auto-filled", readOnly: true },
    { label: "Ads Per Month", name: "adsPerMonth", placeholder: "Auto-calculated", readOnly: true },
    { label: "Free Promotion (Days)", name: "promotionVoucher", placeholder: "Enter promotion days" },
  ];

  return (
    <div className="tw:fixed tw:inset-0 tw:z-999 tw:bg-black/40 tw:flex tw:items-center tw:justify-center tw:p-4">
      <div className="tw:bg-gradient-to-br tw:from-white tw:to-blue-50 tw:rounded-2xl tw:p-8 tw:w-full tw:max-w-2xl tw:shadow-2xl tw:relative tw:border-2 tw:border-blue-200/50">
        
        {/* Header */}
        <div className="tw:flex tw:justify-between tw:items-center tw:mb-6">
          <h2 className="tw:text-2xl tw:font-extrabold tw:text-blue-700">Add Subscription Plan</h2>
          <button onClick={onClose} className="tw:text-gray-400 hover:tw:text-red-500 tw:text-2xl tw:rounded-full tw:p-2 tw:transition-all tw:duration-200">
            <X className="tw:w-6 tw:h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-6">
          {fields.map(({ label, name, placeholder, type, options, readOnly }) => (
            <div key={name} className="tw:relative">
              <label className="tw:text-sm tw:font-semibold tw:text-blue-700 tw:mb-1 tw:flex tw:items-center tw:gap-2">
                {fieldIcons[name]} {label}
              </label>
              {type === "select" ? (
                <select
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  required
                  className="tw:w-full tw:border tw:border-blue-200 tw:rounded-xl tw:px-4 tw:py-2.5 tw:text-sm tw:bg-blue-50 focus:tw:ring-2 focus:tw:ring-blue-300 tw:outline-none"
                >
                  <option value="" disabled>Select {label}</option>
                  {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  readOnly={readOnly}
                  className={`tw:w-full tw:border tw:rounded-xl tw:px-4 tw:py-2.5 tw:text-sm focus:tw:ring-2 focus:tw:ring-blue-300
                    ${readOnly ? "tw:bg-gray-100 tw:border-gray-200" : "tw:bg-blue-50 tw:border-blue-200"}
                    ${errors[name] ? "tw:border-red-500 focus:tw:ring-red-400" : ""}`}
                  required={!readOnly}
                />
              )}
              {errors[name] && (
                <p className="tw:text-red-500 tw:text-xs tw:mt-1 tw:flex tw:items-center tw:gap-1">
                  <AlertCircle className="tw:w-4 tw:h-4" /> {errors[name]}
                </p>
              )}
            </div>
          ))}

          <div className="tw:col-span-1 md:tw:col-span-2 tw:flex tw:justify-end tw:gap-4 tw:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="tw:bg-gray-100 tw:text-gray-700 tw:px-5 tw:py-2.5 tw:rounded-lg hover:tw:bg-gray-200 tw:transition tw:duration-200 tw:font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="tw:bg-gradient-to-r tw:from-blue-600 tw:to-blue-700 tw:text-white tw:px-6 tw:py-2.5 tw:rounded-lg hover:tw:from-blue-700 hover:tw:to-blue-800 tw:transition tw:duration-200 tw:font-semibold tw:shadow-lg"
            >
              Save Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
