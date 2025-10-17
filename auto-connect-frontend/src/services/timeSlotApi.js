import axios from "../utils/axios.js";
import { toast } from "react-toastify";

export const timeSlotApi = {
  // Create or update time slots for a specific day
  createOrUpdateDaySlots: async (slotData) => {
    try {
      console.log(" Creating/updating day slots:", slotData);
      const response = await axios.post("/time-slots", slotData);

      toast.success(`Time slots for ${slotData.dayOfWeek} saved successfully!`);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error(" Error creating/updating slots:", error);
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
      console.log(" Fetching service center time slots...");
      const response = await axios.get("/time-slots");

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error(" Error fetching time slots:", error);
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
      const response = await axios.get("/time-slots/stats");

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error(" Error fetching slot stats:", error);
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
      const response = await axios.get("/time-slots/available", {
        params: { serviceCenterId, date },
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error(" Error fetching available slots:", error);
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
      console.log(" Blocking date/slots:", blockData);
      const response = await axios.post("/time-slots/block", blockData);

      toast.success("Date/slots blocked successfully!");

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error(" Error blocking date/slots:", error);
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
      console.log(" Unblocking date:", unblockData);
      const response = await axios.post("/time-slots/unblock", unblockData);

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
      const response = await axios.delete(`/time-slots/${dayOfWeek}`);

      toast.success(`Time slots for ${dayOfWeek} deleted successfully!`);

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error(" Error deleting day slots:", error);
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
