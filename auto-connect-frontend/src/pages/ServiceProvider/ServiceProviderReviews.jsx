// src/pages/ServiceProvider/ServiceProviderReviews.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  MessageSquare,
  Filter,
  Download,
  Calendar,
  Users,
  Target,
  Award,
} from "lucide-react";
import { UserContext } from "@contexts/UserContext";
import { toast } from "react-toastify";
import ReviewDisplayComponent from "@components/Reviews/ReviewDisplayComponent";
import "./ServiceProviderReviews.css";

const ServiceProviderReviews = () => {
  const navigate = useNavigate();
  const { userContext } = useContext(UserContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    recommendationRate: 0,
    responseRate: 0,
    monthlyTrend: 0,
  });
  const [timeFilter, setTimeFilter] = useState("all");
  const [responseModal, setResponseModal] = useState({
    show: false,
    review: null,
  });
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    fetchReviews();
    fetchStats();
  }, [timeFilter]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/v1/service-providers/reviews?timeFilter=${timeFilter}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await response.json();
      if (response.ok) {
        setReviews(result.reviews || []);
      } else {
        toast.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        `/api/v1/service-providers/review-stats?timeFilter=${timeFilter}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await response.json();
      if (response.ok) {
        setStats(result.stats || {});
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleRespondToReview = async () => {
    if (!responseText.trim()) {
      toast.error("Please enter a response");
      return;
    }

    try {
      const response = await fetch(
        `/api/v1/reviews/${responseModal.review.id}/respond`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            responseText: responseText.trim(),
          }),
        }
      );

      if (response.ok) {
        toast.success("Response submitted successfully");
        setResponseModal({ show: false, review: null });
        setResponseText("");
        fetchReviews(); // Refresh reviews
      } else {
        const result = await response.json();
        toast.error(result.message || "Failed to submit response");
      }
    } catch (error) {
      console.error("Error submitting response:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const exportReviews = async () => {
    try {
      const response = await fetch(
        `/api/v1/service-providers/reviews/export?timeFilter=${timeFilter}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reviews-${timeFilter}-${
          new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        toast.success("Reviews exported successfully");
      } else {
        toast.error("Failed to export reviews");
      }
    } catch (error) {
      console.error("Error exporting reviews:", error);
      toast.error("Export failed. Please try again.");
    }
  };

  // Check if user has permission to view reviews
  if (
    !userContext ||
    !["service_center", "repair_center"].includes(userContext.role)
  ) {
    return (
      <div className="reviews-page">
        <div className="reviews-container">
          <div className="access-denied">
            <div className="access-denied-icon">
              <AlertCircle size={48} />
            </div>
            <h1 className="access-denied-title">Access Denied</h1>
            <p className="access-denied-text">
              You don't have permission to view reviews. This feature is only
              available for service centers and repair centers.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="access-denied-button"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reviews-page">
      <div className="reviews-container">
        {/* Header */}
        <div className="reviews-header">
          <div className="reviews-header-left">
            <button
              onClick={() => navigate("/dashboard/service-provider")}
              className="back-button"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
          </div>

          <div className="reviews-header-center">
            <h1 className="reviews-title">Customer Reviews</h1>
            <p className="reviews-subtitle">
              Monitor and respond to customer feedback
            </p>
          </div>

          <div className="reviews-header-right">
            <button
              onClick={exportReviews}
              className="export-button"
              disabled={loading}
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="stats-dashboard">
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-icon">
                <Star size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {stats.averageRating?.toFixed(1) || "0.0"}
                </div>
                <div className="stat-label">Average Rating</div>
                <div className="stat-trend">
                  {stats.monthlyTrend > 0 ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  <span>
                    {Math.abs(stats.monthlyTrend || 0).toFixed(1)}% this month
                  </span>
                </div>
              </div>
            </div>

            <div className="stat-card secondary">
              <div className="stat-icon">
                <Users size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.totalReviews || 0}</div>
                <div className="stat-label">Total Reviews</div>
                <div className="stat-description">All time feedback</div>
              </div>
            </div>

            <div className="stat-card success">
              <div className="stat-icon">
                <Target size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {stats.recommendationRate || 0}%
                </div>
                <div className="stat-label">Recommendation Rate</div>
                <div className="stat-description">Customers who recommend</div>
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-icon">
                <MessageSquare size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.responseRate || 0}%</div>
                <div className="stat-label">Response Rate</div>
                <div className="stat-description">Reviews responded to</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="reviews-filters-section">
          <div className="filter-group">
            <Filter size={16} />
            <span className="filter-label">Time Period:</span>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="time-filter-select"
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 3 Months</option>
              <option value="year">Last Year</option>
            </select>
          </div>

          <div className="provider-info">
            <div className="provider-avatar">
              {userContext?.firstName?.charAt(0)}
              {userContext?.lastName?.charAt(0)}
            </div>
            <div className="provider-details">
              <span className="provider-name">
                {userContext?.businessInfo?.businessName ||
                  `${userContext?.firstName} ${userContext?.lastName}`}
              </span>
              <span className="provider-role">
                {userContext?.role?.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Reviews Display */}
        <div className="reviews-display-section">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading reviews...</p>
            </div>
          ) : (
            <ReviewDisplayComponent
              reviews={reviews.map((review) => ({
                ...review,
                providerResponse: review.response
                  ? {
                      text: review.response.text,
                      date: review.response.submittedAt,
                    }
                  : null,
              }))}
              averageRating={stats.averageRating || 0}
              totalReviews={stats.totalReviews || 0}
              showFilters={true}
              showSummary={true}
              isServiceProvider={true}
            />
          )}
        </div>

        {/* Response Modal */}
        {responseModal.show && (
          <div className="response-modal-overlay">
            <div className="response-modal">
              <div className="response-modal-header">
                <h3>Respond to Review</h3>
                <button
                  onClick={() =>
                    setResponseModal({ show: false, review: null })
                  }
                  className="response-modal-close"
                >
                  ×
                </button>
              </div>

              <div className="response-modal-content">
                <div className="original-review">
                  <div className="review-summary">
                    <div className="review-stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={16}
                          fill={
                            star <= responseModal.review?.overallRating
                              ? "#fbbf24"
                              : "none"
                          }
                          color={
                            star <= responseModal.review?.overallRating
                              ? "#fbbf24"
                              : "#d1d5db"
                          }
                        />
                      ))}
                    </div>
                    <span className="reviewer-name">
                      {responseModal.review?.anonymous
                        ? "Anonymous"
                        : responseModal.review?.reviewerName}
                    </span>
                  </div>
                  <p className="review-text">
                    {responseModal.review?.reviewText}
                  </p>
                </div>

                <div className="response-form">
                  <label className="response-label">Your Response:</label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Thank you for your feedback. We appreciate..."
                    className="response-textarea"
                    rows={4}
                    maxLength={500}
                  />
                  <div className="response-footer">
                    <span className="char-count">
                      {responseText.length}/500
                    </span>
                  </div>
                </div>
              </div>

              <div className="response-modal-actions">
                <button
                  onClick={() =>
                    setResponseModal({ show: false, review: null })
                  }
                  className="response-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRespondToReview}
                  className="response-submit-btn"
                  disabled={!responseText.trim()}
                >
                  Submit Response
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <button
            onClick={() => navigate("/dashboard/service-provider/services")}
            className="quick-action"
          >
            Manage Services
          </button>
          <span className="quick-separator">•</span>
          <button
            onClick={() => navigate("/dashboard/service-provider/analytics")}
            className="quick-action"
          >
            View Analytics
          </button>
          <span className="quick-separator">•</span>
          <button
            onClick={() => navigate("/dashboard")}
            className="quick-action"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderReviews;
