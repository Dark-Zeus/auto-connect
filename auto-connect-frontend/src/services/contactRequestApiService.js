import { toast } from "react-toastify";

// 🌍 Detect Backend URL (Vite or CRA)
const ENV_URL =
  import.meta.env.VITE_REACT_APP_BACKEND_API_URL ||
  import.meta.env.REACT_APP_BACKEND_URL;

const API_BASE_URL = ENV_URL || "http://localhost:3000/api/v1/";

console.log("📡 Contact API Base URL:", API_BASE_URL);

// 🧠 Universal Fetch Wrapper
async function request(endpoint = "", { method = "GET", body, params } = {}) {
  const safeEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  let url = `${API_BASE_URL}${safeEndpoint}`;

  // Add query parameters
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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  options.signal = controller.signal;

  try {
    const res = await fetch(url, options);
    clearTimeout(timeout);

    let data = {};
    try {
      data = await res.json();
    } catch {
      // If backend doesn't send JSON
      console.warn("⚠️ Response not JSON:", res.status);
    }

    if (!res.ok) {
      throw {
        response: { data, status: res.status },
        message: data?.message || `Request failed (${res.status})`,
      };
    }

    return {
      success: true,
      data: data?.data ?? data,
      message: data?.message ?? "Success",
      status: res.status,
    };
  } catch (error) {
    clearTimeout(timeout);
    throw formatError(error, `${method} ${safeEndpoint}`);
  }
}

// 📨 CONTACT API ENDPOINTS
export const contactAPI = {
  // ✅ Get all contact requests
  getAllContacts: (params = {}) => request("/usercontacts", { params }),

  // ✅ Get one contact by ID
  getContactById: (id) => request(`/usercontacts/${id}`),

  // ✅ Reply to a contact message
  replyToContact: async (id, replyMessage) => {
    try {
      const res = await request(`/usercontacts/${id}/reply`, {
        method: "PUT",
        body: { reply: replyMessage },
      });

      handleContactSuccess(res, "reply sent");
      return res;
    } catch (error) {
      handleContactError(error, "send reply");
      throw error;
    }
  },

  // ✅ Mark contact as resolved
  resolveContact: async (id) => {
    try {
      const res = await request(`/usercontacts/${id}/resolve`, { method: "PUT" });
      handleContactSuccess(res, "marked as resolved");
      return res;
    } catch (error) {
      handleContactError(error, "resolve contact");
      throw error;
    }
  },

  // ✅ Delete contact request
  deleteContact: async (id) => {
    try {
      const res = await request(`/usercontacts/${id}`, { method: "DELETE" });
      handleContactSuccess(res, "deleted contact");
      return res;
    } catch (error) {
      handleContactError(error, "delete contact");
      throw error;
    }
  },
};

// 🧩 Error Formatter
function formatError(error, operation) {
  if (error.name === "AbortError") {
    return {
      success: false,
      message: "Request timed out. Please try again.",
      error: error,
    };
  }

  if (error.message === "Failed to fetch") {
    return {
      success: false,
      message: "Network error. Please check your connection.",
      error: error,
    };
  }

  return {
    success: false,
    message: error.response?.data?.message || `Failed to ${operation}`,
    error: error.response?.data || error.message,
  };
}

// ✅ Toast Notifications
export const handleContactError = (error, operation = "operation") => {
  console.error(`❌ Contact ${operation} error:`, error);

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

export const handleContactSuccess = (response, operation = "operation") => {
  const message =
    response.message || `Contact ${operation} completed successfully!`;
  toast.success(message);
};
