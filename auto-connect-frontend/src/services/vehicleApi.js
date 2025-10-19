import axios from "../utils/axios.js";
import { toast } from "react-toastify";

export const vehicleApi = {
  // Get user's vehicles for booking
  getUserVehiclesForBooking: async () => {
    try {
      console.log("🚀 Calling getUserVehiclesForBooking API...");
      console.log(
        "Token:",
        localStorage.getItem("token") ? "Present" : "Missing"
      );

      const response = await axios.get("/vehicles/my-vehicles");

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
      const response = await axios.get("/vehicles", { params });

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
      const response = await axios.get(`/vehicles/${vehicleId}`);

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
