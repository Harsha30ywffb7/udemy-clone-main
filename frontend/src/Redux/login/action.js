import axios from "axios";
export const AUTH = "AUTH";
export const AUTH_LOADING = "AUTH_LOADING";
export const AUTH_ERROR = "AUTH_ERROR";
export const LOGOUT = "LOGOUT";

export const auth = (user) => ({ type: AUTH, payload: user });
export const authLoading = (status) => ({
  type: AUTH_LOADING,
  payload: status,
});
export const autheError = (status) => ({ type: AUTH_ERROR, payload: status });
export const logout = () => ({ type: LOGOUT });

export const authFunction = (data, URL) => (dispatch) => {
  dispatch(authLoading(true));
  axios
    .post(URL, data)
    .then(({ data }) => {
      dispatch(auth(data));
      dispatch(authLoading(false));
      dispatch(autheError(false));
      console.log(data);

      // Store only JWT token
      localStorage.setItem("token", data.token);
    })
    .catch((err) => {
      console.log(err.message);
      dispatch(autheError(true));
      dispatch(authLoading(false));
    });
};

// Logout function
export const logoutUser = () => (dispatch) => {
  // Clear token from localStorage
  localStorage.removeItem("token");

  // Dispatch logout action to clear Redux state
  dispatch(logout());
};

// Function to fetch user data using stored token
export const fetchUserData = (token) => (dispatch) => {
  if (!token) return;
  console.log("token", token);

  dispatch(authLoading(true));
  axios
    .get("/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(({ data }) => {
      console.log("Profile data:", data);
      dispatch(auth({ user: data.user, token }));
      dispatch(authLoading(false));
      dispatch(autheError(false));
    })
    .catch((err) => {
      console.log("Profile fetch error:", err.message);
      dispatch(autheError(true));
      dispatch(authLoading(false));
    });
};
