import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// const api = axios.create({
//   baseURL:'http://localhost:5000',
//   withCredentials: true,
// });


import { toast } from "react-toastify";
import { store } from "../store/store";
import { clearUser } from "../features/userSlice";
api.interceptors.response.use(
  (response) => response, 

  (error) => {
    if (error.code === "ERR_NETWORK") {
      toast.error("Network error! Check server or internet.");
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      toast.error("Session expired, please login again.");
      store.dispatch(clearUser());
      window.location.href = "/";
      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
      toast.error("You do not have permission to access this.");
      return Promise.reject(error);
    }

    if (error.response?.status >= 500) {
      toast.error("Server error, please try again later.");
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);



export default api;
