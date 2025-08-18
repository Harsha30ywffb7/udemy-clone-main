import { AUTH, AUTH_ERROR, AUTH_LOADING, CLEAR_ERROR, LOGOUT } from "./action";

const initState = {
  user: {},
  loading: false,
  error: false,
};

export const authReducer = (store = initState, { type, payload }) => {
  // console.log(payload);
  switch (type) {
    case AUTH:
      return { ...store, user: payload, error: false };
    case AUTH_LOADING:
      return { ...store, loading: payload };
    case AUTH_ERROR:
      return { ...store, error: payload, loading: false };
    case CLEAR_ERROR:
      return { ...store, error: false };
    case LOGOUT:
      return { ...initState };
    default:
      return store;
  }
};
