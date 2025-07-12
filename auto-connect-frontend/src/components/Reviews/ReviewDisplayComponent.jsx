// src/components/Reviews/ReviewDisplayComponent.jsx
import React, { useState } from "react";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  Flag,
  CheckCircle,
  Clock,
  DollarSign,
  User,
  Filter,
  TrendingUp,
  Calendar,
} from "lucide-react";
import "./ReviewDisplayComponent.css";

const ReviewDisplayComponent = ({
  reviews = [],
  averageRating = 0,
  totalReviews = 0,
  showFilters = true,
  showSummary = true,
  isServiceProvider = false,
}) => {
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showOnlyRecommended, setShowOnlyRecommended] = useState(false);

  // Calculate rating distribution
  const ratingDistribution = {
    5: reviews.filter((r) => r.overallRating === 5).length,
    4: reviews.filter((r) => r.overallRating === 4).length,
    3: reviews.filter((r) => r.overallRating === 3).length,
    2: reviews.filter((r) => r.overallRating === 2).length,
    1: reviews.filter((r) => r.overallRating === 1).length,
  };

  // Calculate category averages
  const categoryAverages = {
    serviceQuality:
      reviews.reduce((sum, r) => sum + r.serviceQuality, 0) / reviews.length ||
      0,
    timeliness:
      reviews.reduce((sum, r) => sum + r.timeliness, 0) / reviews.length || 0,
    valueForMoney:
      reviews.reduce((sum, r) => sum + r.valueForMoney, 0) / reviews.length ||
      0,
    communication:
      reviews.reduce((sum, r) => sum + r.communication, 0) / reviews.length ||
      0,
  };

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((review) => {
      if (
        filterRating !== "all" &&
        review.overallRating !== parseInt(filterRating)
      ) {
        return false;
      }
      if (showOnlyRecommended && !review.wouldRecommend) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.submittedAt) - new Date(a.submittedAt);
        case "oldest":
          return new Date(a.submittedAt) - new Date(b.submittedAt);
        case "highest":
          return b.overallRating - a.overallRating;
        case "lowest":
          return a.overallRating - b.overallRating;
        default:
          return 0;
      }
    });

  const renderStars = (rating, size = 16) => (
    <div className="star-display">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          fill={star <= rating ? "#fbbf24" : "none"}
          color={star <= rating ? "#fbbf24" : "#d1d5db"}
        />
      ))}
    </div>
  );

  const renderRatingBar = (rating, count) => {
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

    return (
      <div className="rating-bar-container">
        <span className="rating-label">{rating}</span>
        <div className="star-small">
          <Star size={12} fill="#fbbf24" color="#fbbf24" />
        </div>
        <div className="rating-bar">
          <div
            className="rating-bar-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="rating-count">{count}</span>
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="review-display-container">
      {/* Review Summary */}
      {showSummary && (
        <div className="review-summary">
          <div className="summary-main">
            <div className="summary-rating">
              <div className="average-rating">
                <span className="rating-number">
                  {averageRating.toFixed(1)}
                </span>
                {renderStars(Math.round(averageRating), 24)}
              </div>
              <p className="rating-text">
                Based on {totalReviews} review{totalReviews !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="rating-breakdown">
              {[5, 4, 3, 2, 1].map((rating) =>
                renderRatingBar(rating, ratingDistribution[rating])
              )}
            </div>
          </div>

          {/* Category Ratings */}
          <div className="category-ratings">
            <h4 className="category-title">Rating Breakdown</h4>
            <div className="category-grid">
              <div className="category-item">
                <div className="category-header">
                  <CheckCircle size={16} />
                  <span>Service Quality</span>
                </div>
                <div className="category-rating">
                  {renderStars(Math.round(categoryAverages.serviceQuality), 14)}
                  <span>{categoryAverages.serviceQuality.toFixed(1)}</span>
                </div>
              </div>

              <div className="category-item">
                <div className="category-header">
                  <Clock size={16} />
                  <span>Timeliness</span>
                </div>
                <div className="category-rating">
                  {renderStars(Math.round(categoryAverages.timeliness), 14)}
                  <span>{categoryAverages.timeliness.toFixed(1)}</span>
                </div>
              </div>

              <div className="category-item">
                <div className="category-header">
                  <DollarSign size={16} />
                  <span>Value for Money</span>
                </div>
                <div className="category-rating">
                  {renderStars(Math.round(categoryAverages.valueForMoney), 14)}
                  <span>{categoryAverages.valueForMoney.toFixed(1)}</span>
                </div>
              </div>

              <div className="category-item">
                <div className="category-header">
                  <User size={16} />
                  <span>Communication</span>
                </div>
                <div className="category-rating">
                  {renderStars(Math.round(categoryAverages.communication), 14)}
                  <span>{categoryAverages.communication.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      {showFilters && (
        <div className="review-filters">
          <div className="filter-group">
            <Filter size={16} />
            <span className="filter-label">Filter by:</span>

            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>

            <label className="filter-checkbox">
              <input
                type="checkbox"
                checked={showOnlyRecommended}
                onChange={(e) => setShowOnlyRecommended(e.target.checked)}
              />
              Recommended only
            </label>
          </div>

          <div className="sort-group">
            <TrendingUp size={16} />
            <span className="sort-label">Sort by:</span>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
            </select>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {filteredReviews.length === 0 ? (
          <div className="no-reviews">
            <div className="no-reviews-icon">
              <Star size={48} color="#d1d5db" />
            </div>
            <h3>No Reviews Found</h3>
            <p>
              No reviews match your current filters. Try adjusting your filter
              criteria.
            </p>
          </div>
        ) : (
          filteredReviews.map((review, index) => (
            <div key={review.id || index} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="reviewer-avatar">
                    {review.anonymous ? "A" : review.reviewerName?.[0] || "U"}
                  </div>
                  <div className="reviewer-details">
                    <h4 className="reviewer-name">
                      {review.anonymous
                        ? "Anonymous User"
                        : review.reviewerName}
                    </h4>
                    <div className="review-meta">
                      <Calendar size={12} />
                      <span>{formatDate(review.submittedAt)}</span>
                      {review.verified && (
                        <>
                          <span className="meta-separator">•</span>
                          <CheckCircle size={12} />
                          <span>Verified</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="review-actions">
                  <div className="review-rating">
                    {renderStars(review.overallRating, 16)}
                    <span className="rating-value">
                      {review.overallRating}/5
                    </span>
                  </div>

                  {!isServiceProvider && (
                    <button className="review-menu-btn">
                      <MoreHorizontal size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="review-content">
                <div className="review-text">
                  <p>{review.reviewText}</p>
                </div>

                {/* Category Ratings */}
                <div className="review-categories">
                  <div className="review-category">
                    <span className="category-name">Quality</span>
                    {renderStars(review.serviceQuality, 12)}
                  </div>
                  <div className="review-category">
                    <span className="category-name">Timeliness</span>
                    {renderStars(review.timeliness, 12)}
                  </div>
                  <div className="review-category">
                    <span className="category-name">Value</span>
                    {renderStars(review.valueForMoney, 12)}
                  </div>
                  <div className="review-category">
                    <span className="category-name">Communication</span>
                    {renderStars(review.communication, 12)}
                  </div>
                </div>

                {/* Recommendation */}
                <div className="review-recommendation">
                  {review.wouldRecommend ? (
                    <div className="recommendation-positive">
                      <ThumbsUp size={14} />
                      <span>Recommends this service provider</span>
                    </div>
                  ) : (
                    <div className="recommendation-negative">
                      <ThumbsDown size={14} />
                      <span>Does not recommend this service provider</span>
                    </div>
                  )}
                </div>

                {/* Service Provider Response */}
                {isServiceProvider && review.providerResponse && (
                  <div className="provider-response">
                    <div className="response-header">
                      <div className="response-avatar">
                        {review.providerName?.[0] || "P"}
                      </div>
                      <div className="response-info">
                        <span className="response-name">
                          Response from {review.providerName}
                        </span>
                        <span className="response-date">
                          {formatDate(review.providerResponse.date)}
                        </span>
                      </div>
                    </div>
                    <p className="response-text">
                      {review.providerResponse.text}
                    </p>
                  </div>
                )}

                {/* Review Actions */}
                {!isServiceProvider && (
                  <div className="review-footer">
                    <button className="review-action-btn helpful">
                      <ThumbsUp size={14} />
                      Helpful ({review.helpfulCount || 0})
                    </button>
                    <button className="review-action-btn report">
                      <Flag size={14} />
                      Report
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredReviews.length > 0 && filteredReviews.length < totalReviews && (
        <div className="load-more-container">
          <button className="load-more-btn">Load More Reviews</button>
        </div>
      )}
    </div>
  );
};

export default ReviewDisplayComponent;
