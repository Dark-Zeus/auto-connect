// src/services/addedVehicleApiService.js
import { toast } from "react-toastify";

// Base configuration - Properly handle environment variables in React
const getApiBaseUrl = () => {
  // Check if we're in a React environment with process.env
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000/api/v1"; // 
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
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

// Utility function to handle API responses with better error handling
const handleResponse = async (response) => {
  let data;

  // Get content type to determine response format
  const contentType = response.headers.get("content-type");

  try {
    // Check if response has content
    const responseText = await response.text();

    if (!responseText) {
      throw new Error("Empty response from server");
    }

    // Try to parse as JSON only if content-type indicates JSON
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
      // Non-JSON response
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
      throw error; // Re-throw our custom errors
    }
    console.error("Response handling error:", error);
    throw new Error("Failed to process server response");
  }

  if (!response.ok) {
    // Handle different HTTP status codes
    switch (response.status) {
      case 401:
        // Unauthorized - redirect to login or refresh token
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        throw new Error("Session expired. Please log in again.");
      case 403:
        throw new Error("You do not have permission to perform this action.");
      case 404:
        throw new Error(
          "The requested resource was not found. Please check if the API endpoint exists."
        );
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

// Helper function to handle API responses with consistent format
const handleApiResponse = async (response) => {
  const contentType = response.headers.get("content-type");

  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(
      `Invalid response format. Expected JSON but got ${contentType}`
    );
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || `HTTP ${response.status}: ${response.statusText}`
    );
  }

  return data;
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
    // Optionally redirect to login
    // window.location.href = "/login";
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

// Main API service object - Enhanced version combining both implementations
export const addedVehicleAPI = {
  // Add a vehicle to the added_vehicles collection
  async addVehicle(vehicleData) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(ADDED_VEHICLES_ENDPOINT, {
        method: "POST",
        headers: createHeaders(),
        body: JSON.stringify(vehicleData),
      });

      const data = await handleResponse(response);
      handleAddedVehicleSuccess(data, "add vehicle");
      return {
        success: true,
        data: data.data,
        message:
          data.message || "Vehicle added to service requests successfully",
      };
    } catch (error) {
      handleAddedVehicleError(error, "add vehicle");
      return {
        success: false,
        message: error.message || "Failed to add vehicle to service requests",
        data: null,
      };
    }
  },

  // Get all added vehicles for the current user - FIXED VERSION
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
      if (params.purpose) queryParams.append("purpose", params.purpose);
      if (params.ownerNIC) queryParams.append("ownerNIC", params.ownerNIC);
      if (params.search) queryParams.append("search", params.search);

      // Add sorting parameters
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      // Add date filters
      if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);
      if (params.dateTo) queryParams.append("dateTo", params.dateTo);

      const url = `${ADDED_VEHICLES_ENDPOINT}${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      console.log("🚀 API Request Details:");
      console.log("- URL:", url);
      console.log("- Token:", token ? "Present" : "Missing");
      console.log("- Params:", params);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 Response Details:");
      console.log("- Status:", response.status);
      console.log("- Status Text:", response.statusText);

      // ✅ FIXED: Declare contentType before using it
      const contentType = response.headers.get("content-type");
      console.log("- Content-Type:", contentType);
      console.log("- OK:", response.ok);

      // Check if this is an HTML response (likely a 404 page or index.html)
      if (
        response.status === 200 &&
        contentType &&
        contentType.includes("text/html")
      ) {
        // Get response text to see what was returned
        const responseText = await response.text();

        console.error(
          "❌ Received HTML instead of JSON. This usually means the API endpoint doesn't exist."
        );
        console.error(
          "📄 HTML Response (first 300 chars):",
          responseText.substring(0, 300)
        );

        throw new Error(
          "API endpoint not implemented. The server returned HTML instead of JSON data."
        );
      }

      // Check if this is a 404 error (endpoint doesn't exist)
      if (response.status === 404) {
        console.error(
          "❌ Endpoint not found. Please check if the backend API endpoint exists."
        );
        return {
          success: false,
          message:
            "API endpoint not found. Please ensure the backend server is running and the endpoint is implemented.",
          data: {
            addedVehicles: [],
            pagination: {
              currentPage: 1,
              totalPages: 1,
              totalCount: 0,
            },
          },
        };
      }

      const result = await handleResponse(response);

      console.log("✅ API Response Success:", result);

      return {
        success: true,
        data: result.data,
        message: result.message || "Added vehicles fetched successfully",
      };
    } catch (error) {
      console.error("❌ API Error Details:");
      console.error("- Error Type:", error.constructor.name);
      console.error("- Error Message:", error.message);
      console.error("- Stack:", error.stack);

      // Provide more helpful error messages
      let userFriendlyMessage = error.message;

      if (error.message.includes("Failed to fetch")) {
        userFriendlyMessage =
          "Cannot connect to server. Please check if the backend server is running.";
      } else if (error.message.includes("JSON")) {
        userFriendlyMessage =
          "Server returned invalid response. Please check server logs.";
      } else if (error.message.includes("404")) {
        userFriendlyMessage =
          "API endpoint not found. Please ensure the backend is properly configured.";
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
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalCount: 0,
          },
        },
      };
    }
  },

  // Get added vehicles by owner NIC
  async getAddedVehiclesByOwnerNIC(nicNumber, params = {}) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.status) queryParams.append("status", params.status);

      const url = `${ADDED_VEHICLES_ENDPOINT}/owner/${nicNumber}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await handleResponse(response);
      return {
        success: true,
        data: result.data,
        message: result.message || "Added vehicles fetched successfully",
      };
    } catch (error) {
      handleAddedVehicleError(error, "fetch added vehicles by owner NIC");
      return {
        success: false,
        message: error.message || "Failed to fetch added vehicles",
        data: null,
      };
    }
  },

  // Get single added vehicle
  async getAddedVehicle(id) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${ADDED_VEHICLES_ENDPOINT}/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await handleResponse(response);
      return {
        success: true,
        data: result.data,
        message: result.message || "Vehicle request fetched successfully",
      };
    } catch (error) {
      handleAddedVehicleError(error, "fetch added vehicle");
      return {
        success: false,
        message: error.message || "Failed to fetch vehicle request",
        data: null,
      };
    }
  },

  // Update added vehicle - Enhanced version
  async updateAddedVehicle(id, updateData) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${ADDED_VEHICLES_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: createHeaders(),
        body: JSON.stringify(updateData),
      });

      const data = await handleResponse(response);
      handleAddedVehicleSuccess(data, "update added vehicle");
      return {
        success: true,
        data: data.data,
        message: data.message || "Vehicle request updated successfully",
      };
    } catch (error) {
      handleAddedVehicleError(error, "update added vehicle");
      return {
        success: false,
        message: error.message || "Failed to update vehicle request",
        data: null,
      };
    }
  },

  // Update added vehicle status - New enhanced method
  async updateStatus(vehicleId, status, additionalData = {}) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const requestBody = {
        status: status.toUpperCase(),
        ...additionalData,
      };

      const response = await fetch(
        `${ADDED_VEHICLES_ENDPOINT}/${vehicleId}/status`,
        {
          method: "PATCH",
          headers: createHeaders(),
          body: JSON.stringify(requestBody),
        }
      );

      const result = await handleResponse(response);
      return {
        success: true,
        data: result.data,
        message: result.message || "Status updated successfully",
      };
    } catch (error) {
      console.error("Error updating vehicle status:", error);
      return {
        success: false,
        message: error.message || "Failed to update status",
        data: null,
      };
    }
  },

  // Delete (soft delete) added vehicle - Enhanced version
  async deleteAddedVehicle(id) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${ADDED_VEHICLES_ENDPOINT}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await handleResponse(response);
      handleAddedVehicleSuccess(data, "delete added vehicle");
      return {
        success: true,
        data: data.data,
        message: data.message || "Vehicle request deleted successfully",
      };
    } catch (error) {
      handleAddedVehicleError(error, "delete added vehicle");
      return {
        success: false,
        message: error.message || "Failed to delete vehicle request",
        data: null,
      };
    }
  },

  // Alias for deleteAddedVehicle to match component expectations
  async deleteVehicle(id) {
    return this.deleteAddedVehicle(id);
  },

  // Mark added vehicle as completed
  async markCompleted(id, notes = "") {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(
        `${ADDED_VEHICLES_ENDPOINT}/${id}/complete`,
        {
          method: "PATCH",
          headers: createHeaders(),
          body: JSON.stringify({ notes }),
        }
      );

      const data = await handleResponse(response);
      handleAddedVehicleSuccess(data, "mark added vehicle as completed");
      return {
        success: true,
        data: data.data,
        message: data.message || "Vehicle request marked as completed",
      };
    } catch (error) {
      handleAddedVehicleError(error, "mark added vehicle as completed");
      return {
        success: false,
        message: error.message || "Failed to mark vehicle as completed",
        data: null,
      };
    }
  },

  // Get statistics - FIXED VERSION with debugging
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

      // ✅ FIXED: Declare contentType before using it
      const contentType = response.headers.get("content-type");

      // Check if we got HTML instead of JSON (endpoint not implemented)
      if (
        response.status === 200 &&
        contentType &&
        contentType.includes("text/html")
      ) {
        console.warn(
          "⚠️ Stats endpoint returning HTML instead of JSON - endpoint not implemented"
        );
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

      // If stats endpoint doesn't exist, return default stats
      if (response.status === 404) {
        console.warn("⚠️ Stats endpoint not found, returning default stats");
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
      console.error("❌ Error fetching added vehicles stats:", error);

      // Don't show error toast for stats, just return default values
      return {
        success: true, // Return success with default data instead of failing
        message: "Using default statistics due to server error",
        data: {
          totalRequests: 0,
          pendingRequests: 0,
          scheduledRequests: 0,
          completedRequests: 0,
          cancelledRequests: 0,
        },
      };
    }
  },

  // Export added vehicles to CSV - Enhanced version
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
      if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);
      if (params.dateTo) queryParams.append("dateTo", params.dateTo);

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

      const blob = await response.blob();
      return {
        success: true,
        data: blob,
        message: "Export completed successfully",
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

  // Alias for exportAddedVehicles to match component expectations
  async exportVehicles(params = {}) {
    return this.exportAddedVehicles(params);
  },

  // Bulk operations
  async bulkUpdateStatus(vehicleIds, status) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${ADDED_VEHICLES_ENDPOINT}/bulk/status`, {
        method: "PATCH",
        headers: createHeaders(),
        body: JSON.stringify({
          vehicleIds,
          status: status.toUpperCase(),
        }),
      });

      const result = await handleResponse(response);
      handleAddedVehicleSuccess(result, "bulk status update");
      return {
        success: true,
        data: result.data,
        message: result.message || "Bulk status update completed successfully",
      };
    } catch (error) {
      console.error("Error in bulk status update:", error);
      handleAddedVehicleError(error, "bulk status update");
      return {
        success: false,
        message: error.message || "Failed to update vehicle statuses",
        data: null,
      };
    }
  },

  async bulkDelete(vehicleIds) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${ADDED_VEHICLES_ENDPOINT}/bulk/delete`, {
        method: "DELETE",
        headers: createHeaders(),
        body: JSON.stringify({ vehicleIds }),
      });

      const result = await handleResponse(response);
      handleAddedVehicleSuccess(result, "bulk deletion");
      return {
        success: true,
        data: result.data,
        message: result.message || "Bulk deletion completed successfully",
      };
    } catch (error) {
      console.error("Error in bulk deletion:", error);
      handleAddedVehicleError(error, "bulk deletion");
      return {
        success: false,
        message: error.message || "Failed to delete vehicle requests",
        data: null,
      };
    }
  },

  // Get vehicle history/timeline
  async getVehicleHistory(vehicleId) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(
        `${ADDED_VEHICLES_ENDPOINT}/${vehicleId}/history`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await handleResponse(response);
      return {
        success: true,
        data: result.data,
        message: result.message || "Vehicle history fetched successfully",
      };
    } catch (error) {
      console.error("Error fetching vehicle history:", error);
      handleAddedVehicleError(error, "fetch vehicle history");
      return {
        success: false,
        message: error.message || "Failed to fetch vehicle history",
        data: null,
      };
    }
  },
};

// Utility functions for data processing
export const formatAddedVehicleData = (vehicle) => {
  return {
    id: vehicle._id,
    vehicleId: vehicle.vehicleId,
    registrationNumber: vehicle.vehicleId?.registrationNumber || "N/A",
    make: vehicle.vehicleId?.make || "Unknown",
    model: vehicle.vehicleId?.model || "Unknown",
    year: vehicle.vehicleId?.yearOfManufacture || "Unknown",
    status: vehicle.status || "PENDING",
    purpose: vehicle.purpose || "SERVICE_BOOKING",
    priority: vehicle.priority || "MEDIUM",
    scheduledDate: vehicle.scheduledDate,
    location: vehicle.location,
    contactInfo: vehicle.contactInfo,
    notes: vehicle.notes,
    createdAt: vehicle.createdAt,
    updatedAt: vehicle.updatedAt,
    userId: vehicle.userId,
  };
};

export const getStatusDisplayName = (status) => {
  const statusMap = {
    PENDING: "Pending",
    SCHEDULED: "Scheduled",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    ON_HOLD: "On Hold",
  };
  return statusMap[status?.toUpperCase()] || status;
};

export const getPriorityDisplayName = (priority) => {
  const priorityMap = {
    LOW: "Low Priority",
    MEDIUM: "Medium Priority",
    HIGH: "High Priority",
    URGENT: "Urgent",
  };
  return priorityMap[priority?.toUpperCase()] || priority;
};

export const formatContactMethod = (method) => {
  const methodMap = {
    PHONE: "Phone",
    EMAIL: "Email",
    SMS: "SMS",
    WHATSAPP: "WhatsApp",
  };
  return methodMap[method?.toUpperCase()] || method;
};

// Data validation helpers
export const validateAddedVehicleData = (data) => {
  const errors = [];

  if (!data.vehicleId) {
    errors.push("Vehicle ID is required");
  }

  if (!data.purpose) {
    errors.push("Purpose is required");
  }

  if (!data.scheduledDate) {
    errors.push("Scheduled date is required");
  } else {
    const scheduledDate = new Date(data.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (scheduledDate < today) {
      errors.push("Scheduled date cannot be in the past");
    }
  }

  if (!data.contactInfo?.phone && !data.contactInfo?.email) {
    errors.push("At least one contact method (phone or email) is required");
  }

  if (data.contactInfo?.phone && !isValidPhone(data.contactInfo.phone)) {
    errors.push("Invalid phone number format");
  }

  if (data.contactInfo?.email && !isValidEmail(data.contactInfo.email)) {
    errors.push("Invalid email format");
  }

  if (!data.location?.address) {
    errors.push("Location address is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Helper validation functions
const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// CSV export utility
export const downloadCSV = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download =
    filename || `added_vehicles_${new Date().toISOString().split("T")[0]}.csv`;
  a.style.visibility = "hidden";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

// Filter and search utilities
export const filterAddedVehicles = (vehicles, filters) => {
  let filtered = [...vehicles];

  // Filter by status
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter(
      (vehicle) =>
        vehicle.status?.toUpperCase() === filters.status.toUpperCase()
    );
  }

  // Filter by priority
  if (filters.priority && filters.priority !== "all") {
    filtered = filtered.filter(
      (vehicle) =>
        vehicle.priority?.toUpperCase() === filters.priority.toUpperCase()
    );
  }

  // Filter by date range
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    filtered = filtered.filter((vehicle) => {
      const vehicleDate = new Date(vehicle.scheduledDate || vehicle.createdAt);
      return vehicleDate >= fromDate;
    });
  }

  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    toDate.setHours(23, 59, 59, 999); // End of day
    filtered = filtered.filter((vehicle) => {
      const vehicleDate = new Date(vehicle.scheduledDate || vehicle.createdAt);
      return vehicleDate <= toDate;
    });
  }

  // Search functionality
  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filtered = filtered.filter((vehicle) => {
      const searchableFields = [
        vehicle.vehicleId?.registrationNumber,
        vehicle.vehicleId?.make,
        vehicle.vehicleId?.model,
        vehicle.purpose,
        vehicle.status,
        vehicle.priority,
        vehicle.notes,
        vehicle.location?.address,
        vehicle.location?.city,
      ];

      return searchableFields.some((field) =>
        field?.toLowerCase().includes(searchTerm)
      );
    });
  }

  return filtered;
};

// Sort utilities
export const sortAddedVehicles = (vehicles, sortBy, sortOrder = "desc") => {
  const sorted = [...vehicles];

  sorted.sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case "registrationNumber":
        aValue = a.vehicleId?.registrationNumber || "";
        bValue = b.vehicleId?.registrationNumber || "";
        break;
      case "status":
        aValue = a.status || "";
        bValue = b.status || "";
        break;
      case "priority":
        const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        aValue = priorityOrder[a.priority?.toUpperCase()] || 0;
        bValue = priorityOrder[b.priority?.toUpperCase()] || 0;
        break;
      case "scheduledDate":
        aValue = new Date(a.scheduledDate || a.createdAt);
        bValue = new Date(b.scheduledDate || b.createdAt);
        break;
      case "createdAt":
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case "updatedAt":
        aValue = new Date(a.updatedAt || a.createdAt);
        bValue = new Date(b.updatedAt || b.createdAt);
        break;
      default:
        aValue = a.createdAt;
        bValue = b.createdAt;
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  return sorted;
};

// Local storage helpers for caching
export const cacheAddedVehicles = (
  vehicles,
  cacheKey = "addedVehiclesCache"
) => {
  try {
    const cacheData = {
      vehicles,
      timestamp: Date.now(),
      expiry: Date.now() + 5 * 60 * 1000, // 5 minutes cache
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    console.warn("Failed to cache added vehicles:", error);
  }
};

export const getCachedAddedVehicles = (cacheKey = "addedVehiclesCache") => {
  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const cacheData = JSON.parse(cached);
    if (Date.now() > cacheData.expiry) {
      localStorage.removeItem(cacheKey);
      return null;
    }

    return cacheData.vehicles;
  } catch (error) {
    console.warn("Failed to retrieve cached added vehicles:", error);
    localStorage.removeItem(cacheKey);
    return null;
  }
};

export const clearAddedVehiclesCache = (cacheKey = "addedVehiclesCache") => {
  try {
    localStorage.removeItem(cacheKey);
  } catch (error) {
    console.warn("Failed to clear added vehicles cache:", error);
  }
};

// Default export for backwards compatibility
export default addedVehicleAPI;
