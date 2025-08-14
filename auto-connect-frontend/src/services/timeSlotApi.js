import axios from "axios";
import { toast } from "react-toastify";

// Create axios instance for time slot API
const timeSlotAxios = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
timeSlotAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
timeSlotAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Time Slot API Error:", error);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const timeSlotApi = {
  // Create or update time slots for a specific day
  createOrUpdateDaySlots: async (slotData) => {
    try {
      console.log("🕒 Creating/updating day slots:", slotData);
      const response = await timeSlotAxios.post("/time-slots", slotData);

      toast.success(`Time slots for ${slotData.dayOfWeek} saved successfully!`);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Error creating/updating slots:", error);
      const message =
        error.response?.data?.message || "Failed to save time slots";
      toast.error(message);
      throw {
        success: false,
        message,
        error: error.response?.data || error.message,
      };
    }
  },

  // Get all time slots for the service center
  getMyTimeSlots: async () => {
    try {
      console.log("📅 Fetching service center time slots...");
      const response = await timeSlotAxios.get("/time-slots/my-slots");

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Error fetching time slots:", error);
      const message =
        error.response?.data?.message || "Failed to fetch time slots";
      toast.error(message);
      throw {
        success: false,
        message,
        error: error.response?.data || error.message,
      };
    }
  },

  // Get time slot statistics
  getTimeSlotStats: async () => {
    try {
      const response = await timeSlotAxios.get("/time-slots/stats");

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Error fetching slot stats:", error);
      const message =
        error.response?.data?.message || "Failed to fetch statistics";
      throw {
        success: false,
        message,
        error: error.response?.data || error.message,
      };
    }
  },

  // Get available slots for a specific date (for booking)
  getAvailableSlotsForDate: async (serviceCenterId, date) => {
    try {
      console.log("🔍 Getting available slots for date:", {
        serviceCenterId,
        date,
      });
      const response = await timeSlotAxios.get("/time-slots/available", {
        params: { serviceCenterId, date },
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Error fetching available slots:", error);
      const message =
        error.response?.data?.message || "Failed to fetch available slots";
      throw {
        success: false,
        message,
        error: error.response?.data || error.message,
      };
    }
  },

  // Block specific dates or slots
  blockDateOrSlots: async (blockData) => {
    try {
      console.log("🚫 Blocking date/slots:", blockData);
      const response = await timeSlotAxios.post("/time-slots/block", blockData);

      toast.success("Date/slots blocked successfully!");

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Error blocking date/slots:", error);
      const message =
        error.response?.data?.message || "Failed to block date/slots";
      toast.error(message);
      throw {
        success: false,
        message,
        error: error.response?.data || error.message,
      };
    }
  },

  // Unblock specific dates
  unblockDate: async (unblockData) => {
    try {
      console.log("✅ Unblocking date:", unblockData);
      const response = await timeSlotAxios.post(
        "/time-slots/unblock",
        unblockData
      );

      toast.success("Date unblocked successfully!");

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Error unblocking date:", error);
      const message = error.response?.data?.message || "Failed to unblock date";
      toast.error(message);
      throw {
        success: false,
        message,
        error: error.response?.data || error.message,
      };
    }
  },

  // Delete time slots for a specific day
  deleteDaySlots: async (dayOfWeek) => {
    try {
      console.log("🗑️ Deleting slots for day:", dayOfWeek);
      const response = await timeSlotAxios.delete(`/time-slots/${dayOfWeek}`);

      toast.success(`Time slots for ${dayOfWeek} deleted successfully!`);

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Error deleting day slots:", error);
      const message =
        error.response?.data?.message || "Failed to delete time slots";
      toast.error(message);
      throw {
        success: false,
        message,
        error: error.response?.data || error.message,
      };
    }
  },
};

export default timeSlotApi;
