// src/services/bookingApi.js
import axios from "axios";
import { toast } from "react-toastify";

// Create axios instance for booking API
const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_API_URL ||
  import.meta.env.REACT_APP_BACKEND_URL + "/api/v1" ||
  "http://localhost:3000/api/v1";

console.log("Booking API Environment variables:", {
  VITE_REACT_APP_BACKEND_API_URL: import.meta.env
    .VITE_REACT_APP_BACKEND_API_URL,
  REACT_APP_BACKEND_URL: import.meta.env.REACT_APP_BACKEND_URL,
  Final_API_BASE_URL: API_BASE_URL,
});

const bookingAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
bookingAxios.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      "Making Booking API request:",
      config.method.toUpperCase(),
      config.url
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
bookingAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Booking API Error:", error);

    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      toast.error("You don't have permission to perform this action.");
    } else if (error.response?.status === 404) {
      toast.error("Resource not found.");
    } else if (error.response?.status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject(error);
  }
);

export const bookingApi = {
  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      console.log("📤 Creating booking with data:", bookingData);
      const response = await bookingAxios.post("/bookings", bookingData);

      console.log("✅ Booking creation successful:", response.data);
      toast.success("Booking created successfully!");

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Error creating booking:", error);
      console.error("📋 Error response:", error.response);
      console.error("📊 Error response data:", error.response?.data);
      console.error("📈 Error response status:", error.response?.status);

      // Log specific validation errors if available
      if (error.response?.data?.errors) {
        console.error("🔍 Validation errors:", error.response.data.errors);
        error.response.data.errors.forEach((validationError, index) => {
          console.error(
            `  ${index + 1}. ${validationError.field}: ${
              validationError.message
            }`
          );
        });
      }

      // Log debug info if available
      if (error.response?.data?.debug) {
        console.error("🐛 Debug info:", error.response.data.debug);
      }

      const errorMessage =
        error.response?.data?.message ||
        "Failed to create booking. Please try again.";

      toast.error(errorMessage);

      throw {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message,
      };
    }
  },

  // Get user's bookings
  getUserBookings: async (params = {}) => {
    try {
      const response = await bookingAxios.get("/bookings", { params });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching user bookings:", error);
      throw {
        success: false,
        message: error.response?.data?.message || "Failed to fetch bookings",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get booking by ID
  getBookingById: async (bookingId) => {
    try {
      const response = await bookingAxios.get(`/bookings/${bookingId}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching booking:", error);
      throw {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch booking details",
        error: error.response?.data || error.message,
      };
    }
  },

  // Update booking status (for service centers)
  updateBookingStatus: async (bookingId, status, notes = "") => {
    try {
      const response = await bookingAxios.patch(
        `/bookings/${bookingId}/status`,
        {
          status,
          notes,
        }
      );

      toast.success(`Booking ${status.toLowerCase()} successfully!`);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error updating booking status:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to update booking status. Please try again.";

      toast.error(errorMessage);

      throw {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message,
      };
    }
  },

  // Cancel booking (for vehicle owners)
  cancelBooking: async (bookingId, reason = "") => {
    try {
      const response = await bookingAxios.delete(`/bookings/${bookingId}`, {
        data: { reason },
      });

      toast.success("Booking cancelled successfully!");

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error cancelling booking:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to cancel booking. Please try again.";

      toast.error(errorMessage);

      throw {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message,
      };
    }
  },

  // Get available time slots for a date
  getAvailableTimeSlots: async (serviceCenterId, date) => {
    try {
      const response = await bookingAxios.get(`/bookings/available-slots`, {
        params: { serviceCenterId, date },
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching available time slots:", error);
      throw {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to fetch available time slots",
        error: error.response?.data || error.message,
      };
    }
  },
};

export default bookingApi;
