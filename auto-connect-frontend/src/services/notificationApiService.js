import { toast } from "react-toastify";

// ✅ Resolve API base URL safely
const ENV_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_API_URL ||
  import.meta.env.REACT_APP_BACKEND_URL;

const API_BASE_URL = ENV_URL || "http://localhost:3000/api/v1/";

console.log("Notification API Base URL:", API_BASE_URL);

// Generic request function using fetch
async function request(endpoint = "", { method = "GET", body, params } = {}) {
  const safeEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  let url = `${API_BASE_URL}${safeEndpoint}`;

  // Add query params if provided
  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  };

  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(url, options);

    if (res.status === 401) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/auth/login";
      return;
    }

    let data = null;
    try {
      data = await res.json();
    } catch (_) {
      data = {};
    }

    if (!res.ok) {
      throw {
        response: { data, status: res.status },
        message: data?.message || `Request failed with status ${res.status}`,
      };
    }

    return {
      success: true,
      data: data?.data || data,
      message: data?.message,
    };
  } catch (error) {
    throw formatError(error, `${method} ${safeEndpoint}`);
  }
}

// Notification API wrapper
export const notificationAPI = {
  // Get all notifications
  getAllSentNotifications: (params = {}) =>
    request("/notifications", { params }),

  // Create a new notification
  createNotification: (notificationData) =>
    request("/notifications", { method: "POST", body: notificationData }),
};

// Format error consistently
function formatError(error, operation) {
  return {
    success: false,
    message: error.response?.data?.message || `Failed to ${operation}`,
    error: error.response?.data || error.message,
  };
}

// Toast handlers
export const handleNotificationError = (error, operation = "operation") => {
  console.error(`Notification ${operation} error:`, error);

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

export const handleNotificationSuccess = (
  response,
  operation = "operation"
) => {
  const message =
    response.message || `Notification ${operation} completed successfully!`;
  toast.success(message);
};
