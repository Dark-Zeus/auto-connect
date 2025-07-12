// src/components/ServiceProvider/ServiceForm.jsx (Updated with CSS Classes)
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, X } from "lucide-react";
import { toast } from "react-toastify";
import "./ServiceForm.css";

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
    <form onSubmit={handleSubmit} className="service-form">
      {/* Basic Information Section */}
      <div className="service-form-section">
        <h3 className="service-form-section-title">Basic Information</h3>

        <div className="service-form-grid">
          <div className="service-form-group">
            <label className="service-form-label required">
              Service Category
            </label>
            <select
              name="category"
              value={serviceData.category}
              onChange={handleInputChange}
              className={`service-form-select ${
                errors.category ? "error" : ""
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
              <p className="service-form-error">{errors.category}</p>
            )}
          </div>

          {/* Using ServiceTypeSelector atomic component */}
          <div className="service-form-group">
            <label className="service-form-label required">Service Type</label>
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
        <div className="service-form-group service-form-grid-full mt-6">
          <label className="service-form-label required">
            Service Description
          </label>
          <textarea
            name="description"
            value={serviceData.description}
            onChange={handleInputChange}
            rows={4}
            placeholder="Provide a detailed description of the service, what it includes, and any important information customers should know..."
            className={`service-form-textarea ${
              errors.description ? "error" : ""
            }`}
          />
          <div className="service-form-char-counter">
            {errors.description && (
              <p className="service-form-error">{errors.description}</p>
            )}
            <p className="service-form-char-count">
              {serviceData.description.length}/500 characters
            </p>
          </div>
        </div>
      </div>

      {/* Pricing and Duration Section */}
      <div className="service-form-section">
        <h3 className="service-form-section-title">Pricing & Duration</h3>

        {/* Using PriceRangeInput atomic component */}
        <div className="service-form-price-container">
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
        </div>

        {/* Duration and Price Note */}
        <div className="service-form-grid mt-6">
          <div className="service-form-group">
            <label className="service-form-label required">
              Expected Duration
            </label>
            <select
              name="duration"
              value={serviceData.duration}
              onChange={handleInputChange}
              className={`service-form-select ${
                errors.duration ? "error" : ""
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
              <p className="service-form-error">{errors.duration}</p>
            )}
          </div>

          <div className="service-form-group">
            <label className="service-form-label">Price Note (Optional)</label>
            <input
              type="text"
              name="priceNote"
              value={serviceData.priceNote}
              onChange={handleInputChange}
              placeholder="e.g., Price varies based on vehicle type and oil grade"
              className="service-form-input"
            />
          </div>
        </div>
      </div>

      {/* Service Details Section */}
      <div className="service-form-section">
        <h3 className="service-form-section-title">Service Details</h3>

        {/* Requirements */}
        <div className="service-form-array-group">
          <label className="service-form-label required">Requirements</label>
          {serviceData.requirements.map((req, index) => (
            <div key={index} className="service-form-array-item">
              <input
                type="text"
                value={req}
                onChange={(e) =>
                  handleArrayChange(index, e.target.value, "requirements")
                }
                placeholder="e.g., Vehicle registration documents required"
                className="service-form-input service-form-array-input"
              />
              {serviceData.requirements.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, "requirements")}
                  className="service-form-array-remove"
                  title="Remove requirement"
                >
                  <Trash2 />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("requirements")}
            className="service-form-array-add"
          >
            <Plus />
            <span>Add Requirement</span>
          </button>
          {errors.requirements && (
            <p className="service-form-error">{errors.requirements}</p>
          )}
        </div>

        {/* Included Items */}
        <div className="service-form-array-group">
          <label className="service-form-label required">What's Included</label>
          {serviceData.includedItems.map((item, index) => (
            <div key={index} className="service-form-array-item">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  handleArrayChange(index, e.target.value, "includedItems")
                }
                placeholder="e.g., High-quality synthetic oil, new oil filter"
                className="service-form-input service-form-array-input"
              />
              {serviceData.includedItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, "includedItems")}
                  className="service-form-array-remove"
                  title="Remove included item"
                >
                  <Trash2 />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("includedItems")}
            className="service-form-array-add"
          >
            <Plus />
            <span>Add Included Item</span>
          </button>
          {errors.includedItems && (
            <p className="service-form-error">{errors.includedItems}</p>
          )}
        </div>

        {/* Excluded Items */}
        <div className="service-form-array-group">
          <label className="service-form-label">
            What's NOT Included (Optional)
          </label>
          {serviceData.excludedItems.map((item, index) => (
            <div key={index} className="service-form-array-item">
              <input
                type="text"
                value={item}
                onChange={(e) =>
                  handleArrayChange(index, e.target.value, "excludedItems")
                }
                placeholder="e.g., Additional parts if engine damage found"
                className="service-form-input service-form-array-input"
              />
              {serviceData.excludedItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, "excludedItems")}
                  className="service-form-array-remove"
                  title="Remove excluded item"
                >
                  <Trash2 />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("excludedItems")}
            className="service-form-array-add"
          >
            <Plus />
            <span>Add Excluded Item</span>
          </button>
        </div>
      </div>

      {/* Additional Information Section */}
      <div className="service-form-section">
        <h3 className="service-form-section-title">Additional Information</h3>

        <div className="service-form-grid mb-6">
          <div className="service-form-group">
            <label className="service-form-label">Warranty Period</label>
            <select
              name="warrantyPeriod"
              value={serviceData.warrantyPeriod}
              onChange={handleInputChange}
              className="service-form-select"
            >
              <option value="">Select Warranty</option>
              {warrantyOptions.map((warranty) => (
                <option key={warranty} value={warranty}>
                  {warranty}
                </option>
              ))}
            </select>
          </div>

          <div className="service-form-checkbox-group">
            <input
              type="checkbox"
              name="isActive"
              checked={serviceData.isActive}
              onChange={handleInputChange}
              className="service-form-checkbox"
            />
            <label className="service-form-checkbox-label">
              Make this service active immediately
            </label>
            {/* Using StatusBadge to show current status */}
            <div className="service-form-status-container">
              <StatusBadge
                status={serviceData.isActive ? "active" : "inactive"}
                size="xs"
              />
            </div>
          </div>
        </div><br/>

        {/* Tags */}
        <div className="service-form-array-group">
          <label className="service-form-label">Service Tags (Optional)</label>
          {serviceData.tags.map((tag, index) => (
            <div key={index} className="service-form-array-item">
              <input
                type="text"
                value={tag}
                onChange={(e) =>
                  handleArrayChange(index, e.target.value, "tags")
                }
                placeholder="e.g., quick-service, premium, eco-friendly"
                className="service-form-input service-form-array-input"
              />
              {serviceData.tags.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, "tags")}
                  className="service-form-array-remove"
                  title="Remove tag"
                >
                  <Trash2 />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem("tags")}
            className="service-form-array-add"
          >
            <Plus />
            <span>Add Tag</span>
          </button>
        </div>

        {/* Special Instructions */}
        <div className="service-form-group">
          <label className="service-form-label">
            Special Instructions (Optional)
          </label>
          <textarea
            name="specialInstructions"
            value={serviceData.specialInstructions}
            onChange={handleInputChange}
            rows={3}
            placeholder="Any special instructions for customers or staff members..."
            className="service-form-textarea"
          />
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="service-form-submit-section">
        <button
          type="button"
          onClick={onCancel}
          className="service-form-btn service-form-btn-cancel"
        >
          <X />
          <span>Cancel</span>
        </button>
        <button
          type="submit"
          disabled={loading}
          className="service-form-btn service-form-btn-submit"
        >
          <Save />
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
