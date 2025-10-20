// src/services/vehicleHistoryApiService.js
import axios from "../utils/axios.js";
import { toast } from "react-toastify";

// Success handler
const handleSuccess = (data, action) => {
  const message = data.message || `Vehicle history ${action} successfully`;
  if (action !== "fetched") {
    toast.success(message);
  }
  return data;
};

// Error handler
const handleError = (error, action) => {
  const message = error.message || `Failed to ${action} vehicle history`;
  toast.error(message);
  console.error(`Error ${action} vehicle history:`, error);
};

// Vehicle History API endpoints
const vehicleHistoryAPI = {
  // Get vehicle owner's vehicles list
  getOwnerVehicles: async () => {
    try {
      const response = await axios.get("/vehicle-history/owner/vehicles");
      return response.data;
    } catch (error) {
      handleError(error, "fetch vehicles");
      throw error;
    }
  },

  // Get complete history for a specific vehicle
  getVehicleCompleteHistory: async (vehicleId) => {
    try {
      const response = await axios.get(`/vehicle-history/owner/vehicles/${vehicleId}`);
      return response.data;
    } catch (error) {
      handleError(error, "fetch vehicle history");
      throw error;
    }
  },

  // Service Center specific endpoints (existing functionality)
  getDashboardStats: async (timeRange = "30days") => {
    try {
      const response = await axios.get("/vehicle-history/dashboard-stats", {
        params: { timeRange },
      });
      return response.data;
    } catch (error) {
      handleError(error, "fetch dashboard statistics");
      throw error;
    }
  },

  getRecentServices: async (params = {}) => {
    try {
      const { page = 1, limit = 10, status = "all", timeRange = "30days" } = params;
      const response = await axios.get("/vehicle-history/recent-services", {
        params: { page, limit, status, timeRange },
      });
      return response.data;
    } catch (error) {
      handleError(error, "fetch recent services");
      throw error;
    }
  },

  getTopVehicles: async (limit = 10) => {
    try {
      const response = await axios.get("/vehicle-history/top-vehicles", {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      handleError(error, "fetch top vehicles");
      throw error;
    }
  },

  getPerformanceAnalytics: async (timeRange = "30days") => {
    try {
      const response = await axios.get("/vehicle-history/analytics", {
        params: { timeRange },
      });
      return response.data;
    } catch (error) {
      handleError(error, "fetch performance analytics");
      throw error;
    }
  },
};

export default vehicleHistoryAPI;