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
  // Only show toast for non-fetch operations
  if (operation !== "fetched" && operation !== "fetched single vehicle") {
    toast.success(data.message || `Vehicle fetching ${operation} successful!`);
  }
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

  saveAd: async (vehicleId) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token not found. Please log in again.");

      const response = await fetch(`${BUY_VEHICLES_ENDPOINT}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ vehicleId })
      });

      const data = await handleResponse(response);
      return handleBuyVehicleSuccess(data, "saved");
    } catch (error) {
      handleBuyVehicleError(error, "save ad");
      throw error;
    }
  },

  unsaveAd: async (vehicleId) => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token not found. Please log in again.");

      const response = await fetch(`${BUY_VEHICLES_ENDPOINT}/unsave`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ vehicleId })
      });

      const data = await handleResponse(response);
      return handleBuyVehicleSuccess(data, "unsaved");
    } catch (error) {
      handleBuyVehicleError(error, "unsave ad");
      throw error;
    }
  },

  fetchSavedAds: async () => {
    try {
      const token = getAuthToken();
      if (!token) throw new Error("Authentication token not found. Please log in again.");

      const response = await fetch(`${BUY_VEHICLES_ENDPOINT}/saved`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await handleResponse(response);
      if (!data.success) return [];
      if (!data.data || !Array.isArray(data.data)) return [];
      return data.data;
    } catch (error) {
      console.error("Error fetching saved ads:", error);
      return [];
    }
  },

// Add this new method to check if a specific vehicle is saved
checkIfSaved: async (vehicleId) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication token not found");

    // Try to find this vehicle in saved ads
    const savedAds = await buyVehicleAPI.fetchSavedAds();
    
    // Simple check if this ID exists in saved vehicles
    for (const ad of savedAds) {
      if ((ad.vehicleId === vehicleId) || 
          (ad.vehicleId && ad.vehicleId._id === vehicleId)) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error checking if vehicle is saved:", error);
    return false;
  }
},

filterVehicles: async (filterData) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication token not found. Please log in again.");

    const response = await fetch(`${BUY_VEHICLES_ENDPOINT}/filter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(filterData)
    });

    const data = await handleResponse(response);
    return handleBuyVehicleSuccess(data, "filtered");
  } catch (error) {
    handleBuyVehicleError(error, "filter vehicles");
    throw error;
  }
},

checkIfReported: async (adId) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication token not found. Please log in again.");
    const response = await fetch(`${BUY_VEHICLES_ENDPOINT}/check-reported?adId=${adId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await handleResponse(response);
    return data.reported;
  } catch (error) {
    handleBuyVehicleError(error, "check if reported");
    throw error;
  }
},

reportAd: async ({ adId, issue, details }) => {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Authentication token not found. Please log in again.");

    const response = await fetch(`${BUY_VEHICLES_ENDPOINT}/report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ adId, issue, details })
    });

    const data = await handleResponse(response);
    return handleBuyVehicleSuccess(data, "reported");
  } catch (error) {
    handleBuyVehicleError(error, "report ad");
    throw error;
  }
},

};

export default buyVehicleAPI;