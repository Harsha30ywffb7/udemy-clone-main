import { authService } from "../../services/authService";

export const AUTH = "AUTH";
export const AUTH_LOADING = "AUTH_LOADING";
export const AUTH_ERROR = "AUTH_ERROR";
export const CLEAR_ERROR = "CLEAR_ERROR";
export const LOGOUT = "LOGOUT";

export const auth = (user) => ({ type: AUTH, payload: user });
export const authLoading = (status) => ({
  type: AUTH_LOADING,
  payload: status,
});
export const autheError = (status) => ({ type: AUTH_ERROR, payload: status });
export const clearError = () => ({ type: CLEAR_ERROR });
export const logout = () => ({ type: LOGOUT });

// Helper function to get user-friendly error messages
const getUserFriendlyErrorMessage = (error, isLogin = false) => {
  if (!error) return "An unexpected error occurred. Please try again.";

  const message = error.response?.data?.message || error.message || error;

  // Handle specific error cases with user-friendly messages
  switch (message.toLowerCase()) {
    case "invalid email or password":
      return "The email or password you entered is incorrect. Please check your credentials and try again.";

    case "user not found":
      return "No account found with this email address. Please check your email or sign up for a new account.";

    case "an account with this email already exists":
      return "An account with this email address already exists. Please try logging in instead.";

    case "email and password are required":
      return "Please fill in both email and password fields.";

    case "please provide a valid email address":
      return "Please enter a valid email address (e.g., user@example.com).";

    case "password must be at least 6 characters long":
      return "Password must be at least 6 characters long. Please choose a stronger password.";

    case "both first name and last name are required":
      return "Please provide both your first name and last name.";

    case "your account has been deactivated. please contact support.":
      return "Your account has been temporarily deactivated. Please contact our support team for assistance.";

    case "validation failed":
      return "Please check all fields and ensure they are filled out correctly.";

    case "internal server error":
    case "internal server error. please try again later.":
      return "We're experiencing technical difficulties. Please try again in a few moments.";

    case "network error":
      return "Unable to connect to our servers. Please check your internet connection and try again.";

    default:
      // If it's a validation error with specific field information
      if (message.includes("email") && message.includes("invalid")) {
        return "Please enter a valid email address.";
      }
      if (message.includes("password") && message.includes("short")) {
        return "Password is too short. Please use at least 6 characters.";
      }
      if (message.includes("name") && message.includes("required")) {
        return "Full name is required. Please enter your complete name.";
      }

      // Return the original message if it's already user-friendly
      return message;
  }
};

export const authFunction = (data, URL) => async (dispatch) => {
  // Clear any existing errors
  dispatch(clearError());
  dispatch(authLoading(true));

  // Client-side validation
  if (!data.email || !data.password) {
    dispatch(autheError("Please fill in both email and password fields."));
    dispatch(authLoading(false));
    return;
  }

  // Email format validation
  if (!authService.validateEmail(data.email)) {
    dispatch(autheError("Please enter a valid email address."));
    dispatch(authLoading(false));
    return;
  }

  // For signup, validate additional fields
  const isLogin = URL.includes("login");
  if (!isLogin) {
    if (!authService.validateName(data.fullName)) {
      dispatch(
        autheError("Please enter your full name (at least 2 characters).")
      );
      dispatch(authLoading(false));
      return;
    }
    if (!authService.validatePassword(data.password)) {
      dispatch(autheError("Password must be at least 6 characters long."));
      dispatch(authLoading(false));
      return;
    }
  }

  try {
    let result;
    if (isLogin) {
      result = await authService.login(data);
    } else {
      result = await authService.signup(data);
    }

    if (result.success) {
      const { user, token } = result.data;

      // Store token in localStorage immediately
      localStorage.setItem("token", token);

      // Dispatch auth action with user data and token
      dispatch(auth({ user, token }));
      dispatch(authLoading(false));
      dispatch(clearError());

      console.log("Authentication successful:", { user, token });
    } else {
      dispatch(autheError(result.message));
      dispatch(authLoading(false));
    }
  } catch (error) {
    console.log("Authentication error:", error);
    const errorMessage = getUserFriendlyErrorMessage(error, isLogin);
    dispatch(autheError(errorMessage));
    dispatch(authLoading(false));
  }
};

// Logout function
export const logoutUser = () => (dispatch) => {
  console.log("🚪 LOGOUT ACTION - Starting explicit logout process...");
  const token = localStorage.getItem("token");
  console.log(
    "🚪 LOGOUT ACTION - Current token:",
    token ? token.substring(0, 20) + "..." : "No token found"
  );

  // Dispatch logout action - this will clear the token in the reducer
  dispatch(logout());

  console.log("🚪 LOGOUT ACTION - Explicit logout completed successfully");
};

// Function to fetch user data using stored token
export const fetchUserData = (token) => async (dispatch) => {
  if (!token) {
    dispatch(authLoading(false));
    return;
  }

  console.log("Fetching user data with token:", token);
  dispatch(authLoading(true));

  try {
    const result = await authService.getProfile();

    if (result.success) {
      console.log("Profile data fetched successfully:", result.data);

      // Ensure token is stored in localStorage
      localStorage.setItem("token", token);

      // Dispatch auth action with user data and token
      dispatch(auth({ user: result.data.user, token }));
      dispatch(authLoading(false));
      dispatch(clearError());
    } else {
      console.log(
        "❌ FETCH USER DATA - Failed to fetch profile:",
        result.message
      );
      console.log("❌ FETCH USER DATA - Server returned error response");
      console.log(
        "🔄 KEEPING TOKEN - Not clearing token, only clear on explicit logout"
      );

      dispatch(autheError(result.message || "Failed to fetch user profile"));
      dispatch(authLoading(false));
    }
  } catch (error) {
    console.log("❌ FETCH USER DATA - Profile fetch error:", error.message);
    console.log("❌ FETCH USER DATA - Error status:", error.response?.status);
    console.log(
      "❌ FETCH USER DATA - Is network error?",
      error.code === "ERR_NETWORK"
    );
    console.log(
      "🔄 KEEPING TOKEN - Not clearing token, only clear on explicit logout"
    );

    // Never clear token for any errors - only clear on explicit logout
    const errorMessage =
      error.code === "ERR_NETWORK"
        ? "Unable to connect to server. Please check your connection and try again."
        : getUserFriendlyErrorMessage(error);
    dispatch(autheError(errorMessage));

    dispatch(authLoading(false));
  }
};
