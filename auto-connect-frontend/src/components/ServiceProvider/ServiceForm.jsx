// src/components/ServiceProvider/ServiceForm.jsx (Updated with Atomic Components)
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { toast } from "react-toastify";

// Import our custom atomic components
import ServiceTypeSelector from "@components/atoms/ServiceTypeSelector";
import PriceRangeInput from "@components/atoms/PriceRangeInput";
import StatusBadge from "@components/atoms/StatusBadge";

const ServiceForm = ({
  initialData = null,
  onSubmit,
  onCancel,
  loading = false,
  isEdit = false,
}) => {
  const [serviceData, setServiceData] = useState({
    serviceType: "",
    description: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    duration: "",
    priceNote: "",
    requirements: [""],
    includedItems: [""],
    excludedItems: [""],
    warrantyPeriod: "",
    specialInstructions: "",
    isActive: true,
    tags: [""],
  });

  const [errors, setErrors] = useState({});

  // Initialize form with data for editing
  useEffect(() => {
    if (initialData) {
      setServiceData({
        serviceType: initialData.serviceType || "",
        description: initialData.description || "",
        category: initialData.category || "",
        minPrice: initialData.minPrice?.toString() || "",
        maxPrice: initialData.maxPrice?.toString() || "",
        duration: initialData.duration || "",
        priceNote: initialData.priceNote || "",
        requirements: initialData.requirements?.length
          ? initialData.requirements
          : [""],
        includedItems: initialData.includedItems?.length
          ? initialData.includedItems
          : [""],
        excludedItems: initialData.excludedItems?.length
          ? initialData.excludedItems
          : [""],
        warrantyPeriod: initialData.warrantyPeriod || "",
        specialInstructions: initialData.specialInstructions || "",
        isActive:
          initialData.isActive !== undefined ? initialData.isActive : true,
        tags: initialData.tags?.length ? initialData.tags : [""],
      });
    }
  }, [initialData]);

  const serviceCategories = [
    "Engine Services",
    "Brake Services",
    "Transmission Services",
    "Electrical Services",
    "Body Work",
    "Tire Services",
    "AC Services",
    "Inspection Services",
    "Cleaning Services",
    "Emergency Services",
  ];

  const durationOptions = [
    "15 minutes",
    "30 minutes",
    "45 minutes",
    "1 hour",
    "1.5 hours",
    "2 hours",
    "2.5 hours",
    "3 hours",
    "4 hours",
    "5+ hours",
  ];

  const warrantyOptions = [
    "1 week",
    "2 weeks",
    "1 month",
    "3 months",
    "6 months",
    "1 year",
    "2 years",
    "No warranty",
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setServiceData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle service type changes from ServiceTypeSelector
  const handleServiceTypeChange = (e) => {
    setServiceData((prev) => ({
      ...prev,
      serviceType: e.target.value,
    }));

    if (errors.serviceType) {
      setErrors((prev) => ({
        ...prev,
        serviceType: "",
      }));
    }
  };

  // Handle price changes from PriceRangeInput
  const handleMinPriceChange = (e) => {
    setServiceData((prev) => ({
      ...prev,
      minPrice: e.target.value,
    }));

    if (errors.minPrice) {
      setErrors((prev) => ({
        ...prev,
        minPrice: "",
      }));
    }
  };

  const handleMaxPriceChange = (e) => {
    setServiceData((prev) => ({
      ...prev,
      maxPrice: e.target.value,
    }));

    if (errors.maxPrice) {
      setErrors((prev) => ({
        ...prev,
        maxPrice: "",
      }));
    }
  };

  const handleArrayChange = (index, value, field) => {
    setServiceData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setServiceData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (index, field) => {
    if (serviceData[field].length > 1) {
      setServiceData((prev) => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required field validations
    if (!serviceData.serviceType.trim()) {
      newErrors.serviceType = "Service type is required";
    }

    if (!serviceData.category) {
      newErrors.category = "Category is required";
    }

    if (!serviceData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (serviceData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    if (!serviceData.minPrice || serviceData.minPrice <= 0) {
      newErrors.minPrice = "Valid minimum price is required";
    }

    if (!serviceData.maxPrice || serviceData.maxPrice <= 0) {
      newErrors.maxPrice = "Valid maximum price is required";
    }

    if (parseFloat(serviceData.minPrice) >= parseFloat(serviceData.maxPrice)) {
      newErrors.maxPrice = "Maximum price must be greater than minimum price";
    }

    if (!serviceData.duration.trim()) {
      newErrors.duration = "Duration is required";
    }

    // Validate array fields have at least one non-empty item
    const nonEmptyRequirements = serviceData.requirements.filter(
      (req) => req.trim() !== ""
    );
    if (nonEmptyRequirements.length === 0) {
      newErrors.requirements = "At least one requirement is needed";
    }

    const nonEmptyIncluded = serviceData.includedItems.filter(
      (item) => item.trim() !== ""
    );
    if (nonEmptyIncluded.length === 0) {
      newErrors.includedItems = "At least one included item is needed";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all validation errors");
      return;
    }

    // Clean up array fields (remove empty strings)
    const cleanedData = {
      ...serviceData,
      requirements: serviceData.requirements.filter((req) => req.trim() !== ""),
      includedItems: serviceData.includedItems.filter(
        (item) => item.trim() !== ""
      ),
      excludedItems: serviceData.excludedItems.filter(
        (item) => item.trim() !== ""
      ),
      tags: serviceData.tags.filter((tag) => tag.trim() !== ""),
      minPrice: parseFloat(serviceData.minPrice),
      maxPrice: parseFloat(serviceData.maxPrice),
    };

    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit} className="tw:space-y-8">
      {/* Basic Information Section */}
      <div className="tw:bg-gray-50 tw:p-6 tw:rounded-lg">
        <h3 className="tw:text-lg tw:font-semibold tw:text-gray-800 tw:mb-4">
          Basic Information
        </h3>

        <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-6">
          <div>
            <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
              Service Category *
            </label>
            <select
              name="category"
              value={serviceData.category}
              onChange={handleInputChange}
              className={`tw:w-full tw:px-3 tw:py-2 tw:border tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500 tw:bg-white ${
                errors.category ? "tw:border-red-500" : "tw:border-gray-300"
              }`}
            >
              <option value="">Select Category</option>
              {serviceCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="tw:text-red-500 tw:text-sm tw:mt-1">
                {errors.category}
              </p>
            )}
          </div>

          {/* Using ServiceTypeSelector atomic component */}
          <div>
            <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
              Service Type *
            </label>
            <ServiceTypeSelector
              value={serviceData.serviceType}
              onChange={handleServiceTypeChange}
              category={serviceData.category}
              error={errors.serviceType}
              placeholder="Select or enter service type"
              showSearch={true}
              allowCustom={true}
              required={true}
            />
          </div>
        </div>

        {/* Description */}
        <div className="tw:mt-6">
          <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
            Service Description *
          </label>
          <textarea
            name="description"
            value={serviceData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Provide a detailed description of the service, what it includes, and any important information customers should know..."
            className={`tw:w-full tw:px-3 tw:py-2 tw:border tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500 tw:resize-none ${
              errors.description ? "tw:border-red-500" : "tw:border-gray-300"
            }`}
          />
          <div className="tw:flex tw:justify-between tw:items-center tw:mt-1">
            {errors.description && (
              <p className="tw:text-red-500 tw:text-sm">{errors.description}</p>
            )}
            <p className="tw:text-xs tw:text-gray-500 tw:ml-auto">
              {serviceData.description.length}/500 characters
            </p>
          </div>
        </div>
      </div>

      {/* Pricing and Duration Section */}
      <div className="tw:bg-gray-50 tw:p-6 tw:rounded-lg">
        <h3 className="tw:text-lg tw:font-semibold tw:text-gray-800 tw:mb-4">
          Pricing & Duration
        </h3>

        {/* Using PriceRangeInput atomic component */}
        <PriceRangeInput
          minPrice={serviceData.minPrice}
          maxPrice={serviceData.maxPrice}
          onMinChange={handleMinPriceChange}
          onMaxChange={handleMaxPriceChange}
          errors={errors}
          category={serviceData.category}
          showSuggestions={true}
          step={50}
        />

        {/* Duration and Price Note */}
        <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-6 tw:mt-6">
          <div>
            <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
              Expected Duration *
            </label>
            <select
              name="duration"
              value={serviceData.duration}
              onChange={handleInputChange}
              className={`tw:w-full tw:px-3 tw:py-2 tw:border tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500 tw:bg-white ${
                errors.duration ? "tw:border-red-500" : "tw:border-gray-300"
              }`}
            >
              <option value="">Select Duration</option>
              {durationOptions.map((duration) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
            {errors.duration && (
              <p className="tw:text-red-500 tw:text-sm tw:mt-1">
                {errors.duration}
              </p>
            )}
          </div>

          <div>
            <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
              Price Note (Optional)
            </label>
            <input
              type="text"
              name="priceNote"
              value={serviceData.priceNote}
              onChange={handleInputChange}
              placeholder="e.g., Price varies based on vehicle type and oil grade"
              className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Service Details Section */}
      <div className="tw:bg-gray-50 tw:p-6 tw:rounded-lg">
        <h3 className="tw:text-lg tw:font-semibold tw:text-gray-800 tw:mb-4">
          Service Details
        </h3>

        {/* Requirements */}
        <div className="tw:mb-6">
          <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
            Requirements *
          </label>
          {serviceData.requirements.map((req, index) => (
            <div key={index} className="tw:flex tw:space-x-2 tw:mb-2">
              <input
                type="text"
                value={req}
                onChange={(e) =>
                  handleArrayChange(index, e.target.value, "requirements")
                }
                placeholder="e.g., Vehicle registration documents required"
                className="tw:flex-1 tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500"
              />
              {serviceData.requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, "requirements")}
                  className="tw:text-red-600 hover:tw:text-red-800 tw:p-2"
                  title="Remove requirement"
                >
                  <Trash2 className="tw:h-4 tw:w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("requirements")}
            className="tw:flex tw:items-center tw:space-x-1 tw:text-blue-600 hover:tw:text-blue-800 tw:text-sm"
          >
            <Plus className="tw:h-4 tw:w-4" />
            <span>Add Requirement</span>
          </button>
          {errors.requirements && (
            <p className="tw:text-red-500 tw:text-sm tw:mt-1">
              {errors.requirements}
            </p>
          )}
        </div>

        {/* Included Items */}
        <div className="tw:mb-6">
          <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
            What's Included *
          </label>
          {serviceData.includedItems.map((item, index) => (
            <div key={index} className="tw:flex tw:space-x-2 tw:mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  handleArrayChange(index, e.target.value, "includedItems")
                }
                placeholder="e.g., High-quality synthetic oil, new oil filter"
                className="tw:flex-1 tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500"
              />
              {serviceData.includedItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, "includedItems")}
                  className="tw:text-red-600 hover:tw:text-red-800 tw:p-2"
                  title="Remove included item"
                >
                  <Trash2 className="tw:h-4 tw:w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("includedItems")}
            className="tw:flex tw:items-center tw:space-x-1 tw:text-blue-600 hover:tw:text-blue-800 tw:text-sm"
          >
            <Plus className="tw:h-4 tw:w-4" />
            <span>Add Included Item</span>
          </button>
          {errors.includedItems && (
            <p className="tw:text-red-500 tw:text-sm tw:mt-1">
              {errors.includedItems}
            </p>
          )}
        </div>

        {/* Excluded Items */}
        <div className="tw:mb-6">
          <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
            What's NOT Included (Optional)
          </label>
          {serviceData.excludedItems.map((item, index) => (
            <div key={index} className="tw:flex tw:space-x-2 tw:mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  handleArrayChange(index, e.target.value, "excludedItems")
                }
                placeholder="e.g., Additional parts if engine damage found"
                className="tw:flex-1 tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500"
              />
              {serviceData.excludedItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, "excludedItems")}
                  className="tw:text-red-600 hover:tw:text-red-800 tw:p-2"
                  title="Remove excluded item"
                >
                  <Trash2 className="tw:h-4 tw:w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("excludedItems")}
            className="tw:flex tw:items-center tw:space-x-1 tw:text-blue-600 hover:tw:text-blue-800 tw:text-sm"
          >
            <Plus className="tw:h-4 tw:w-4" />
            <span>Add Excluded Item</span>
          </button>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="tw:bg-gray-50 tw:p-6 tw:rounded-lg">
        <h3 className="tw:text-lg tw:font-semibold tw:text-gray-800 tw:mb-4">
          Additional Information
        </h3>

        <div className="tw:grid tw:grid-cols-1 md:tw:grid-cols-2 tw:gap-6 tw:mb-6">
          <div>
            <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
              Warranty Period
            </label>
            <select
              name="warrantyPeriod"
              value={serviceData.warrantyPeriod}
              onChange={handleInputChange}
              className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500 tw:bg-white"
            >
              <option value="">Select Warranty</option>
              {warrantyOptions.map((warranty) => (
                <option key={warranty} value={warranty}>
                  {warranty}
                </option>
              ))}
            </select>
          </div>

          <div className="tw:flex tw:items-center tw:space-x-3 tw:mt-6">
            <input
              type="checkbox"
              name="isActive"
              checked={serviceData.isActive}
              onChange={handleInputChange}
              className="tw:h-4 tw:w-4 tw:text-blue-600 tw:focus:ring-blue-500 tw:border-gray-300 tw:rounded"
            />
            <label className="tw:text-sm tw:font-medium tw:text-gray-700">
              Make this service active immediately
            </label>
            {/* Using StatusBadge to show current status */}
            <StatusBadge
              status={serviceData.isActive ? "active" : "inactive"}
              size="xs"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="tw:mb-6">
          <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
            Service Tags (Optional)
          </label>
          {serviceData.tags.map((tag, index) => (
            <div key={index} className="tw:flex tw:space-x-2 tw:mb-2">
              <input
                type="text"
                value={tag}
                onChange={(e) =>
                  handleArrayChange(index, e.target.value, "tags")
                }
                placeholder="e.g., quick-service, premium, eco-friendly"
                className="tw:flex-1 tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500"
              />
              {serviceData.tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, "tags")}
                  className="tw:text-red-600 hover:tw:text-red-800 tw:p-2"
                  title="Remove tag"
                >
                  <Trash2 className="tw:h-4 tw:w-4" />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("tags")}
            className="tw:flex tw:items-center tw:space-x-1 tw:text-blue-600 hover:tw:text-blue-800 tw:text-sm"
          >
            <Plus className="tw:h-4 tw:w-4" />
            <span>Add Tag</span>
          </button>
        </div>

        {/* Special Instructions */}
        <div>
          <label className="tw:block tw:text-sm tw:font-medium tw:text-gray-700 tw:mb-2">
            Special Instructions (Optional)
          </label>
          <textarea
            name="specialInstructions"
            value={serviceData.specialInstructions}
            onChange={handleInputChange}
            rows={3}
            placeholder="Any special instructions for customers or staff members..."
            className="tw:w-full tw:px-3 tw:py-2 tw:border tw:border-gray-300 tw:rounded-md tw:focus:outline-none tw:focus:ring-2 tw:focus:ring-blue-500 tw:resize-none"
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="tw:flex tw:justify-end tw:space-x-4 tw:pt-6 tw:border-t tw:border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="tw:px-6 tw:py-3 tw:border tw:border-gray-300 tw:rounded-md tw:text-gray-700 hover:tw:bg-gray-50 tw:transition-colors tw:flex tw:items-center tw:space-x-2"
        >
          <X className="tw:h-4 tw:w-4" />
          <span>Cancel</span>
        </button>
        <button
          type="submit"
          disabled={loading}
          className="tw:px-6 tw:py-3 tw:bg-blue-600 tw:text-white tw:rounded-md hover:tw:bg-blue-700 tw:transition-colors tw:flex tw:items-center tw:space-x-2 disabled:tw:opacity-50 disabled:tw:cursor-not-allowed tw:shadow-lg"
        >
          <Save className="tw:h-4 tw:w-4" />
          <span>
            {loading
              ? isEdit
                ? "Updating..."
                : "Adding..."
              : isEdit
              ? "Update Service"
              : "Add Service"}
          </span>
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
