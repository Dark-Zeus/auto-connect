// src/services/serviceCenterApi.js
import axios from "../utils/axios.js";
import { toast } from "react-toastify";

// Service Center API endpoints
export const serviceCenterApi = {
  // Get all service centers with filtering and pagination
  getServiceCenters: async (params = {}) => {
    try {
      console.log("Fetching service centers with params:", params);
      const response = await axios.get("/service-centers", {
        params,
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching service centers:", error);
      throw {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch service centers",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get a specific service center by ID
  getServiceCenter: async (id) => {
    try {
      console.log("Fetching service center details for ID:", id);
      const response = await axios.get(`/service-centers/${id}`);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching service center details:", error);
      throw {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to fetch service center details",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get service categories for filtering
  getServiceCategories: async () => {
    try {
      console.log("Fetching service categories");
      const response = await axios.get("/service-centers/categories");
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching service categories:", error);
      throw {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch service categories",
        error: error.response?.data || error.message,
      };
    }
  },

  // Get service center statistics
  getServiceCenterStats: async () => {
    try {
      console.log("Fetching service center statistics");
      const response = await axios.get("/service-centers/stats");
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching service center statistics:", error);
      throw {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to fetch service center statistics",
        error: error.response?.data || error.message,
      };
    }
  },

  // Search service centers by location
  searchByLocation: async (location, params = {}) => {
    try {
      const searchParams = { ...params, location };
      console.log(
        "Searching service centers by location:",
        location,
        searchParams
      );
      const response = await axios.get("/service-centers", {
        params: searchParams,
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      throw {
        success: false,
        message:
          error.response?.data?.message || "Failed to search service centers",
        error: error.response?.data || error.message,
      };
    }
  },

  // Search service centers by service category
  searchByCategory: async (category, params = {}) => {
    try {
      const searchParams = { ...params, serviceCategory: category };
      console.log(
        "Searching service centers by category:",
        category,
        searchParams
      );
      const response = await axios.get("/service-centers", {
        params: searchParams,
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      throw {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to search service centers by category",
        error: error.response?.data || error.message,
      };
    }
  },
};

// Error handling helpers
export const handleServiceCenterError = (error, operation = "operation") => {
  console.error(`Service Center ${operation} error:`, error);

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

export const handleServiceCenterSuccess = (
  response,
  operation = "operation"
) => {
  const message =
    response.message || `Service Center ${operation} completed successfully!`;
  toast.success(message);
};

// Export default for easy importing
export default serviceCenterApi;
