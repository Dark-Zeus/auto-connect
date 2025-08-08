import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_API_URL ||
  import.meta.env.REACT_APP_BACKEND_URL + "/api/v1" ||
  "http://localhost:3000/api/v1";

console.log("User API service - API Base URL:", API_BASE_URL);

const userAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

userAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

userAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("User API error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

const userApiService = {
  getCurrentUser: async () => {
    try {
      const response = await userAxios.get("/auth/me");
      console.log("Raw API response:", response);
      console.log("User data received:", response.data);

      // Handle nested user object
      const user = response.data.user?.user || response.data.user || response.data;
      if (!user || !user._id) {
        throw new Error("Invalid user data structure");
      }

      return {
        success: true,
        user, // Return the inner user object
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      console.error("Error response:", error.response?.data);

      if (process.env.NODE_ENV === "development" || import.meta.env.DEV) {
        console.warn("Using mock user data for development");
        return {
          success: true,
          user: {
            _id: "mock-user-id",
            firstName: "Test",
            lastName: "User",
            email: "testuser@example.com",
            name: "Test User",
            nicNumber: "123456789V",
            role: "vehicle_owner",
          },
        };
      }

      throw error;
    }
  },
};

export default userApiService;