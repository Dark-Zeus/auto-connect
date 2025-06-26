// auto-connect-frontend/src/utils/axios.js
import axios from "axios";
import { toast } from "react-toastify";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_REACT_APP_BACKEND_API_URL}`,
  timeout: 10000,
});

instance.interceptors.request.use(function (config) {
  // Check for multiple possible token storage keys for backward compatibility
  const token =
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwtToken");

  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
});

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    showError(error);

    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Clear all possible token storage keys
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

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

export default instance;
