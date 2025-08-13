import { AUTH, AUTH_ERROR, AUTH_LOADING, LOGOUT } from "./action";

const initState = {
  user: {},
  loading: false,
  error: false,
};

export const authReducer = (store = initState, { type, payload }) => {
  // console.log(payload);
  switch (type) {
    case AUTH:
      return { ...store, user: payload };
    case AUTH_LOADING:
      return { ...store, loading: payload };
    case AUTH_ERROR:
      return { ...store, error: payload };
    case LOGOUT:
      return { ...store, user: {}, loading: false, error: false };
    default:
      return store;
  }
};
