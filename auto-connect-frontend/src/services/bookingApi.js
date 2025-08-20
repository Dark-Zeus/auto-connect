// src/services/bookingApi.js
import axios from "../utils/axios.js";
import { toast } from "react-toastify";

export const bookingApi = {
  // Create a new booking
  createBooking: async (bookingData) => {
    try {
      console.log("📤 Creating booking with data:", bookingData);
      const response = await axios.post("/bookings", bookingData);

      console.log("✅ Booking creation successful:", response.data);
      toast.success("Booking created successfully!");

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error(" Error creating booking:", error);
      console.error(" Error response:", error.response);
      console.error(" Error response data:", error.response?.data);
      console.error(" Error response status:", error.response?.status);

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
      const response = await axios.get("/bookings", { params });
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
      const response = await axios.get(`/bookings/${bookingId}`);
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
      const response = await axios.patch(`/bookings/${bookingId}/status`, {
        status,
        notes,
      });

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
      const response = await axios.patch(`/bookings/${bookingId}/cancel`, {
        reason,
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

  // Submit feedback/rating for a completed booking
  submitFeedback: async (bookingId, feedbackData) => {
    try {
      const response = await axios.post(
        `/bookings/${bookingId}/feedback`,
        feedbackData
      );

      const successMessage =
        response.data.message || "Feedback submitted successfully";
      toast.success(successMessage);

      return {
        success: true,
        data: response.data.data,
        message: successMessage,
      };
    } catch (error) {
      console.error("Error submitting feedback:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to submit feedback. Please try again.";

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
      const response = await axios.get(`/bookings/available-slots`, {
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
