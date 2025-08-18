import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Wishlist API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Wishlist API Service
export const wishlistService = {
  // Get user's wishlist
  getWishlist: async () => {
    try {
      const response = await apiClient.get("/wishlist");
      return response.data;
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      throw error;
    }
  },

  // Add course to wishlist
  addToWishlist: async (courseId) => {
    try {
      const response = await apiClient.post("/wishlist", { courseId });
      return response.data;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  },

  // Remove course from wishlist
  removeFromWishlist: async (courseId) => {
    try {
      const response = await apiClient.delete(`/wishlist/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  },

  // Toggle course in wishlist
  toggleWishlist: async (courseId) => {
    try {
      const response = await apiClient.post("/wishlist/toggle", { courseId });
      return response.data;
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      throw error;
    }
  },

  // Check if course is in wishlist
  checkWishlist: async (courseId) => {
    try {
      const response = await apiClient.get(`/wishlist/check/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Error checking wishlist:", error);
      throw error;
    }
  },

  // Clear entire wishlist
  clearWishlist: async () => {
    try {
      const response = await apiClient.delete("/wishlist");
      return response.data;
    } catch (error) {
      console.error("Error clearing wishlist:", error);
      throw error;
    }
  },
};

// Export default for convenience
export default wishlistService;
