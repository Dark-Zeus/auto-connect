import axios from "axios";
import { toast } from "react-toastify";

// FIXED: Handle both VITE_ and REACT_APP_ environment variables
const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_API_URL ||
  import.meta.env.REACT_APP_BACKEND_URL + "/api/v1" ||
  "http://localhost:3000/api/v1"; // Default to localhost:3000

console.log("Environment variables:", {
  VITE_REACT_APP_BACKEND_API_URL: import.meta.env
    .VITE_REACT_APP_BACKEND_API_URL,
  REACT_APP_BACKEND_URL: import.meta.env.REACT_APP_BACKEND_URL,
  REACT_APP_FRONTEND_URL: import.meta.env.REACT_APP_FRONTEND_URL,
  Final_API_BASE_URL: API_BASE_URL,
});

// Create Axios instance
const subscriptionAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Add auth token
subscriptionAxios.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      "Making Subscription API request:",
      config.method.toUpperCase(),
      config.url,
      config.params || config.data
    );
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle unauthorized & logging
subscriptionAxios.interceptors.response.use(
  (response) => {
    console.log("Subscription API response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("Subscription API error:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/auth/login";
    }

    return Promise.reject(error);
  }
);

export const subscriptionAPI = {
  // Get all subscriptions
  getSubscriptions: async (params = {}) => {
    try {
      const response = await subscriptionAxios.get("/subscriptions", { params });
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message,
      };
    } catch (error) {
      throw formatError(error, "fetch subscriptions");
    }
  },

  // Get subscription by ID
  getSubscriptionById: async (id) => {
    try {
      const response = await subscriptionAxios.get(`/subscriptions/${id}`);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message,
      };
    } catch (error) {
      throw formatError(error, "fetch subscription details");
    }
  },

  // Create subscription
  createSubscription: async (subscriptionData) => {
    try {
      const response = await subscriptionAxios.post("/subscriptions", subscriptionData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message,
      };
    } catch (error) {
      throw formatError(error, "create subscription");
    }
  },

  // Update subscription
  updateSubscription: async (id, subscriptionData) => {
    try {
      const response = await subscriptionAxios.put(`/subscriptions/${id}`, subscriptionData);
      return {
        success: true,
        data: response.data.data || response.data,
        message: response.data.message,
      };
    } catch (error) {
      throw formatError(error, "update subscription");
    }
  },

  // Delete subscription
  deleteSubscription: async (id) => {
    try {
      const response = await subscriptionAxios.delete(`/subscriptions/${id}`);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      throw formatError(error, "delete subscription");
    }
  },
};

// Format error in a consistent way
function formatError(error, operation) {
  return {
    success: false,
    message: error.response?.data?.message || `Failed to ${operation}`,
    error: error.response?.data || error.message,
  };
}

// Helper: Handle API errors with toast
export const handleSubscriptionError = (error, operation = "operation") => {
  console.error(`Subscription ${operation} error:`, error);
  const message = error.message || `Failed to ${operation}. Please try again.`;

  if (error.error?.errors) {
    const validationErrors = Object.values(error.error.errors)
      .map((err) => err.message)
      .join(", ");
    toast.error(`Validation Error: ${validationErrors}`);
  } else {
    toast.error(message);
  }
};

// Helper: Handle API success with toast
export const handleSubscriptionSuccess = (response, operation = "operation") => {
  const message =
    response.message || `Subscription ${operation} completed successfully!`;
  toast.success(message);
};
