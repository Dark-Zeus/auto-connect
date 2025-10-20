import React, { useState, useEffect } from "react";
import { X, Star, Shield, Check, Users } from "lucide-react";

export default function EditPlanModal({ plan, onSave, onClose }) {
  const [formData, setFormData] = useState({ ...plan });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({ ...plan });
    setErrors({});
  }, [plan]);

  // Update validityPeriod when title changes
  useEffect(() => {
    let validity = "";
    switch (formData.title) {
      case "Monthly":
        validity = 30;
        break;
      case "Quarterly":
        validity = 90;
        break;
      case "Yearly":
        validity = 365;
        break;
      default:
        validity = "";
    }
    setFormData((prev) => ({ ...prev, validityPeriod: validity }));
  }, [formData.title]);

  // Update adsPerMonth when price or costPerAd changes
  useEffect(() => {
    const price = parseFloat(formData.price);
    const cost = parseFloat(formData.costPerAd);
    if (!isNaN(price) && !isNaN(cost) && cost > 0) {
      const ads = Math.floor(price / cost);
      setFormData((prev) => ({ ...prev, adsPerMonth: ads }));
    } else {
      setFormData((prev) => ({ ...prev, adsPerMonth: "" }));
    }
  }, [formData.price, formData.costPerAd]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = "Please select a plan title.";
    if (!formData.price || isNaN(formData.price) || formData.price <= 0)
      newErrors.price = "Enter a valid positive price.";
    if (!formData.costPerAd || isNaN(formData.costPerAd) || formData.costPerAd <= 0)
      newErrors.costPerAd = "Enter a valid cost per ad.";
    if (formData.adsPerMonth <= 0)
      newErrors.adsPerMonth = "Price must be greater than cost per ad.";
    if (formData.promotionVoucher && (isNaN(formData.promotionVoucher) || formData.promotionVoucher < 0))
      newErrors.promotionVoucher = "Promotion days must be a positive number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict number fields to numeric input only
    if (["price", "costPerAd", "promotionVoucher"].includes(name)) {
      if (value !== "" && !/^\d*\.?\d*$/.test(value)) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  // Field icons
  const fieldIcons = {
    title: <Star className="tw:w-5 tw:h-5 tw:text-yellow-500" />,
    price: <Shield className="tw:w-5 tw:h-5 tw:text-blue-500" />,
    costPerAd: <Check className="tw:w-5 tw:h-5 tw:text-green-600" />,
    validityPeriod: <Shield className="tw:w-5 tw:h-5 tw:text-blue-500" />,
    adsPerMonth: <Users className="tw:w-5 tw:h-5 tw:text-indigo-500" />,
    promotionVoucher: <Star className="tw:w-5 tw:h-5 tw:text-yellow-500" />,
  };

  const fields = [
    {
      label: "Plan Title",
      name: "title",
      type: "select",
      options: ["Monthly", "Quarterly", "Yearly"],
    },
    { label: "Price (LKR)", name: "price", placeholder: "Enter price" },
    { label: "Cost Per Ad (LKR)", name: "costPerAd", placeholder: "Enter cost per ad" },
    { label: "Validity Period (Days)", name: "validityPeriod", placeholder: "Auto-filled", readOnly: true },
    { label: "Ads Per Month", name: "adsPerMonth", placeholder: "Auto-calculated", readOnly: true },
    { label: "Free Promotion (Days)", name: "promotionVoucher", placeholder: "Enter promotion days" },
  ];

  return (
    <div className="tw:fixed tw:inset-0 tw:bg-black/40 tw:flex tw:items-center tw:justify-center tw:z-999 tw:px-4">
      <div className="tw:bg-gradient-to-br tw:from-white tw:to-blue-50 tw:rounded-2xl tw:p-8 tw:w-full tw:max-w-2xl tw:shadow-2xl tw:relative tw:border-2 tw:border-blue-200/50 tw:animate-fadeIn">
        {/* Header */}
        <div className="tw:flex tw:justify-between tw:items-center tw:mb-6">
          <h2 className="tw:text-2xl tw:font-extrabold tw:text-blue-700">
            Edit Subscription Plan
          </h2>
          <button
            onClick={onClose}
            className="tw:text-gray-400 hover:tw:text-red-500 tw:text-2xl tw:rounded-full tw:p-2 tw:transition-all tw:duration-200"
            title="Close"
          >
            <X className="tw:w-6 tw:h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-6">
          {fields.map(({ name, label, placeholder, type, options, readOnly }) => (
            <div key={name}>
              <label className="tw:text-sm tw:font-semibold tw:text-blue-700 tw:mb-1 tw:flex tw:items-center tw:gap-2">
                {fieldIcons[name]} {label}
              </label>

              {type === "select" ? (
                <select
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  className="tw:w-full tw:border tw:border-blue-200 tw:rounded-xl tw:px-4 tw:py-2.5 tw:text-sm tw:bg-blue-50 focus:tw:ring-2 focus:tw:ring-blue-300 tw:outline-none tw:transition tw:duration-200 tw:font-medium"
                  required
                >
                  <option value="" disabled>Select {label}</option>
                  {options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  readOnly={readOnly}
                  className={`tw:w-full tw:border tw:border-blue-200 tw:rounded-xl tw:px-4 tw:py-2.5 tw:text-sm tw:bg-blue-50 focus:tw:ring-2 focus:tw:ring-blue-300 tw:outline-none tw:transition tw:duration-200 tw:font-medium ${readOnly ? "tw:bg-gray-100" : ""}`}
                  required={!readOnly}
                />
              )}

              {errors[name] && (
                <p className="tw:text-red-500 tw:text-xs tw:mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          {/* Buttons */}
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
