import { toast } from "react-toastify";
import axios from "./axios"; // Your configured axios instance

export const performLogout = async (setUserContext, navigate) => {
  try {
    // Call backend logout endpoint to invalidate server-side session/tokens
    const token = localStorage.getItem("token");

    if (token) {
      await axios.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  } catch (error) {
    console.error("Server logout error:", error);
    // Continue with client-side logout even if server call fails
  } finally {
    // Client-side cleanup (always execute)
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Clear user context
    if (setUserContext) {
      setUserContext(null);
    }

    // Show success message
    toast.success("Logged out successfully");

    // Redirect to login/home page
    if (navigate) {
      navigate("/auth/login");
    }
  }
};
