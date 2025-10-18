import { toast } from "react-toastify";

const ENV_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_API_URL ||
  import.meta.env.REACT_APP_BACKEND_URL;

const API_BASE_URL = ENV_URL ? `${ENV_URL}/api/v1` : "http://localhost:3000/api/v1";

console.log("📡 Final API_BASE_URL:", API_BASE_URL);


console.log("Environment variables:", {
  VITE_REACT_APP_BACKEND_API_URL: import.meta.env.VITE_REACT_APP_BACKEND_API_URL,
  REACT_APP_BACKEND_URL: import.meta.env.REACT_APP_BACKEND_URL,
  REACT_APP_FRONTEND_URL: import.meta.env.REACT_APP_FRONTEND_URL,
  Final_API_BASE_URL: API_BASE_URL,
});

// Generic request function using fetch
async function request(endpoint, { method = "GET", body, params } = {}) {
  let url = `${API_BASE_URL}${endpoint}`;

  // Add query params if provided
  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
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

    const data = await res.json();

    if (!res.ok) {
      throw {
        response: { data, status: res.status },
        message: data.message || "Request failed",
      };
    }

    return { success: true, data: data.data || data, message: data.message };
  } catch (error) {
    throw formatError(error, `${method} ${endpoint}`);
  }
}

// Subscription API wrapper
export const subscriptionAPI = {
  getSubscriptions: (params = {}) => request("/subscriptions", { params }),
  getSubscriptionById: (id) => request(`/subscriptions/${id}`),
  createSubscription: (subscriptionData) =>
    request("/subscriptions", { method: "POST", body: subscriptionData }),
  updateSubscription: (id, subscriptionData) =>
    request(`/subscriptions/${id}`, { method: "PUT", body: subscriptionData }),
  deleteSubscription: (id) =>
    request(`/subscriptions/${id}`, { method: "DELETE" }),
};

// Format error in a consistent way
function formatError(error, operation) {
  return {
    success: false,
    message: error.response?.data?.message || `Failed to ${operation}`,
    error: error.response?.data || error.message,
  };
}

// Toast handlers
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

export const handleSubscriptionSuccess = (response, operation = "operation") => {
  const message =
    response.message || `Subscription ${operation} completed successfully!`;
  toast.success(message);
};
