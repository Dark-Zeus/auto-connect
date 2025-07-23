// services/vehicleApiService.js (FIXED VERSION)
import axios from "axios";
import { toast } from "react-toastify";

// FIXED: Handle both VITE_ and REACT_APP_ environment variables
const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_API_URL ||
  import.meta.env.REACT_APP_BACKEND_URL + "/api/v1" ||
  "http://localhost:3000/api/v1"; // Backend is on port 3000

console.log("Environment variables:", {
  VITE_REACT_APP_BACKEND_API_URL: import.meta.env
    .VITE_REACT_APP_BACKEND_API_URL,
  REACT_APP_BACKEND_URL: import.meta.env.REACT_APP_BACKEND_URL,
  REACT_APP_FRONTEND_URL: import.meta.env.REACT_APP_FRONTEND_URL,
  Final_API_BASE_URL: API_BASE_URL,
}); // Debug log

const vehicleAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
vehicleAxios.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      "Making API request:",
      config.method.toUpperCase(),
      config.url,
      config.params
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
vehicleAxios.interceptors.response.use(
  (response) => {
    console.log("API response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("API error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

// Vehicle API endpoints
export const vehicleAPI = {
  // Get vehicles with filtering
  getVehicles: async (params = {}) => {
    try {
      console.log("Fetching vehicles with params:", params);
      const response = await vehicleAxios.get("/vehicles", { params });
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
      const response = await vehicleAxios.get(`/vehicles/owner/${nicNumber}`, {
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
      const response = await vehicleAxios.get("/vehicles/stats", { params });
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
      const response = await vehicleAxios.get(`/vehicles/${vehicleId}`);
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

      const response = await vehicleAxios.post("/vehicles", formData, {
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

      const response = await vehicleAxios.patch(
        `/vehicles/${vehicleId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

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
      const response = await vehicleAxios.delete(`/vehicles/${vehicleId}`);
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
      const response = await vehicleAxios.get("/vehicles/export", { params });
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
      const response = await vehicleAxios.patch(
        `/vehicles/${vehicleId}/verify`
      );
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
      const response = await vehicleAxios.patch(
        `/vehicles/${vehicleId}/reject`,
        {
          rejectionReason,
        }
      );
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
