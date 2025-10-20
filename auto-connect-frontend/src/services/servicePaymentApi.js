// src/services/servicePaymentApi.js
import axios from "../utils/axios.js";
import { toast } from "react-toastify";

export const servicePaymentApi = {
  /**
   * Create a payment session for a completed service
   * @param {string} bookingId - The booking ID to create payment for
   * @returns {Promise} Payment session data including sessionId and sessionUrl
   */
  createPaymentSession: async (bookingId) => {
    try {
      console.log("📤 Creating service payment session for booking:", bookingId);
      const response = await axios.post("/service-payments/create-session", {
        bookingId,
      });

      console.log("✅ Payment session created successfully:", response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Error creating payment session:", error);
      console.error("❌ Error response:", error.response);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to create payment session. Please try again.";

      toast.error(errorMessage);

      throw {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message,
      };
    }
  },

  /**
   * Verify payment status after Stripe checkout
   * @param {string} sessionId - Stripe session ID
   * @returns {Promise} Payment verification data
   */
  verifyPayment: async (sessionId) => {
    try {
      console.log("🔍 Verifying payment with session ID:", sessionId);
      const response = await axios.get("/service-payments/verify", {
        params: { sessionId },
      });

      console.log("✅ Payment verified successfully:", response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Error verifying payment:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to verify payment. Please try again.";

      toast.error(errorMessage);

      throw {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message,
      };
    }
  },

  /**
   * Get payment details by booking ID
   * @param {string} bookingId - The booking ID
   * @returns {Promise} Payment details
   */
  getPaymentByBooking: async (bookingId) => {
    try {
      console.log("🔍 Fetching payment for booking:", bookingId);
      const response = await axios.get(`/service-payments/booking/${bookingId}`);

      console.log("✅ Payment fetched successfully:", response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Error fetching payment:", error);

      // Don't show toast for 404 (payment not found is expected)
      if (error.response?.status !== 404) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to fetch payment details.";
        toast.error(errorMessage);
      }

      throw {
        success: false,
        message: error.response?.data?.message || "Failed to fetch payment",
        error: error.response?.data || error.message,
      };
    }
  },

  /**
   * Get all payments for the current user
   * @param {Object} params - Query parameters (page, limit, status)
   * @returns {Promise} List of payments with pagination
   */
  getUserPayments: async (params = {}) => {
    try {
      console.log("📋 Fetching user payments with params:", params);
      const response = await axios.get("/service-payments", { params });

      console.log("✅ User payments fetched successfully:", response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Error fetching user payments:", error);

      const errorMessage =
        error.response?.data?.message || "Failed to fetch payments";

      toast.error(errorMessage);

      throw {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message,
      };
    }
  },

  /**
   * Get payment statistics for the current user
   * @returns {Promise} Payment statistics
   */
  getPaymentStats: async () => {
    try {
      console.log("📊 Fetching payment statistics");
      const response = await axios.get("/service-payments/stats");

      console.log("✅ Payment statistics fetched successfully:", response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Error fetching payment statistics:", error);

      const errorMessage =
        error.response?.data?.message ||
        "Failed to fetch payment statistics";

      toast.error(errorMessage);

      throw {
        success: false,
        message: errorMessage,
        error: error.response?.data || error.message,
      };
    }
  },
};

export default servicePaymentApi;
