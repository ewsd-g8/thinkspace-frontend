import axios from "axios";
import { useAuthStore } from "@/stores/auth.js";
import router from "../router";
import { createToast } from "mosha-vue-toastify";
const http = axios.create();

// http.defaults.withCredentials = true;
http.interceptors.request.use(
  function (config) {
    let store = useAuthStore();
    config.headers.Authorization = `Bearer ${store.access_token}`;
    config.baseURL = import.meta.env.VITE_APP_BASE_API_URL;
    return config;
  },
  function error(error) {
    return Promise.reject(error.response);
  }
);

http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      let store = useAuthStore();
      store.$reset();
      router.push({ name: "login" });
      createToast(
        {
          title: "Oops!",
          description: "Please login again.",
        },
        {
          type: "danger",
          showIcon: true,
        }
      );
      return Promise.reject(err);
      // const authStore = useAuthStore();
      // return await authStore
      //   .refreshToken()
      //   .then(() => {
      //     error.config.headers.Authorization = `Bearer ${authStore.access_token}`;
      //     return http(error.config);
      //   })
      //   .catch((err) => {
      //     authStore.$reset();
      //     router.push({ name: "login" });
      //     createToast(
      //       {
      //         title: "Oops!",
      //         description: "Please login again.",
      //       },
      //       {
      //         type: "danger",
      //         showIcon: true,
      //       }
      //     );
      //     return Promise.reject(err);
      //   });
    }
    return Promise.reject(error);
  }
);

export const Http = http;
