// src/services/listVehicleApiService.js
import { toast } from "react-toastify";

// Base configuration
const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_API_URL || 
                     import.meta.env.REACT_APP_BACKEND_URL + "/api/v1" || 
                     "http://localhost:3000/api/v1";

const LIST_VEHICLES_ENDPOINT = `${API_BASE_URL}/list-vehicles`;

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
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        throw new Error("Session expired. Please log in again.");
      case 403:
        throw new Error("You don't have permission to perform this action");
      case 404:
        throw new Error("Resource not found");
      default:
        throw new Error(data.message || "Something went wrong");
    }
  }

  return data;
};

// Error handling helper
const handleListVehicleError = (error, operation = "operation") => {
  console.error(`List Vehicle API Error during ${operation}:`, error);
  toast.error(error.message || `Failed to ${operation}. Please try again.`);
  throw error;
};

// Success handling helper
const handleListVehicleSuccess = (data, operation = "operation") => {
  toast.success(data.message || `Vehicle listing ${operation} successful!`);
  return data;
};

// List Vehicle API service
const listVehicleAPI = {
  // Create new vehicle listing
  createListing: async (vehicleData) => {
    try {
        console.log('API Base URL:', API_BASE_URL);
        console.log('Endpoint:', LIST_VEHICLES_ENDPOINT);
        console.log('Sending request to:', LIST_VEHICLES_ENDPOINT);
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(LIST_VEHICLES_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(vehicleData)
      });

      const data = await handleResponse(response);
      return handleListVehicleSuccess(data, "created");
    } catch (error) {
      handleListVehicleError(error, "create listing");
      throw error;
    }
  },

  // Get user's vehicle listings
  getListings: async (params = {}) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });

      const url = `${LIST_VEHICLES_ENDPOINT}?${queryParams.toString()}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return await handleResponse(response);
    } catch (error) {
      handleListVehicleError(error, "fetch listings");
      throw error;
    }
  },

  // Get single vehicle listing
  getListing: async (id) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${LIST_VEHICLES_ENDPOINT}/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return await handleResponse(response);
    } catch (error) {
      handleListVehicleError(error, "fetch listing");
      throw error;
    }
  },

  getMyListings: async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token not found. Please log in again.");

      const response = await fetch(`${LIST_VEHICLES_ENDPOINT}/my`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });

      return await handleResponse(response);
    } catch (error) {
      handleListVehicleError(error, "fetch my listings");
      throw error;
    }
  },

  updateListing: async (id, vehicleData) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token not found. Please log in again.");

      const response = await fetch(`${LIST_VEHICLES_ENDPOINT}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(vehicleData)
      });

      const data = await handleResponse(response);
      return handleListVehicleSuccess(data, "updated");
    } catch (error) {
      handleListVehicleError(error, "update listing");
      throw error;
    }
  },

  // Add other methods as needed: updateListing, deleteListing, etc.
};

export default listVehicleAPI;