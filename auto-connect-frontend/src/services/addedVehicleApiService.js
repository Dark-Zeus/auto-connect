// src/services/addedVehicleApiService.js - FIXED VERSION
import axios from "../utils/axios.js";
import { toast } from "react-toastify";

// Base configuration - Properly handle environment variables in React
const getApiBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000/api/v1";
  }
  return "/api/v1";
};

const API_BASE_URL = getApiBaseUrl();
const ADDED_VEHICLES_ENDPOINT = `${API_BASE_URL}/added-vehicles`;

// Utility function to get auth token
const getAuthToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken")
  );
};

// Enhanced error handling function
const handleResponse = async (response) => {
  let data;
  const contentType = response.headers.get("content-type");

  try {
    const responseText = await response.text();

    if (!responseText) {
      throw new Error("Empty response from server");
    }

    if (contentType && contentType.includes("application/json")) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Response Text:", responseText);
        throw new Error(
          `Invalid JSON response: ${responseText.substring(0, 200)}...`
        );
      }
    } else {
      console.error("Non-JSON Response:", {
        status: response.status,
        statusText: response.statusText,
        contentType: contentType,
        responseText: responseText.substring(0, 200),
      });
      throw new Error(
        `Server returned non-JSON response: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    if (error.message.includes("JSON") || error.message.includes("response")) {
      throw error;
    }
    console.error("Response handling error:", error);
    throw new Error("Failed to process server response");
  }

  if (!response.ok) {
    // Enhanced error logging
    console.error("❌ API Error Response:", {
      status: response.status,
      statusText: response.statusText,
      data: data,
      url: response.url,
    });

    switch (response.status) {
      case 400:
        const validationDetails = data.details || data.errors || {};
        console.error("❌ Validation Error Details:", validationDetails);

        if (data.message && data.message.includes("validation")) {
          throw new Error(
            `Validation Error: ${data.message}\nDetails: ${JSON.stringify(
              validationDetails,
              null,
              2
            )}`
          );
        }
        throw new Error(
          data.message || "Invalid data provided. Please check your inputs."
        );

      case 401:
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        throw new Error("Session expired. Please log in again.");

      case 403:
        throw new Error("You do not have permission to perform this action.");

      case 404:
        throw new Error("The requested resource was not found.");

      case 409:
        throw new Error("This vehicle is already added for the same purpose.");

      case 422:
        throw new Error("Invalid data provided. Please check your inputs.");

      case 500:
        throw new Error("Server error. Please try again later.");

      default:
        throw new Error(
          data.message ||
            `Request failed with status ${response.status}: ${response.statusText}`
        );
    }
  }

  return data;
};

// Helper function to create request headers
const createHeaders = (includeAuth = true) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

// Utility function to handle API errors
export const handleAddedVehicleError = (error, operation = "operation") => {
  console.error(`Added Vehicle API Error during ${operation}:`, error);

  let errorMessage = "An unexpected error occurred";

  if (error.message) {
    errorMessage = error.message;
  } else if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  }

  // Handle specific error cases
  if (
    error.message?.includes("401") ||
    error.message?.includes("Authentication")
  ) {
    errorMessage = "Session expired. Please log in again.";
    return;
  }

  if (error.message?.includes("403")) {
    errorMessage = "Access denied. You don't have permission for this action.";
  }

  if (error.message?.includes("Network")) {
    errorMessage = "Network error. Please check your connection and try again.";
  }

  if (error.message?.includes("404")) {
    errorMessage = "Vehicle request not found.";
  }

  toast.error(errorMessage);
  return errorMessage;
};

// Utility function to handle API success
export const handleAddedVehicleSuccess = (
  response,
  operation = "operation"
) => {
  console.log(`Added Vehicle API Success during ${operation}:`, response);

  const successMessage =
    response.message || response || `${operation} completed successfully`;
  toast.success(successMessage);
  return response;
};

// Main API service object - FIXED VERSION
export const addedVehicleAPI = {
  // Add a vehicle to the added_vehicles collection - FIXED
  async addVehicle(vehicleData) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      console.log("🚀 Sending addVehicle request:", vehicleData);

      const response = await fetch(ADDED_VEHICLES_ENDPOINT, {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(vehicleData),
      });

      console.log("📡 addVehicle Response Status:", response.status);

      const data = await handleResponse(response);

      console.log("✅ addVehicle Success Response:", data);

      handleAddedVehicleSuccess(data, "add vehicle");

      return {
        success: true,
        data: data.data,
        message:
          data.message || "Vehicle added to service requests successfully",
      };
    } catch (error) {
      console.error("❌ addVehicle Error:", error);
      handleAddedVehicleError(error, "add vehicle");

      // Return error format that matches success format
      return {
        success: false,
        message: error.message || "Failed to add vehicle to service requests",
        data: null,
      };
    }
  },

  // Get all added vehicles for the current user - FIXED
  async getAddedVehicles(params = {}) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const queryParams = new URLSearchParams();

      // Add pagination parameters
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());

      // Add filtering parameters
      if (params.status && params.status !== "all") {
        queryParams.append("status", params.status.toUpperCase());
      }
      if (params.purpose && params.purpose !== "all") {
        queryParams.append("purpose", params.purpose.toUpperCase());
      }
      if (params.ownerNIC) queryParams.append("ownerNIC", params.ownerNIC);
      if (params.search) queryParams.append("search", params.search);

      // Add sorting parameters
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const url = `${ADDED_VEHICLES_ENDPOINT}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      console.log("🚀 API Request URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 getAddedVehicles Response Status:", response.status);

      // Check for HTML response (endpoint not found)
      const contentType = response.headers.get("content-type");
      if (
        response.status === 200 &&
        contentType &&
        contentType.includes("text/html")
      ) {
        console.error(
          "❌ Received HTML instead of JSON - API endpoint may not exist"
        );
        return {
          success: false,
          message:
            "API endpoint not implemented. Please check backend configuration.",
          data: {
            addedVehicles: [],
            pagination: { currentPage: 1, totalPages: 1, totalCount: 0 },
          },
        };
      }

      if (response.status === 404) {
        console.error("❌ Endpoint not found");
        return {
          success: false,
          message:
            "API endpoint not found. Please ensure the backend server is running.",
          data: {
            addedVehicles: [],
            pagination: { currentPage: 1, totalPages: 1, totalCount: 0 },
          },
        };
      }

      const result = await handleResponse(response);
      console.log("✅ getAddedVehicles Success:", result);

      return {
        success: true,
        data: result.data,
        message: result.message || "Added vehicles fetched successfully",
      };
    } catch (error) {
      console.error("❌ getAddedVehicles Error:", error);

      let userFriendlyMessage = error.message;
      if (error.message.includes("Failed to fetch")) {
        userFriendlyMessage =
          "Cannot connect to server. Please check if the backend server is running.";
      }

      handleAddedVehicleError(
        new Error(userFriendlyMessage),
        "fetch added vehicles"
      );

      return {
        success: false,
        message: userFriendlyMessage,
        data: {
          addedVehicles: [],
          pagination: { currentPage: 1, totalPages: 1, totalCount: 0 },
        },
      };
    }
  },

  // Get statistics - FIXED
  async getStats(params = {}) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const queryParams = new URLSearchParams();
      if (params.ownerNIC) queryParams.append("ownerNIC", params.ownerNIC);

      const url = `${ADDED_VEHICLES_ENDPOINT}/stats${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      console.log("🚀 Fetching stats from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📊 Stats Response:", response.status, response.statusText);

      const contentType = response.headers.get("content-type");

      // Check if we got HTML instead of JSON (endpoint not implemented)
      if (
        response.status === 200 &&
        contentType &&
        contentType.includes("text/html")
      ) {
        console.warn("⚠️ Stats endpoint returning HTML - using default stats");
        return {
          success: true,
          data: {
            totalRequests: 0,
            pendingRequests: 0,
            scheduledRequests: 0,
            completedRequests: 0,
            cancelledRequests: 0,
          },
          message: "Using default statistics (stats endpoint not implemented)",
        };
      }

      if (response.status === 404) {
        console.warn("⚠️ Stats endpoint not found - using default stats");
        return {
          success: true,
          data: {
            totalRequests: 0,
            pendingRequests: 0,
            scheduledRequests: 0,
            completedRequests: 0,
            cancelledRequests: 0,
          },
          message: "Using default statistics (stats endpoint not implemented)",
        };
      }

      const result = await handleResponse(response);
      console.log("✅ Stats data received:", result);

      return {
        success: true,
        data: result.data,
        message: result.message || "Statistics fetched successfully",
      };
    } catch (error) {
      console.error("❌ Error fetching stats:", error);

      // Return default stats instead of failing
      return {
        success: true,
        data: {
          totalRequests: 0,
          pendingRequests: 0,
          scheduledRequests: 0,
          completedRequests: 0,
          cancelledRequests: 0,
        },
        message: "Using default statistics due to server error",
      };
    }
  },

  // Update added vehicle - FIXED to use PATCH
  async updateAddedVehicle(id, updateData) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      console.log("🔧 Updating added vehicle:", id, updateData);

      const response = await fetch(`${ADDED_VEHICLES_ENDPOINT}/${id}`, {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify(updateData),
      });

      console.log("📡 Update response status:", response.status);

      const data = await handleResponse(response);

      console.log("✅ Update success response:", data);

      handleAddedVehicleSuccess(data, "update added vehicle");

      return {
        success: true,
        data: data.data,
        message: data.message || "Vehicle request updated successfully",
      };
    } catch (error) {
      console.error("❌ Update error:", error);
      handleAddedVehicleError(error, "update added vehicle");

      return {
        success: false,
        message: error.message || "Failed to update vehicle request",
        data: null,
      };
    }
  },
  // Delete added vehicle - FIXED
  async deleteAddedVehicle(id) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      console.log("🗑️ Deleting added vehicle:", id);

      const response = await fetch(`${ADDED_VEHICLES_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 Delete response status:", response.status);

      const data = await handleResponse(response);

      console.log("✅ Delete success response:", data);

      handleAddedVehicleSuccess(data, "delete added vehicle");

      return {
        success: true,
        data: data.data,
        message: data.message || "Vehicle request deleted successfully",
      };
    } catch (error) {
      console.error("❌ Delete error:", error);
      handleAddedVehicleError(error, "delete added vehicle");

      return {
        success: false,
        message: error.message || "Failed to delete vehicle request",
        data: null,
      };
    }
  },

  // Mark as completed - REAL IMPLEMENTATION
  async markCompleted(id, completionData = {}) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      console.log("✅ Marking vehicle as completed:", id, completionData);

      const response = await fetch(
        `${ADDED_VEHICLES_ENDPOINT}/${id}/complete`,
        {
          method: "PATCH",
          headers: createHeaders(),
          body: JSON.stringify(completionData),
        }
      );

      console.log("📡 Mark completed response status:", response.status);

      const data = await handleResponse(response);

      console.log("✅ Mark completed success response:", data);

      handleAddedVehicleSuccess(data, "mark added vehicle as completed");

      return {
        success: true,
        data: data.data,
        message: data.message || "Vehicle request marked as completed",
      };
    } catch (error) {
      console.error("❌ Mark completed error:", error);
      handleAddedVehicleError(error, "mark added vehicle as completed");

      return {
        success: false,
        message: error.message || "Failed to mark vehicle as completed",
        data: null,
      };
    }
  },

  // Validate update data before sending
  validateUpdateData(updateData) {
    const errors = [];

    // Validate status
    if (updateData.status) {
      const validStatuses = ["ACTIVE", "PENDING", "COMPLETED", "CANCELLED"];
      if (!validStatuses.includes(updateData.status)) {
        errors.push("Invalid status value");
      }
    }

    // Validate priority
    if (updateData.priority) {
      const validPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];
      if (!validPriorities.includes(updateData.priority)) {
        errors.push("Invalid priority value");
      }
    }

    // Validate purpose
    if (updateData.purpose) {
      const validPurposes = [
        "SERVICE_BOOKING",
        "INSURANCE_CLAIM",
        "MAINTENANCE_SCHEDULE",
        "REPAIR_REQUEST",
        "INSPECTION",
        "SALE_LISTING",
        "RENTAL",
        "OTHER",
      ];
      if (!validPurposes.includes(updateData.purpose)) {
        errors.push("Invalid purpose value");
      }
    }

    // Validate scheduled date
    if (updateData.scheduledDate) {
      const scheduledDate = new Date(updateData.scheduledDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (scheduledDate < today) {
        errors.push("Scheduled date cannot be in the past");
      }
    }

    // Validate notes length
    if (updateData.notes && updateData.notes.length > 500) {
      errors.push("Notes cannot exceed 500 characters");
    }

    // Validate phone number if provided
    if (updateData.contactInfo?.phone) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(updateData.contactInfo.phone)) {
        errors.push("Invalid phone number format");
      }
    }

    // Validate email if provided
    if (updateData.contactInfo?.email) {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(updateData.contactInfo.email)) {
        errors.push("Invalid email format");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Export vehicles - FIXED
  async exportAddedVehicles(params = {}) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const queryParams = new URLSearchParams();
      if (params.ownerNIC) queryParams.append("ownerNIC", params.ownerNIC);
      if (params.status && params.status !== "all") {
        queryParams.append("status", params.status.toUpperCase());
      }
      if (params.purpose) queryParams.append("purpose", params.purpose);

      const url = `${ADDED_VEHICLES_ENDPOINT}/export${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Export failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json(); // Changed from blob to json

      return {
        success: true,
        data: data.data,
        message: data.message || "Export completed successfully",
      };
    } catch (error) {
      console.error("Error exporting added vehicles:", error);
      handleAddedVehicleError(error, "export added vehicles");
      return {
        success: false,
        message: error.message || "Failed to export vehicle requests",
        data: null,
      };
    }
  },
};

// Default export for backwards compatibility
export default addedVehicleAPI;
