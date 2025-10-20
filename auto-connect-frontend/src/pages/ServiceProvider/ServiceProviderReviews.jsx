// src/pages/ServiceProvider/ServiceProviderReviews.jsx
import React, { useState, useEffect } from "react";
import reviewsAPI from "../../services/reviewsApi.js";
import "./ServiceProviderReviews.css";

const ServiceProviderReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalResults: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 20,
  });
  const [filters, setFilters] = useState({
    rating: "",
    minRating: "",
    dateFrom: "",
    dateTo: "",
  });

  // Fetch reviews
  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page,
        limit: pagination.limit,
        ...filters,
      };

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === null) {
          delete params[key];
        }
      });

      console.log("=== FETCHING REVIEWS ===");
      console.log("Params:", params);

      const response = await reviewsAPI.getMyReviews(params);

      console.log("=== REVIEWS RESPONSE ===");
      console.log("Response:", response);

      if (response.success && response.data) {
        setReviews(response.data.reviews || []);
        setStats(response.data.stats || stats);
        setPagination(response.data.pagination || pagination);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchReviews(1);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      rating: "",
      minRating: "",
      dateFrom: "",
      dateTo: "",
    });
    setTimeout(() => fetchReviews(1), 100);
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "star filled" : "star"}
          >
            &#9733;
          </span>
        ))}
      </div>
    );
  };

  // Render rating bar
  const renderRatingBar = (stars, count, percentage) => {
    return (
      <div className="rating-bar-container" key={stars}>
        <div className="rating-bar-label">
          {stars} {renderStars(stars)}
        </div>
        <div className="rating-bar">
          <div
            className="rating-bar-fill"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="rating-bar-count">
          {count} ({percentage}%)
        </div>
      </div>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <h1>Customer Reviews</h1>
        <p>View and analyze feedback from your customers</p>
      </div>

      {/* Rating Overview Section */}
      <div className="rating-overview">
        <div className="rating-summary">
          <div className="average-rating">
            <h2>{stats.averageRating.toFixed(1)}</h2>
            {renderStars(Math.round(stats.averageRating))}
            <p>{stats.totalReviews} total reviews</p>
          </div>
        </div>

        <div className="rating-distribution">
          {[5, 4, 3, 2, 1].map((stars) =>
            renderRatingBar(
              stars,
              stats.distribution[stars],
              stats.percentages[stars]
            )
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <div className="filter-group">
          <label htmlFor="rating">Exact Rating:</label>
          <select
            id="rating"
            name="rating"
            value={filters.rating}
            onChange={handleFilterChange}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="minRating">Minimum Rating:</label>
          <select
            id="minRating"
            name="minRating"
            value={filters.minRating}
            onChange={handleFilterChange}
          >
            <option value="">No Minimum</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="dateFrom">From Date:</label>
          <input
            type="date"
            id="dateFrom"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="dateTo">To Date:</label>
          <input
            type="date"
            id="dateTo"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-actions">
          <button className="apply-btn" onClick={applyFilters}>
            Apply Filters
          </button>
          <button className="clear-btn" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={() => fetchReviews()}>Retry</button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="empty-state">
            <h3>No reviews found</h3>
            <p>You don't have any reviews yet. Complete some bookings to start receiving feedback!</p>
          </div>
        ) : (
          <>
            <div className="reviews-list">
              {reviews.map((review) => (
                <div className="review-card" key={review.id}>
                  <div className="review-header">
                    <div className="customer-info">
                      <h3>{review.customerName}</h3>
                      <p className="customer-email">{review.customerEmail}</p>
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                      <span className="rating-number">{review.rating}/5</span>
                    </div>
                  </div>

                  <div className="review-content">
                    <div className="vehicle-info">
                      <span className="info-label">Vehicle:</span>
                      <span className="info-value">
                        {review.vehicle.registrationNumber} - {review.vehicle.make}{" "}
                        {review.vehicle.model} ({review.vehicle.year})
                      </span>
                    </div>

                    <div className="services-info">
                      <span className="info-label">Services:</span>
                      <div className="services-list">
                        {review.services.map((service, index) => (
                          <span key={index} className="service-tag">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    {review.comment && (
                      <div className="review-comment">
                        <span className="info-label">Comment:</span>
                        <p>{review.comment}</p>
                      </div>
                    )}

                    <div className="review-footer">
                      <div className="review-meta">
                        <span className="booking-id">
                          Booking: {review.bookingId}
                        </span>
                        <span className="review-date">
                          {formatDate(review.submittedAt)}
                        </span>
                      </div>
                      <div className="review-cost">
                        Cost: Rs. {review.finalCost.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => fetchReviews(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                >
                  Previous
                </button>

                <div className="pagination-info">
                  Page {pagination.currentPage} of {pagination.totalPages}
                  <span className="results-count">
                    ({pagination.totalResults} total reviews)
                  </span>
                </div>

                <button
                  className="pagination-btn"
                  onClick={() => fetchReviews(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderReviews;
