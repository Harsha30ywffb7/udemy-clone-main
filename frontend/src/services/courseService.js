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
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Course API Service
export const courseService = {
  // Get course basic data (for sidebar and header)
  getCourseBasic: async (courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/basic`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course basic data:", error);
      throw error;
    }
  },

  // Get course detailed data (for main content)
  getCourseDetailed: async (courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/detailed`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course detailed data:", error);
      throw error;
    }
  },

  // Get course curriculum/sections
  getCourseCurriculum: async (courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/curriculum`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course curriculum:", error);
      throw error;
    }
  },

  // Get course instructor data
  getCourseInstructor: async (courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/instructor`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course instructor:", error);
      throw error;
    }
  },

  // Get course reviews
  getCourseReviews: async (courseId, params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiClient.get(
        `/courses/${courseId}/reviews?${queryParams}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching course reviews:", error);
      throw error;
    }
  },

  // Get recommended courses
  getRecommendedCourses: async (courseId, limit = 6) => {
    try {
      const response = await apiClient.get(
        `/courses/${courseId}/recommended?limit=${limit}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching recommended courses:", error);
      throw error;
    }
  },

  // Get related topics
  getRelatedTopics: async (courseId) => {
    try {
      const response = await apiClient.get(
        `/courses/${courseId}/related-topics`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching related topics:", error);
      throw error;
    }
  },

  // Get course categories
  getCourseCategories: async (courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/categories`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course categories:", error);
      throw error;
    }
  },

  // Get course preview content
  getCoursePreview: async (courseId, contentId) => {
    try {
      const response = await apiClient.get(
        `/courses/${courseId}/preview/${contentId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching course preview:", error);
      throw error;
    }
  },

  // Get course statistics
  getCourseStats: async (courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/stats`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course stats:", error);
      throw error;
    }
  },

  // Get course pricing
  getCoursePricing: async (courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}/pricing`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course pricing:", error);
      throw error;
    }
  },

  // Get all courses (with filters)
  getAllCourses: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/courses?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all courses:", error);
      throw error;
    }
  },

  // Get specific course (legacy endpoint)
  getCourse: async (courseId) => {
    try {
      const response = await apiClient.get(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching course:", error);
      throw error;
    }
  },

  // Create new course (instructor only)
  createCourse: async (courseData) => {
    try {
      const response = await apiClient.post("/courses", courseData);
      return response.data;
    } catch (error) {
      console.error("Error creating course:", error);
      throw error;
    }
  },

  // Update course (instructor only)
  updateCourse: async (courseId, courseData) => {
    try {
      const response = await apiClient.put(`/courses/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  },

  // Delete course (instructor only)
  deleteCourse: async (courseId) => {
    try {
      const response = await apiClient.delete(`/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  },

  // Get instructor's courses
  getInstructorCourses: async () => {
    try {
      const response = await apiClient.get("/courses/instructor");
      return response.data.courses;
    } catch (error) {
      console.error("Error fetching instructor courses:", error);
      throw error;
    }
  },
};

// Utility functions for course data
export const courseUtils = {
  // Format duration from seconds to readable format
  formatDuration: (seconds) => {
    if (!seconds) return "0min";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours === 0) {
      return `${minutes}min`;
    } else {
      return `${hours}h ${minutes}min`;
    }
  },

  // Format price with currency
  formatPrice: (price, currency = "INR") => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
    }).format(price);
  },

  // Calculate discount percentage
  calculateDiscount: (originalPrice, currentPrice) => {
    if (!originalPrice || !currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  },

  // Format date
  formatDate: (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}/${date.getFullYear()}`;
  },

  // Get content type icon
  getContentTypeIcon: (contentType) => {
    const iconMap = {
      video: "udi udi-video",
      article: "udi udi-article",
      quiz: "udi udi-quiz",
      assignment: "udi udi-assignment",
      practice_test: "udi udi-practice-test",
      coding_exercise: "udi udi-coding-exercise",
      file: "udi udi-file",
      audio: "udi udi-audio",
      presentation: "udi udi-presentation",
      discussion: "udi udi-discussion",
      announcement: "udi udi-announcement",
      external_link: "udi udi-external-link",
    };
    return iconMap[contentType] || "udi udi-video";
  },

  // Check if content can be previewed
  canPreview: (contentItem) => {
    return contentItem.can_be_previewed || contentItem.is_free;
  },

  // Get course level color
  getLevelColor: (level) => {
    const colorMap = {
      Beginner: "green",
      Intermediate: "yellow",
      Advanced: "red",
      "All Levels": "blue",
    };
    return colorMap[level] || "blue";
  },

  // Get rating stars
  getRatingStars: (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push("full");
    }

    if (hasHalfStar) {
      stars.push("half");
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push("empty");
    }

    return stars;
  },

  // Truncate text
  truncateText: (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  },

  // Generate initials from name
  getInitials: (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  },
};

// Export default for convenience
export default courseService;
