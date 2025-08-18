// services/weeklyScheduleApi.js
import axios from "../utils/axios.js";
import { toast } from "react-toastify";

export const weeklyScheduleApi = {
  // Get my weekly schedule
  getMySchedule: async () => {
    try {
      console.log("📅 Fetching weekly schedule...");
      const response = await axios.get("/weekly-schedule/my-schedule");
      console.log("✅ Weekly schedule fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching weekly schedule:", error);
      throw error;
    }
  },

  // Update weekly schedule
  updateSchedule: async (scheduleData) => {
    try {
      console.log("💾 Updating weekly schedule:", scheduleData);
      const response = await axios.put(
        "/weekly-schedule/my-schedule",
        scheduleData
      );
      console.log("✅ Weekly schedule updated:", response.data);
      toast.success("Schedule updated successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Error updating weekly schedule:", error);
      throw error;
    }
  },

  // Get available slots for a service center
  getAvailableSlots: async (serviceCenterId, startDate, endDate) => {
    try {
      console.log(
        `📅 Fetching available slots for service center ${serviceCenterId}...`
      );
      const params = { serviceCenterId };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const response = await axios.get("/weekly-schedule/available-slots", {
        params,
      });
      console.log("✅ Available slots fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching available slots:", error);
      throw error;
    }
  },

  // Get available slots for a specific date
  getAvailableSlotsForDate: async (serviceCenterId, date) => {
    try {
      console.log(`📅 Fetching available slots for ${date}...`);
      const response = await axios.get("/weekly-schedule/available-slots", {
        params: { serviceCenterId, date },
      });
      console.log("✅ Available slots for date fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching available slots for date:", error);
      throw error;
    }
  },

  // Block a specific date
  blockDate: async (date, reason) => {
    try {
      console.log(`🚫 Blocking date ${date}...`);
      const response = await axios.post("/weekly-schedule/block-date", {
        date,
        reason,
      });
      console.log("✅ Date blocked:", response.data);
      toast.success("Date blocked successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Error blocking date:", error);
      throw error;
    }
  },

  // Unblock a specific date
  unblockDate: async (date) => {
    try {
      console.log(`✅ Unblocking date ${date}...`);
      const response = await axios.delete(
        `/weekly-schedule/unblock-date/${date}`
      );
      console.log("✅ Date unblocked:", response.data);
      toast.success("Date unblocked successfully!");
      return response.data;
    } catch (error) {
      console.error("❌ Error unblocking date:", error);
      throw error;
    }
  },

  // Get schedule statistics
  getStats: async () => {
    try {
      console.log("📊 Fetching schedule statistics...");
      const response = await axios.get("/weekly-schedule/stats");
      console.log("✅ Schedule statistics fetched:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching schedule statistics:", error);
      throw error;
    }
  },
};
