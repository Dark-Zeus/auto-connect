import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_REACT_APP_BACKEND_API_URL}`,
  timeout: 30000, // 30 seconds timeout
  withCredentials: true, // Include cookies for JWT authentication
  headers: {
    "Content-Type": "application/json",
  },
  // other custom settings
});

instance.interceptors.request.use(
  function (config) {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    config.headers.Authorization = token ? `Bearer ${token}` : "";

    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };

    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🔄 ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  function (error) {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    // Calculate request duration
    if (response.config.metadata?.startTime) {
      const duration = new Date() - response.config.metadata.startTime;
      console.log(
        `✅ ${response.config.method?.toUpperCase()} ${
          response.config.url
        } (${duration}ms)`
      );
    }

    // Log successful responses in development
    if (import.meta.env.DEV) {
      console.log(`Response:`, response.data);
    }

    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    // Calculate request duration for failed requests
    if (originalRequest?.metadata?.startTime) {
      const duration = new Date() - originalRequest.metadata.startTime;
      console.log(
        `❌ ${originalRequest.method?.toUpperCase()} ${
          originalRequest.url
        } (${duration}ms)`
      );
    }

    // Enhanced error handling
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          // Handle token refresh for 401 errors
          if (
            !originalRequest._retry &&
            !originalRequest.url.includes("/auth/login")
          ) {
            originalRequest._retry = true;

            try {
              const refreshResponse = await instance.post(
                "/auth/refresh-token"
              );

              if (refreshResponse.data.success) {
                const { token } = refreshResponse.data;

                // Update stored token
                localStorage.setItem("token", token);

                // Update authorization header for original request
                originalRequest.headers.Authorization = `Bearer ${token}`;

                // Retry original request
                return instance(originalRequest);
              }
            } catch (refreshError) {
              console.error("Token refresh failed:", refreshError);
              handleAuthError("Session expired. Please log in again.");
              return Promise.reject(error);
            }
          }

          // If refresh fails or login request, redirect to auth
          handleAuthError(data.message || "Authentication failed.");
          break;

        case 403:
          // Forbidden - insufficient permissions
          toast.error(
            data.message || "Access denied. Insufficient permissions."
          );
          break;

        case 404:
          // Not found
          toast.error(data.message || "Requested resource not found.");
          break;

        case 422:
          // Validation error
          if (data.errors && Array.isArray(data.errors)) {
            data.errors.forEach((err) => {
              toast.error(err.message || err);
            });
          } else {
            toast.error(data.message || "Validation error occurred.");
          }
          break;

        case 429:
          // Rate limiting
          toast.warning("Too many requests. Please slow down and try again.");
          break;

        case 500:
          // Server error
          toast.error("Internal server error. Please try again later.");
          break;

        default:
          // Use your existing error handling
          showError(error);
      }
    } else {
      // Use your existing error handling for network errors
      showError(error);
    }

    // Original redirect logic
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      window.location.href = "/auth";
    }

    return Promise.reject(error);
  }
);

const showError = (err) => {
  console.log(err);
  if (err?.response?.data.message) {
    toast.error(err.response?.data.message);
  } else if (err?.message) {
    toast.error(err.message);
  } else {
    toast.error(err);
  }
};

// ========== APPENDED ADDITIONAL FUNCTIONALITY ==========

// Handle authentication errors
const handleAuthError = (message) => {
  // Clear stored authentication data
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");

  // Show error message
  toast.error(message);

  // Redirect to login page
  window.location.href = "/auth";
};

// Utility functions for common API operations

// Generic GET request with error handling
export const apiGet = async (url, params = {}) => {
  try {
    const response = await instance.get(url, { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generic POST request with error handling
export const apiPost = async (url, data = {}) => {
  try {
    const response = await instance.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generic PUT/PATCH request with error handling
export const apiPut = async (url, data = {}) => {
  try {
    const response = await instance.put(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const apiPatch = async (url, data = {}) => {
  try {
    const response = await instance.patch(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generic DELETE request with error handling
export const apiDelete = async (url) => {
  try {
    const response = await instance.delete(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// File upload helper with progress tracking
export const apiUploadFile = async (
  url,
  file,
  additionalData = {},
  onProgress = null
) => {
  const formData = new FormData();

  // Handle single file or File object
  if (file instanceof File) {
    formData.append("file", file);
  } else if (file instanceof FileList) {
    Array.from(file).forEach((f, index) => {
      formData.append(`file${index}`, f);
    });
  } else {
    formData.append("file", file);
  }

  // Add additional data to form
  Object.keys(additionalData).forEach((key) => {
    if (additionalData[key] !== undefined && additionalData[key] !== null) {
      formData.append(key, additionalData[key]);
    }
  });

  try {
    const response = await instance.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        if (import.meta.env.DEV) {
          console.log(`Upload Progress: ${percentCompleted}%`);
        }

        // Call progress callback if provided
        if (onProgress && typeof onProgress === "function") {
          onProgress(percentCompleted, progressEvent);
        }
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Vehicle-specific API helpers
export const vehicleAPI = {
  // Get all vehicles with filters
  getVehicles: async (params = {}) => {
    return apiGet("/vehicles", params);
  },

  // Get single vehicle
  getVehicle: async (id) => {
    return apiGet(`/vehicles/${id}`);
  },

  // Create new vehicle
  createVehicle: async (vehicleData) => {
    return apiPost("/vehicles", vehicleData);
  },

  // Update vehicle
  updateVehicle: async (id, vehicleData) => {
    return apiPatch(`/vehicles/${id}`, vehicleData);
  },

  // Delete vehicle
  deleteVehicle: async (id) => {
    return apiDelete(`/vehicles/${id}`);
  },

  // Get vehicle statistics
  getStats: async () => {
    return apiGet("/vehicles/stats");
  },

  // Search vehicles
  searchVehicles: async (searchTerm) => {
    return apiGet("/vehicles/search", { q: searchTerm });
  },

  // Export vehicle data
  exportVehicles: async () => {
    return apiGet("/vehicles/export");
  },

  // Upload vehicle document
  uploadDocument: async (vehicleId, file, documentType, description = "") => {
    return apiUploadFile(`/vehicles/${vehicleId}/documents`, file, {
      documentType,
      description,
    });
  },

  // Upload vehicle image
  uploadImage: async (vehicleId, file, imageType, description = "") => {
    return apiUploadFile(`/vehicles/${vehicleId}/images`, file, {
      imageType,
      description,
    });
  },

  // Remove document
  removeDocument: async (vehicleId, documentId) => {
    return apiDelete(`/vehicles/${vehicleId}/documents/${documentId}`);
  },

  // Remove image
  removeImage: async (vehicleId, imageId) => {
    return apiDelete(`/vehicles/${vehicleId}/images/${imageId}`);
  },
};

// Download file helper
export const apiDownloadFile = async (url, filename) => {
  try {
    const response = await instance.get(url, {
      responseType: "blob",
    });

    // Create blob link to download
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Set authentication token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete instance.defaults.headers.common["Authorization"];
  }
};

// Clear authentication
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  delete instance.defaults.headers.common["Authorization"];
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  return !!token;
};

// Get stored user data
export const getStoredUser = () => {
  const user = localStorage.getItem("user") || sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Store user data
export const storeUser = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
};

// Request interceptor for file uploads
export const createFileUploadInstance = () => {
  const uploadInstance = axios.create({
    baseURL: `${import.meta.env.VITE_REACT_APP_BACKEND_API_URL}`,
    timeout: 300000, // 5 minutes for file uploads
    withCredentials: true,
  });

  uploadInstance.interceptors.request.use((config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    config.headers.Authorization = token ? `Bearer ${token}` : "";
    return config;
  });

  return uploadInstance;
};

// Enhanced error handler specifically for vehicle operations
export const handleVehicleError = (error, operation = "operation") => {
  console.error(`Vehicle ${operation} error:`, error);

  if (error.response?.data?.errors) {
    // Handle validation errors
    error.response.data.errors.forEach((err) => {
      toast.error(`${err.field}: ${err.message}`);
    });
  } else if (error.response?.data?.message) {
    toast.error(error.response.data.message);
  } else if (error.code === "NETWORK_ERROR") {
    toast.error("Network error. Please check your connection.");
  } else {
    toast.error(`Failed to ${operation}. Please try again.`);
  }
};

// Success handler for vehicle operations
export const handleVehicleSuccess = (response, operation = "operation") => {
  if (response.success && response.message) {
    toast.success(response.message);
  } else {
    toast.success(`Vehicle ${operation} completed successfully.`);
  }
};

export default instance;
