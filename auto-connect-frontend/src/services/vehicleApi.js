import axios from "axios";
import { toast } from "react-toastify";

// Create axios instance for vehicle API
const vehicleAxios = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
vehicleAxios.interceptors.request.use(
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
vehicleAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Vehicle API Error:", error);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const vehicleApi = {
  // Get user's vehicles for booking
  getUserVehiclesForBooking: async () => {
    try {
      console.log("🚀 Calling getUserVehiclesForBooking API...");
      console.log(
        "Token:",
        localStorage.getItem("token") ? "Present" : "Missing"
      );

      const response = await vehicleAxios.get("/vehicles/my-vehicles");

      console.log("✅ API Response:", response.data);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("❌ Error fetching user vehicles:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      const message =
        error.response?.data?.message || "Failed to fetch your vehicles";
      toast.error(message);
      throw {
        success: false,
        message,
        error: error.response?.data || error.message,
      };
    }
  },

  // Get all user vehicles (with pagination)
  getUserVehicles: async (params = {}) => {
    try {
      const response = await vehicleAxios.get("/vehicles", { params });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      const message =
        error.response?.data?.message || "Failed to fetch vehicles";
      toast.error(message);
      throw {
        success: false,
        message,
        error: error.response?.data || error.message,
      };
    }
  },

  // Get specific vehicle details
  getVehicle: async (vehicleId) => {
    try {
      const response = await vehicleAxios.get(`/vehicles/${vehicleId}`);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      const message =
        error.response?.data?.message || "Failed to fetch vehicle details";
      toast.error(message);
      throw {
        success: false,
        message,
        error: error.response?.data || error.message,
      };
    }
  },
};

export default vehicleApi;
