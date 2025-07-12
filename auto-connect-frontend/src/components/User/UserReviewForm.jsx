// src/components/User/UserReviewForm.jsx
import React, { useState } from "react";
import {
  Star,
  StarHalf,
  Send,
  X,
  ThumbsUp,
  ThumbsDown,
  Clock,
  DollarSign,
  User,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import "./UserReviewForm.css";

const UserReviewForm = ({
  serviceData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [reviewData, setReviewData] = useState({
    overallRating: 0,
    serviceQuality: 0,
    timeliness: 0,
    valueForMoney: 0,
    communication: 0,
    reviewText: "",
    wouldRecommend: true,
    serviceCategory: serviceData?.category || "",
    anonymous: false,
  });

  const [hoveredRating, setHoveredRating] = useState({});
  const [errors, setErrors] = useState({});

  const ratingCategories = [
    {
      key: "overallRating",
      label: "Overall Experience",
      icon: <Star size={20} />,
      description: "How would you rate your overall experience?",
    },
    {
      key: "serviceQuality",
      label: "Service Quality",
      icon: <CheckCircle size={20} />,
      description: "Quality of work performed",
    },
    {
      key: "timeliness",
      label: "Timeliness",
      icon: <Clock size={20} />,
      description: "Was the service completed on time?",
    },
    {
      key: "valueForMoney",
      label: "Value for Money",
      icon: <DollarSign size={20} />,
      description: "Was the service worth the price paid?",
    },
    {
      key: "communication",
      label: "Communication",
      icon: <User size={20} />,
      description: "How was the communication with the provider?",
    },
  ];

  const handleRatingChange = (category, rating) => {
    setReviewData((prev) => ({
      ...prev,
      [category]: rating,
    }));

    if (errors[category]) {
      setErrors((prev) => ({
        ...prev,
        [category]: "",
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setReviewData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (reviewData.overallRating === 0) {
      newErrors.overallRating = "Please provide an overall rating";
    }

    if (reviewData.serviceQuality === 0) {
      newErrors.serviceQuality = "Please rate the service quality";
    }

    if (reviewData.timeliness === 0) {
      newErrors.timeliness = "Please rate the timeliness";
    }

    if (reviewData.valueForMoney === 0) {
      newErrors.valueForMoney = "Please rate the value for money";
    }

    if (reviewData.communication === 0) {
      newErrors.communication = "Please rate the communication";
    }

    if (!reviewData.reviewText.trim()) {
      newErrors.reviewText = "Please write a review comment";
    } else if (reviewData.reviewText.length < 20) {
      newErrors.reviewText = "Review must be at least 20 characters long";
    } else if (reviewData.reviewText.length > 1000) {
      newErrors.reviewText = "Review cannot exceed 1000 characters";
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

    const submissionData = {
      ...reviewData,
      serviceId: serviceData.id,
      serviceProviderId: serviceData.providerId,
      submittedAt: new Date().toISOString(),
    };

    onSubmit(submissionData);
  };

  const renderStarRating = (category, currentRating) => {
    const hovered = hoveredRating[category] || 0;
    const displayRating = hovered || currentRating;

    return (
      <div className="star-rating-container">
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`star-button ${star <= displayRating ? "active" : ""}`}
              onMouseEnter={() =>
                setHoveredRating((prev) => ({ ...prev, [category]: star }))
              }
              onMouseLeave={() =>
                setHoveredRating((prev) => ({ ...prev, [category]: 0 }))
              }
              onClick={() => handleRatingChange(category, star)}
            >
              <Star
                size={24}
                fill={star <= displayRating ? "currentColor" : "none"}
              />
            </button>
          ))}
        </div>
        <span className="rating-text">
          {displayRating > 0 && (
            <>
              {displayRating}/5
              {displayRating === 1 && " - Poor"}
              {displayRating === 2 && " - Fair"}
              {displayRating === 3 && " - Good"}
              {displayRating === 4 && " - Very Good"}
              {displayRating === 5 && " - Excellent"}
            </>
          )}
        </span>
      </div>
    );
  };

  return (
    <div className={`user-review-form ${loading ? "loading" : ""}`}>
      <div className="review-form-header">
        <div className="review-form-title-section">
          <h2 className="review-form-title">Share Your Experience</h2>
          <p className="review-form-subtitle">
            Help others by sharing your experience with{" "}
            {serviceData?.providerName}
          </p>
        </div><br/>
        <button
          type="button"
          className="review-form-close"
          onClick={onCancel}
          disabled={loading}
        >
          <X size={24} />
        </button>
      </div><br/>

      {serviceData && (
        <div className="service-info-card">
          <div className="service-info-content">
            <h3 className="service-info-title">{serviceData.serviceName}</h3>
            <p className="service-info-provider">{serviceData.providerName}</p>
            <p className="service-info-date">
              Service Date:{" "}
              {new Date(serviceData.serviceDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="review-form">
        {/* Rating Sections */}
        <div className="rating-sections">
          {ratingCategories.map((category) => (
            <div key={category.key} className="rating-section">
              <div className="rating-header">
                <div className="rating-label">
                  {category.icon}
                  <span>{category.label}</span>
                </div>
                <p className="rating-description">{category.description}</p>
              </div>

              {renderStarRating(category.key, reviewData[category.key])}

              {errors[category.key] && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  {errors[category.key]}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Written Review */}
        <div className="review-text-section">
          <label className="review-text-label">
            Share Your Experience
            <span className="required">*</span>
          </label>
          <p className="review-text-description">
            Tell others about your experience with this service provider
          </p>
          <textarea
            name="reviewText"
            value={reviewData.reviewText}
            onChange={handleInputChange}
            placeholder="What was your experience like? How was the service quality, communication, and overall satisfaction? Your detailed feedback helps other customers make informed decisions..."
            className={`review-textarea ${errors.reviewText ? "error" : ""}`}
            rows={5}
            maxLength={1000}
            disabled={loading}
          />
          <div className="review-text-footer">
            {errors.reviewText && (
              <div className="error-message">
                <AlertCircle size={16} />
                {errors.reviewText}
              </div>
            )}
            <span className="character-count">
              {reviewData.reviewText.length}/1000
            </span>
          </div>
        </div>

        {/* Recommendation */}
        <div className="recommendation-section">
          <label className="recommendation-label">
            Would you recommend this service provider?
          </label>
          <div className="recommendation-buttons">
            <button
              type="button"
              className={`recommendation-btn ${
                reviewData.wouldRecommend ? "active" : ""
              }`}
              onClick={() =>
                setReviewData((prev) => ({ ...prev, wouldRecommend: true }))
              }
              disabled={loading}
            >
              <ThumbsUp size={20} />
              Yes, I recommend
            </button>
            <button
              type="button"
              className={`recommendation-btn ${
                !reviewData.wouldRecommend ? "active" : ""
              }`}
              onClick={() =>
                setReviewData((prev) => ({ ...prev, wouldRecommend: false }))
              }
              disabled={loading}
            >
              <ThumbsDown size={20} />
              No, I don't recommend
            </button>
          </div>
        </div>

        {/* Privacy Option */}
        <div className="privacy-section">
          <label className="privacy-checkbox">
            <input
              type="checkbox"
              name="anonymous"
              checked={reviewData.anonymous}
              onChange={handleInputChange}
              disabled={loading}
            />
            <span className="checkmark"></span>
            Post this review anonymously
          </label>
          <p className="privacy-note">
            Your review will be posted without your name if checked
          </p>
        </div>

        {/* Submit Buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            <Send size={20} />
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserReviewForm;
