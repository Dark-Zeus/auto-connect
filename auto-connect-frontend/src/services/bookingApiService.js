// src/services/bookingApiService.js
import axios from "../utils/axios.js";
import { toast } from "react-toastify";

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
      const response = await axios.get("/bookings", { params });
      return response.data;
    } catch (error) {
      handleBookingError(error, "fetch bookings");
      throw error;
    }
  },

  // Get specific booking details
  getBooking: async (id) => {
    try {
      const response = await axios.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      handleBookingError(error, "fetch booking details");
      throw error;
    }
  },

  // Create new booking (Vehicle owners only)
  createBooking: async (bookingData) => {
    try {
      const response = await axios.post("/bookings", bookingData);
      const data = response.data;
      return handleBookingSuccess(data, "created");
    } catch (error) {
      handleBookingError(error, "create");
      throw error;
    }
  },

  // Update booking status (Service centers only)
  updateBookingStatus: async (id, statusData) => {
    try {
      const response = await axios.patch(`/bookings/${id}/status`, statusData);
      const data = response.data;
      return handleBookingSuccess(data, "updated");
    } catch (error) {
      handleBookingError(error, "update status");
      throw error;
    }
  },

  // Cancel booking (Vehicle owners only)
  cancelBooking: async (id, reason) => {
    try {
      const response = await axios.patch(`/bookings/${id}/cancel`, { reason });
      const data = response.data;
      return handleBookingSuccess(data, "cancelled");
    } catch (error) {
      handleBookingError(error, "cancel");
      throw error;
    }
  },

  // Submit feedback (Vehicle owners only)
  submitFeedback: async (id, feedbackData) => {
    try {
      const response = await axios.post(`/bookings/${id}/feedback`, feedbackData);
      const data = response.data;
      return handleBookingSuccess(data, "feedback submitted");
    } catch (error) {
      handleBookingError(error, "submit feedback");
      throw error;
    }
  },

  // Get booking statistics
  getBookingStats: async () => {
    try {
      const response = await axios.get("/bookings/stats");
      return response.data;
    } catch (error) {
      handleBookingError(error, "fetch booking statistics");
      throw error;
    }
  },

  // Get available time slots
  getAvailableTimeSlots: async (serviceCenterId, date) => {
    try {
      const response = await axios.get("/bookings/available-slots", {
        params: { serviceCenterId, date },
      });
      return response.data;
    } catch (error) {
      handleBookingError(error, "fetch available time slots");
      throw error;
    }
  },
};

export default bookingAPI;
