// src/services/reviewsApi.js
import axios from "../utils/axios.js";
import { toast } from "react-toastify";

// Success handler
const handleReviewsSuccess = (data, action) => {
  const message = data.message || `Reviews ${action} successfully`;
  toast.success(message);
  return data;
};

// Error handler
const handleReviewsError = (error, action) => {
  const message = error.message || `Failed to ${action} reviews`;
  toast.error(message);
  console.error(`Error ${action} reviews:`, error);
};

// Reviews API endpoints
const reviewsAPI = {
  // Get service center's reviews (Service centers only)
  getMyReviews: async (params = {}) => {
    try {
      const response = await axios.get("/reviews/my-reviews", { params });
      return response.data;
    } catch (error) {
      handleReviewsError(error, "fetch");
      throw error;
    }
  },
};

export default reviewsAPI;
