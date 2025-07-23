// src/services/addedVehicleApiService.js
import { toast } from "react-toastify";

// Base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "/api/v1";
const ADDED_VEHICLES_ENDPOINT = `${API_BASE_URL}/added-vehicles`;

// Utility function to get auth token
const getAuthToken = () => {
  return (
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

// Utility function to handle API responses
const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error("Failed to parse server response");
  }

  if (!response.ok) {
    // Handle different HTTP status codes
    switch (response.status) {
      case 401:
        // Unauthorized - redirect to login or refresh token
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
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
          data.message || `Request failed with status ${response.status}`
        );
    }
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
    response.message || `${operation} completed successfully`;
  toast.success(successMessage);
  return response;
};

// Main API service object
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(vehicleData),
      });

      const data = await handleResponse(response);
      handleAddedVehicleSuccess(data, "add vehicle");
      return data;
    } catch (error) {
      handleAddedVehicleError(error, "add vehicle");
      throw error;
    }
  },

  // Get all added vehicles for the current user
  async getAddedVehicles(params = {}) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const queryParams = new URLSearchParams();

      // Add pagination parameters
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);

      // Add filtering parameters
      if (params.status) queryParams.append("status", params.status);
      if (params.purpose) queryParams.append("purpose", params.purpose);
      if (params.ownerNIC) queryParams.append("ownerNIC", params.ownerNIC);
      if (params.search) queryParams.append("search", params.search);

      // Add sorting parameters
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const url = `${ADDED_VEHICLES_ENDPOINT}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      handleAddedVehicleError(error, "fetch added vehicles");
      throw error;
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

      return await handleResponse(response);
    } catch (error) {
      handleAddedVehicleError(error, "fetch added vehicles by owner NIC");
      throw error;
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

      return await handleResponse(response);
    } catch (error) {
      handleAddedVehicleError(error, "fetch added vehicle");
      throw error;
    }
  },

  // Update added vehicle
  async updateAddedVehicle(id, updateData) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${ADDED_VEHICLES_ENDPOINT}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      const data = await handleResponse(response);
      handleAddedVehicleSuccess(data, "update added vehicle");
      return data;
    } catch (error) {
      handleAddedVehicleError(error, "update added vehicle");
      throw error;
    }
  },

  // Delete (soft delete) added vehicle
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
      return data;
    } catch (error) {
      handleAddedVehicleError(error, "delete added vehicle");
      throw error;
    }
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notes }),
        }
      );

      const data = await handleResponse(response);
      handleAddedVehicleSuccess(data, "mark added vehicle as completed");
      return data;
    } catch (error) {
      handleAddedVehicleError(error, "mark added vehicle as completed");
      throw error;
    }
  },

  // Get statistics
  async getStats(params = {}) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const queryParams = new URLSearchParams();
      if (params.ownerNIC) queryParams.append("ownerNIC", params.ownerNIC);

      const url = `${ADDED_VEHICLES_ENDPOINT}/stats?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return await handleResponse(response);
    } catch (error) {
      handleAddedVehicleError(error, "fetch added vehicle statistics");
      throw error;
    }
  },

  // Export added vehicles to CSV
  async exportAddedVehicles(params = {}) {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const queryParams = new URLSearchParams();
      if (params.ownerNIC) queryParams.append("ownerNIC", params.ownerNIC);
      if (params.status) queryParams.append("status", params.status);
      if (params.purpose) queryParams.append("purpose", params.purpose);

      const url = `${ADDED_VEHICLES_ENDPOINT}/export?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await handleResponse(response);
      handleAddedVehicleSuccess(data, "export added vehicles");
      return data;
    } catch (error) {
      handleAddedVehicleError(error, "export added vehicles");
      throw error;
    }
  },
};

// Default export for backwards compatibility
export default addedVehicleAPI;
