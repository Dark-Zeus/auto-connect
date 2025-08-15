import { toast } from "react-toastify";

// Base configuration
const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_API_URL || 
                     import.meta.env.REACT_APP_BACKEND_URL + "/api/v1" || 
                     "http://localhost:3000/api/v1";

const BUY_VEHICLES_ENDPOINT = `${API_BASE_URL}/buy-vehicles`;

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
const handleBuyVehicleError = (error, operation = "operation") => {
  console.error(`Buy Vehicle API Error during ${operation}:`, error);
  toast.error(error.message || `Failed to ${operation}. Please try again.`);
  throw error;
};

// Success handling helper
const handleBuyVehicleSuccess = (data, operation = "operation") => {
  toast.success(data.message || `Vehicle fetching ${operation} successful!`);
  return data;
};

// Buy Vehicle API service
const buyVehicleAPI = {
  // Fetch available vehicles
  fetchAvailableVehicles: async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(BUY_VEHICLES_ENDPOINT, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await handleResponse(response);
      return handleBuyVehicleSuccess(data, "fetched");
    } catch (error) {
      handleBuyVehicleError(error, "fetch available vehicles");
      throw error;
    }
  },

  fetchVehicleById: async (id) => {
    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const response = await fetch(`${BUY_VEHICLES_ENDPOINT}/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await handleResponse(response);
      return handleBuyVehicleSuccess(data, "fetched single vehicle");
    } catch (error) {
      handleBuyVehicleError(error, "fetch vehicle by id");
      throw error;
    }
  },
};

export default buyVehicleAPI;