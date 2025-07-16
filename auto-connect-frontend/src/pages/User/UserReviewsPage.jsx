// src/pages/User/UserReviewsPage.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Star,
  Calendar,
  Filter,
  Edit,
  Trash2,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { UserContext } from "@contexts/UserContext";
import { toast } from "react-toastify";
import UserReviewForm from "@components/User/UserReviewForm";
import ReviewDisplayComponent from "@components/Reviews/ReviewDisplayComponent";
import "./UserReviewsPage.css";

const UserReviewsPage = () => {
  const navigate = useNavigate();
  const { userContext } = useContext(UserContext);
  const [userReviews, setUserReviews] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [activeTab, setActiveTab] = useState("submitted");

  useEffect(() => {
    fetchUserReviews();
    fetchPendingReviews();
  }, []);

  const fetchUserReviews = async () => {
    try {
      const response = await fetch("/api/v1/users/reviews", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setUserReviews(result.reviews || []);
      } else {
        toast.error("Failed to fetch your reviews");
      }
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const fetchPendingReviews = async () => {
    try {
      const response = await fetch("/api/v1/users/pending-reviews", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        setPendingReviews(result.pendingReviews || []);
      }
    } catch (error) {
      console.error("Error fetching pending reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      const url = editingReview
        ? `/api/v1/reviews/${editingReview.id}`
        : "/api/v1/reviews";

      const method = editingReview ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        toast.success(
          editingReview
            ? "Review updated successfully!"
            : "Review submitted successfully!"
        );
        setShowReviewForm(false);
        setSelectedService(null);
        setEditingReview(null);
        fetchUserReviews();
        fetchPendingReviews();
      } else {
        const result = await response.json();
        toast.error(result.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        toast.success("Review deleted successfully");
        fetchUserReviews();
      } else {
        const result = await response.json();
        toast.error(result.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setSelectedService({
      id: review.serviceId,
      serviceName: review.serviceName,
      providerName: review.providerName,
      providerId: review.serviceProviderId,
      serviceDate: review.serviceDate,
      category: review.serviceCategory,
    });
    setShowReviewForm(true);
  };

  const handleWriteReview = (service) => {
    setSelectedService(service);
    setEditingReview(null);
    setShowReviewForm(true);
  };

  const calculateAverageRating = () => {
    if (userReviews.length === 0) return 0;
    const total = userReviews.reduce(
      (sum, review) => sum + review.overallRating,
      0
    );
    return total / userReviews.length;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!userContext) {
    return (
      <div className="user-reviews-page">
        <div className="user-reviews-container">
          <div className="access-denied">
            <AlertCircle size={48} />
            <h1>Please Log In</h1>
            <p>You need to be logged in to view your reviews.</p>
            <button onClick={() => navigate("/auth")}>Go to Login</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-reviews-page">
      <div className="user-reviews-container">
        {/* Header */}
        <div className="user-reviews-header">
          <div className="header-left">
            <button
              onClick={() => navigate("/dashboard")}
              className="back-button"
            >
              <ArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
          </div>

          <div className="header-center">
            <h1 className="page-title">My Reviews</h1>
            <p className="page-subtitle">
              Manage your service reviews and feedback
            </p>
          </div>

          <div className="header-right">
            <div className="user-stats">
              <div className="stat-item">
                <span className="stat-value">{userReviews.length}</span>
                <span className="stat-label">Reviews</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">
                  {calculateAverageRating().toFixed(1)}
                </span>
                <span className="stat-label">Avg Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="reviews-tabs">
          <button
            className={`tab-button ${
              activeTab === "submitted" ? "active" : ""
            }`}
            onClick={() => setActiveTab("submitted")}
          >
            <MessageCircle size={16} />
            My Reviews ({userReviews.length})
          </button>
          <button
            className={`tab-button ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            <Clock size={16} />
            Pending ({pendingReviews.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "submitted" && (
            <div className="submitted-reviews-section">
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading your reviews...</p>
                </div>
              ) : userReviews.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Star size={48} />
                  </div>
                  <h3>No Reviews Yet</h3>
                  <p>
                    You haven't written any reviews yet. Complete a service to
                    leave your first review!
                  </p>
                </div>
              ) : (
                <div className="user-reviews-list">
                  {userReviews.map((review) => (
                    <div key={review.id} className="user-review-card">
                      <div className="review-card-header">
                        <div className="service-info">
                          <h4 className="service-name">{review.serviceName}</h4>
                          <p className="provider-name">{review.providerName}</p>
                          <div className="review-meta">
                            <Calendar size={12} />
                            <span>{formatDate(review.submittedAt)}</span>
                          </div>
                        </div>

                        <div className="review-actions">
                          <div className="review-rating">
                            <div className="stars">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  size={16}
                                  fill={
                                    star <= review.overallRating
                                      ? "#fbbf24"
                                      : "none"
                                  }
                                  color={
                                    star <= review.overallRating
                                      ? "#fbbf24"
                                      : "#d1d5db"
                                  }
                                />
                              ))}
                            </div>
                            <span className="rating-text">
                              {review.overallRating}/5
                            </span>
                          </div>

                          <div className="action-buttons">
                            <button
                              onClick={() => handleEditReview(review)}
                              className="action-button edit"
                              title="Edit review"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="action-button delete"
                              title="Delete review"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="review-content">
                        <p className="review-text">{review.reviewText}</p>

                        {review.wouldRecommend && (
                          <div className="recommendation-badge">
                            <CheckCircle size={14} />
                            <span>Recommended</span>
                          </div>
                        )}

                        {review.providerResponse && (
                          <div className="provider-response">
                            <div className="response-header">
                              <span className="response-label">
                                Provider Response:
                              </span>
                              <span className="response-date">
                                {formatDate(review.providerResponse.date)}
                              </span>
                            </div>
                            <p className="response-text">
                              {review.providerResponse.text}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "pending" && (
            <div className="pending-reviews-section">
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading pending reviews...</p>
                </div>
              ) : pendingReviews.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">
                    <Clock size={48} />
                  </div>
                  <h3>No Pending Reviews</h3>
                  <p>
                    All caught up! You don't have any services waiting for
                    reviews.
                  </p>
                </div>
              ) : (
                <div className="pending-reviews-list">
                  {pendingReviews.map((service) => (
                    <div key={service.id} className="pending-review-card">
                      <div className="service-details">
                        <h4 className="service-name">{service.serviceName}</h4>
                        <p className="provider-name">{service.providerName}</p>
                        <div className="service-meta">
                          <Calendar size={12} />
                          <span>
                            Completed on {formatDate(service.completedDate)}
                          </span>
                        </div>
                      </div>

                      <div className="pending-actions">
                        <button
                          onClick={() => handleWriteReview(service)}
                          className="write-review-button"
                        >
                          <Plus size={16} />
                          Write Review
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="review-form-overlay">
            <UserReviewForm
              serviceData={selectedService}
              onSubmit={handleSubmitReview}
              onCancel={() => {
                setShowReviewForm(false);
                setSelectedService(null);
                setEditingReview(null);
              }}
              initialData={editingReview}
              isEdit={!!editingReview}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UserReviewsPage;
