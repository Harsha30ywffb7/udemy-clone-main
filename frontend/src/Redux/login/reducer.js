import { AUTH, AUTH_ERROR, AUTH_LOADING, CLEAR_ERROR, LOGOUT } from "./action";

const initState = {
  user: {},
  loading: false,
  error: false,
};

export const authReducer = (store = initState, { type, payload }) => {
  switch (type) {
    case AUTH:
      // When user is authenticated, store token in localStorage
      if (payload?.token) {
        console.log(
          "🔐 AUTH REDUCER - STORING TOKEN in localStorage:",
          payload.token.substring(0, 20) + "..."
        );
        localStorage.setItem("token", payload.token);
      }
      return { ...store, user: payload, error: false };
    case AUTH_LOADING:
      return { ...store, loading: payload };
    case AUTH_ERROR:
      console.log("❌ AUTH REDUCER - AUTH_ERROR occurred:", payload);
      console.log(
        "🔄 AUTH REDUCER - Token NOT cleared, only cleared on explicit logout"
      );
      return { ...store, error: payload, loading: false };
    case CLEAR_ERROR:
      return { ...store, error: false };
    case LOGOUT:
      // ONLY place where token is cleared from localStorage
      console.log(
        "🚪 AUTH REDUCER - EXPLICIT LOGOUT - CLEARING TOKEN from localStorage"
      );
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        console.log(
          "🚪 AUTH REDUCER - Token being cleared:",
          currentToken.substring(0, 20) + "..."
        );
        localStorage.removeItem("token");
        console.log(
          "🚪 AUTH REDUCER - Token successfully cleared from localStorage"
        );
      } else {
        console.log("🚪 AUTH REDUCER - No token found to clear");
      }
      return { ...initState };
    default:
      return store;
  }
};
