// services/vehicleApiService.js (FIXED VERSION)
import axios from "../utils/axios.js";
import { toast } from "react-toastify";

// Vehicle API endpoints
export const vehicleAPI = {
  // Get vehicles with filtering
  getVehicles: async (params = {}) => {
    try {
      console.log("Fetching vehicles with params:", params);
      const response = await axios.get("/vehicles", { params });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      throw {
        success: false,
        message: error.response?.data?.message || "Failed to fetch vehicles",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get vehicles by owner NIC (alternative endpoint)
  getVehiclesByNIC: async (nicNumber, params = {}) => {
    try {
      const response = await axios.get(`/vehicles/owner/${nicNumber}`, {
        params,
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || "Failed to fetch vehicles",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get vehicle statistics
  getStats: async (params = {}) => {
    try {
      const response = await axios.get("/vehicles/stats", { params });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      throw {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch vehicle statistics",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get single vehicle
  getVehicle: async (vehicleId) => {
    try {
      const response = await axios.get(`/vehicles/${vehicleId}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      throw {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch vehicle details",
        error: error.response?.data || error.message,
      };
    }
  },

  // Create new vehicle
  createVehicle: async (vehicleData) => {
    try {
      const formData = new FormData();

      // Add vehicle data
      Object.keys(vehicleData).forEach((key) => {
        if (key === "documents" || key === "images") {
          // Handle file uploads
          vehicleData[key].forEach((file) => {
            formData.append(key, file);
          });
        } else if (typeof vehicleData[key] === "object") {
          formData.append(key, JSON.stringify(vehicleData[key]));
        } else {
          formData.append(key, vehicleData[key]);
        }
      });

      const response = await axios.post("/vehicles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || "Failed to create vehicle",
        error: error.response?.data || error.message,
      };
    }
  },

  // Update vehicle
  updateVehicle: async (vehicleId, vehicleData) => {
    try {
      const formData = new FormData();

      Object.keys(vehicleData).forEach((key) => {
        if (key === "documents" || key === "images") {
          vehicleData[key].forEach((file) => {
            formData.append(key, file);
          });
        } else if (typeof vehicleData[key] === "object") {
          formData.append(key, JSON.stringify(vehicleData[key]));
        } else {
          formData.append(key, vehicleData[key]);
        }
      });

      const response = await axios.patch(`/vehicles/${vehicleId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || "Failed to update vehicle",
        error: error.response?.data || error.message,
      };
    }
  },

  // Delete vehicle
  deleteVehicle: async (vehicleId) => {
    try {
      const response = await axios.delete(`/vehicles/${vehicleId}`);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || "Failed to delete vehicle",
        error: error.response?.data || error.message,
      };
    }
  },

  // Export vehicles
  exportVehicles: async (params = {}) => {
    try {
      const response = await axios.get("/vehicles/export", { params });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || "Failed to export vehicles",
        error: error.response?.data || error.message,
      };
    }
  },

  // Verify vehicle (admin only)
  verifyVehicle: async (vehicleId) => {
    try {
      const response = await axios.patch(`/vehicles/${vehicleId}/verify`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || "Failed to verify vehicle",
        error: error.response?.data || error.message,
      };
    }
  },

  // Reject vehicle (admin only)
  rejectVehicle: async (vehicleId, rejectionReason) => {
    try {
      const response = await axios.patch(`/vehicles/${vehicleId}/reject`, {
        rejectionReason,
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      throw {
        success: false,
        message: error.response?.data?.message || "Failed to reject vehicle",
        error: error.response?.data || error.message,
      };
    }
  },
};

// Error handling helpers
export const handleVehicleError = (error, operation = "operation") => {
  console.error(`Vehicle ${operation} error:`, error);

  const message = error.message || `Failed to ${operation}. Please try again.`;

  if (error.error?.errors) {
    // Handle validation errors
    const validationErrors = Object.values(error.error.errors)
      .map((err) => err.message)
      .join(", ");
    toast.error(`Validation Error: ${validationErrors}`);
  } else {
    toast.error(message);
  }
};

export const handleVehicleSuccess = (response, operation = "operation") => {
  const message =
    response.message || `Vehicle ${operation} completed successfully!`;
  toast.success(message);
};
