// src/components/ServiceProvider/ServiceForm.jsx - Simplified Clean Version
import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, X, CheckCircle, AlertCircle } from "lucide-react";
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
  const [touched, setTouched] = useState({});

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

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleServiceTypeChange = (e) => {
    setServiceData((prev) => ({
      ...prev,
      serviceType: e.target.value,
    }));

    setTouched((prev) => ({
      ...prev,
      serviceType: true,
    }));

    if (errors.serviceType) {
      setErrors((prev) => ({
        ...prev,
        serviceType: "",
      }));
    }
  };

  const handleMinPriceChange = (e) => {
    setServiceData((prev) => ({
      ...prev,
      minPrice: e.target.value,
    }));

    setTouched((prev) => ({
      ...prev,
      minPrice: true,
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

    setTouched((prev) => ({
      ...prev,
      maxPrice: true,
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

    setTouched((prev) => ({
      ...prev,
      [field]: true,
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

    if (!serviceData.serviceType.trim()) {
      newErrors.serviceType = "Service type is required";
    }

    if (!serviceData.category) {
      newErrors.category = "Please select a service category";
    }

    if (!serviceData.description.trim()) {
      newErrors.description = "Service description is required";
    } else if (serviceData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    } else if (serviceData.description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }

    if (!serviceData.minPrice || parseFloat(serviceData.minPrice) <= 0) {
      newErrors.minPrice = "Valid minimum price is required";
    }

    if (!serviceData.maxPrice || parseFloat(serviceData.maxPrice) <= 0) {
      newErrors.maxPrice = "Valid maximum price is required";
    }

    if (parseFloat(serviceData.minPrice) >= parseFloat(serviceData.maxPrice)) {
      newErrors.maxPrice = "Maximum price must be greater than minimum price";
    }

    if (!serviceData.duration.trim()) {
      newErrors.duration = "Expected duration is required";
    }

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
      toast.error("Please fix all validation errors before submitting");
      return;
    }

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

  const getFieldStatus = (fieldName) => {
    if (errors[fieldName]) return "error";
    if (touched[fieldName] && !errors[fieldName] && serviceData[fieldName])
      return "success";
    return "default";
  };

  return (
    <div className={`service-form ${loading ? "service-form-loading" : ""}`}>
      <form onSubmit={handleSubmit} className="service-form-content">
        {/* Basic Information Section */}
        <div className="service-form-section">
          <h3 className="service-form-section-title">Basic Information</h3>
          <p className="service-form-section-description">
            Provide the fundamental details about your service offering
          </p>

          <div className="service-form-grid">
            <div className="service-form-group">
              <label className="service-form-label required">
                Service Category
              </label>
              <div className="service-form-select-wrapper">
                <select
                  name="category"
                  value={serviceData.category}
                  onChange={handleInputChange}
                  className={`service-form-select ${getFieldStatus(
                    "category"
                  )}`}
                  aria-describedby={
                    errors.category ? "category-error" : undefined
                  }
                >
                  <option value="">Choose a service category</option>
                  {serviceCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && (
                <div className="service-form-error" id="category-error">
                  <AlertCircle size={16} />
                  {errors.category}
                </div>
              )}
              {getFieldStatus("category") === "success" && (
                <div className="service-form-success">
                  <CheckCircle size={16} />
                  Category selected
                </div>
              )}
            </div>

            <div className="service-form-group">
              <label className="service-form-label required">
                Service Type
              </label>
              <div className="service-form-select-wrapper">
                <ServiceTypeSelector
                  value={serviceData.serviceType}
                  onChange={handleServiceTypeChange}
                  category={serviceData.category}
                  error={errors.serviceType}
                  placeholder="Enter or select service type"
                  showSearch={true}
                  allowCustom={true}
                  required={true}
                  className={`service-form-select ${getFieldStatus(
                    "serviceType"
                  )}`}
                />
              </div>
              {errors.serviceType && (
                <div className="service-form-error">
                  <AlertCircle size={16} />
                  {errors.serviceType}
                </div>
              )}
              {getFieldStatus("serviceType") === "success" && (
                <div className="service-form-success">
                  <CheckCircle size={16} />
                  Service type specified
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="service-form-group service-form-grid-full">
            <label className="service-form-label required">
              Service Description
            </label>
            <div className="service-form-description-helper">
              <span>
                Provide a detailed description that helps customers understand
                exactly what your service includes
              </span>
            </div>
            <textarea
              name="description"
              value={serviceData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Example: Complete oil change service including premium synthetic oil, new oil filter, fluid level checks, and 21-point inspection. Perfect for maintaining your vehicle's engine performance and extending its lifespan..."
              className={`service-form-textarea ${getFieldStatus(
                "description"
              )}`}
              maxLength={500}
            />
            <div className="service-form-char-counter">
              {errors.description && (
                <div className="service-form-error">
                  <AlertCircle className="service-form-error-icon" />
                  {errors.description}
                </div>
              )}
              <p className="service-form-char-count">
                {serviceData.description.length}/500 characters
              </p>
            </div>
            {getFieldStatus("description") === "success" && (
              <div className="service-form-success">
                <CheckCircle className="service-form-success-icon" />
                Description looks good
              </div>
            )}
          </div>
        </div>

        {/* Pricing and Duration Section */}
        <div className="service-form-section">
          <h3 className="service-form-section-title">Pricing & Duration</h3>
          <p className="service-form-section-description">
            Set competitive pricing and realistic time expectations for your
            service
          </p>

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
              className="service-form-grid-full"
            />
          </div>

          <div className="service-form-grid">
            <div className="service-form-group">
              <label className="service-form-label required">
                Expected Duration
              </label>
              <div className="service-form-select-wrapper">
                <select
                  name="duration"
                  value={serviceData.duration}
                  onChange={handleInputChange}
                  className={`service-form-select ${getFieldStatus(
                    "duration"
                  )}`}
                >
                  <option value="">Select estimated duration</option>
                  {durationOptions.map((duration) => (
                    <option key={duration} value={duration}>
                      {duration}
                    </option>
                  ))}
                </select>
              </div>
              {errors.duration && (
                <div className="service-form-error">
                  <AlertCircle size={16} />
                  {errors.duration}
                </div>
              )}
              {getFieldStatus("duration") === "success" && (
                <div className="service-form-success">
                  <CheckCircle size={16} />
                  Duration set
                </div>
              )}
            </div>

            <div className="service-form-group">
              <label className="service-form-label">
                Price Note (Optional)
              </label>
              <input
                type="text"
                name="priceNote"
                value={serviceData.priceNote}
                onChange={handleInputChange}
                placeholder="e.g., Price varies based on vehicle type and oil grade"
                className="service-form-input"
                maxLength={100}
              />
              <div className="service-form-helper-text">
                Add any important pricing information for customers
              </div>
            </div>
          </div>
        </div>

        {/* Service Details Section */}
        <div className="service-form-section">
          <h3 className="service-form-section-title">Service Details</h3>
          <p className="service-form-section-description">
            Specify what customers need to bring and what's included in your
            service
          </p>

          {/* Requirements */}
          <div className="service-form-array-group">
            <label className="service-form-label required">
              Customer Requirements
            </label>
            <div className="service-form-helper-text">
              What should customers bring or prepare before the service?
            </div>
            {serviceData.requirements.map((req, index) => (
              <div key={index} className="service-form-array-item">
                <input
                  type="text"
                  value={req}
                  onChange={(e) =>
                    handleArrayChange(index, e.target.value, "requirements")
                  }
                  placeholder={`Requirement ${
                    index + 1
                  }: e.g., Vehicle registration documents`}
                  className="service-form-input service-form-array-input"
                  maxLength={100}
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
              <span>Add Another Requirement</span>
            </button>
            {errors.requirements && (
              <div className="service-form-error">
                <AlertCircle className="service-form-error-icon" />
                {errors.requirements}
              </div>
            )}
          </div>

          {/* Included Items */}
          <div className="service-form-array-group">
            <label className="service-form-label required">
              What's Included
            </label>
            <div className="service-form-helper-text">
              List everything that's included in your service package
            </div>
            {serviceData.includedItems.map((item, index) => (
              <div key={index} className="service-form-array-item">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayChange(index, e.target.value, "includedItems")
                  }
                  placeholder={`Included ${
                    index + 1
                  }: e.g., Premium synthetic oil and new filter`}
                  className="service-form-input service-form-array-input"
                  maxLength={100}
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
              <div className="service-form-error">
                <AlertCircle className="service-form-error-icon" />
                {errors.includedItems}
              </div>
            )}
          </div>

          {/* Excluded Items */}
          <div className="service-form-array-group">
            <label className="service-form-label">
              What's NOT Included (Optional)
            </label>
            <div className="service-form-helper-text">
              Clarify what's not covered to set proper expectations
            </div>
            {serviceData.excludedItems.map((item, index) => (
              <div key={index} className="service-form-array-item">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayChange(index, e.target.value, "excludedItems")
                  }
                  placeholder={`Excluded ${
                    index + 1
                  }: e.g., Additional parts if damage is found`}
                  className="service-form-input service-form-array-input"
                  maxLength={100}
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
              <span>Add Exclusion</span>
            </button>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="service-form-section">
          <h3 className="service-form-section-title">Additional Information</h3>
          <p className="service-form-section-description">
            Add warranty details, tags, and special instructions to complete
            your service listing
          </p>

          <div className="service-form-grid">
            <div className="service-form-group">
              <label className="service-form-label">Warranty Period</label>
              <div className="service-form-select-wrapper">
                <select
                  name="warrantyPeriod"
                  value={serviceData.warrantyPeriod}
                  onChange={handleInputChange}
                  className="service-form-select"
                >
                  <option value="">Select warranty period</option>
                  {warrantyOptions.map((warranty) => (
                    <option key={warranty} value={warranty}>
                      {warranty}
                    </option>
                  ))}
                </select>
              </div>
              <div className="service-form-helper-text">
                Offering a warranty builds customer trust and confidence
              </div>
            </div>

            <div className="service-form-group">
              <div className="service-form-checkbox-group">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={serviceData.isActive}
                  onChange={handleInputChange}
                  className="service-form-checkbox"
                  id="service-active-toggle"
                />
                <label
                  htmlFor="service-active-toggle"
                  className="service-form-checkbox-label"
                >
                  Make this service active immediately
                </label>
                <div className="service-form-status-container">
                  <StatusBadge
                    status={serviceData.isActive ? "active" : "inactive"}
                    size="sm"
                  />
                </div>
              </div>
              <div className="service-form-helper-text">
                Active services will be visible to customers right away
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="service-form-array-group">
            <label className="service-form-label">
              Service Tags (Optional)
            </label>
            <div className="service-form-helper-text">
              Add tags to help customers find your service more easily
            </div>
            {serviceData.tags.map((tag, index) => (
              <div key={index} className="service-form-array-item">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) =>
                    handleArrayChange(index, e.target.value, "tags")
                  }
                  placeholder={`Tag ${
                    index + 1
                  }: e.g., quick-service, premium, eco-friendly`}
                  className="service-form-input service-form-array-input"
                  maxLength={30}
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
          <div className="service-form-group service-form-grid-full">
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
              maxLength={300}
            />
            <div className="service-form-helper-text">
              Add any important notes or special procedures for this service
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="service-form-submit-section">
          <button
            type="button"
            onClick={onCancel}
            className="service-form-btn service-form-btn-cancel"
            disabled={loading}
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
                  ? "Updating Service..."
                  : "Adding Service..."
                : isEdit
                ? "Update Service"
                : "Add Service"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;
