import axios from "axios";
import { toast } from "react-toastify";

const API_BASE_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_API_URL ||
  import.meta.env.REACT_APP_BACKEND_URL + "/api/v1" ||
  "http://localhost:3000/api/v1";

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
      // The backend returns: { success: true, data: { user: {...} } }
      const user = response.data?.data?.user;
      if (!user || !user._id) {
        throw new Error("Invalid user data structure");
      }
      return {
        success: true,
        user: {
          ...user,
          name: `${user.firstName} ${user.lastName}`,
        },
      };
    } catch (error) {
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      // Use the /auth/me endpoint since we're getting the current logged-in user
      const response = await userAxios.get("/auth/me");
      const user = response.data?.data?.user;
      
      if (!user || !user._id) {
        throw new Error("Invalid user data structure");
      }

      // Return user data with formatted name and phone
      return {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        ...user,
      };
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  },
};

export default userApiService;