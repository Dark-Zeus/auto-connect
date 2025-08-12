// src/services/serviceCenterApi.js (FIXED VERSION)
import axios from "axios";
import { toast } from "react-toastify";

// FIXED: Handle both VITE_ and REACT_APP_ environment variables
const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_API_URL ||
  import.meta.env.REACT_APP_BACKEND_URL + "/api/v1" ||
  "http://localhost:3000/api/v1"; // Backend is on port 3000

console.log("Service Center API Environment variables:", {
  VITE_REACT_APP_BACKEND_API_URL: import.meta.env
    .VITE_REACT_APP_BACKEND_API_URL,
  REACT_APP_BACKEND_URL: import.meta.env.REACT_APP_BACKEND_URL,
  REACT_APP_FRONTEND_URL: import.meta.env.REACT_APP_FRONTEND_URL,
  Final_API_BASE_URL: API_BASE_URL,
}); // Debug log

const serviceCenterAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
serviceCenterAxios.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      "Making Service Center API request:",
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
serviceCenterAxios.interceptors.response.use(
  (response) => {
    console.log("Service Center API response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error(
      "Service Center API error:",
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

// Service Center API endpoints
export const serviceCenterApi = {
  // Get all service centers with filtering and pagination
  getServiceCenters: async (params = {}) => {
    try {
      console.log("Fetching service centers with params:", params);
      const response = await serviceCenterAxios.get("/service-centers", {
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
      const response = await serviceCenterAxios.get(`/service-centers/${id}`);
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
      const response = await serviceCenterAxios.get(
        "/service-centers/categories"
      );
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
      const response = await serviceCenterAxios.get("/service-centers/stats");
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
      const response = await serviceCenterAxios.get("/service-centers", {
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
      const response = await serviceCenterAxios.get("/service-centers", {
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
