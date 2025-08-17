// src/services/bookingApiService.js
import { toast } from "react-toastify";

// Base configuration
const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_API_URL ||
  import.meta.env.REACT_APP_BACKEND_URL + "/api/v1" ||
  "http://localhost:3000/api/v1";

const BOOKINGS_ENDPOINT = `${API_BASE_URL}/bookings`;

// Utility function to get auth token
const getAuthToken = () => {
  return (
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

// Utility function to handle API responses
const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Failed to parse server response");
  }

  if (!response.ok) {
    // Handle different HTTP status codes
    switch (response.status) {
      case 401:
        // Unauthorized - redirect to login or refresh token
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        window.location.href = "/auth/login";
        throw new Error("Session expired. Please log in again.");
      case 403:
        throw new Error("You don't have permission to perform this action.");
      case 404:
        throw new Error("The requested resource was not found.");
      case 409:
        throw new Error(data.message || "Conflict occurred.");
      case 422:
        throw new Error(data.message || "Validation failed.");
      case 500:
        throw new Error("Server error. Please try again later.");
      default:
        throw new Error(
          data.message || `Request failed with status ${response.status}`
        );
    }
  }

  return data;
};

// Success handler
const handleBookingSuccess = (data, action) => {
  const message = data.message || `Booking ${action} successfully`;
  toast.success(message);
  return data;
};

// Error handler
const handleBookingError = (error, action) => {
  const message = error.message || `Failed to ${action} booking`;
  toast.error(message);
  console.error(`Error ${action} booking:`, error);
};

// Booking API endpoints
const bookingAPI = {
  // Get user's bookings (works for both vehicle owners and service centers)
  getBookings: async (params = {}) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });

      const url = `${BOOKINGS_ENDPOINT}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      handleBookingError(error, "fetch bookings");
      throw error;
    }
  },

  // Get specific booking details
  getBooking: async (id) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${BOOKINGS_ENDPOINT}/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      handleBookingError(error, "fetch booking details");
      throw error;
    }
  },

  // Create new booking (Vehicle owners only)
  createBooking: async (bookingData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(BOOKINGS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await handleResponse(response);
      return handleBookingSuccess(data, "created");
    } catch (error) {
      handleBookingError(error, "create");
      throw error;
    }
  },

  // Update booking status (Service centers only)
  updateBookingStatus: async (id, statusData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${BOOKINGS_ENDPOINT}/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(statusData),
      });

      const data = await handleResponse(response);
      return handleBookingSuccess(data, "updated");
    } catch (error) {
      handleBookingError(error, "update status");
      throw error;
    }
  },

  // Cancel booking (Vehicle owners only)
  cancelBooking: async (id, reason) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${BOOKINGS_ENDPOINT}/${id}/cancel`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const data = await handleResponse(response);
      return handleBookingSuccess(data, "cancelled");
    } catch (error) {
      handleBookingError(error, "cancel");
      throw error;
    }
  },

  // Submit feedback (Vehicle owners only)
  submitFeedback: async (id, feedbackData) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${BOOKINGS_ENDPOINT}/${id}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(feedbackData),
      });

      const data = await handleResponse(response);
      return handleBookingSuccess(data, "feedback submitted");
    } catch (error) {
      handleBookingError(error, "submit feedback");
      throw error;
    }
  },

  // Get booking statistics
  getBookingStats: async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${BOOKINGS_ENDPOINT}/stats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      handleBookingError(error, "fetch booking statistics");
      throw error;
    }
  },

  // Get available time slots
  getAvailableTimeSlots: async (serviceCenterId, date) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const queryParams = new URLSearchParams({
        serviceCenterId,
        date,
      });

      const response = await fetch(
        `${BOOKINGS_ENDPOINT}/available-slots?${queryParams.toString()}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return await handleResponse(response);
    } catch (error) {
      handleBookingError(error, "fetch available time slots");
      throw error;
    }
  },
};

export default bookingAPI;
