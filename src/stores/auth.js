import { defineStore } from "pinia";
import { Http } from "@/services/http-common";

export const useAuthStore = defineStore("auth", {
  state: () => {
    return {
      isAuthenticated: "",
      roles: [],
      permissions: [],
      access_token: null,
      user: {
        id: "",
        name: "",
        email: "",
        profile: "",
        last_logout_at: "",
        isFirstLogin: false,
        department_name: "",
      },
    };
  },
  getters: {
    getToken(state) {
      return state.access_token;
    },
    getIsAuthenticated(state) {
      return state.isAuthenticated;
    },
    getAuthName(state) {
      return state.user.name;
    },
    getAuthUser(state) {
      return state.user;
    },
    getAuthUserRoles(state) {

      
      return state.roles;
    },
    getUserId(state) {
      return state.user.id;
    },
    getUserLogout(state) {
      return state.user.last_logout_at;
    },
    getIsFirstLogin(state) {
      return state.user.isFirstLogin;
    },
    getDeptName(state) {
      return state.user.department_name;
    },
  },
  actions: {
    login(email, password) {
      return new Promise((resolve, reject) => {
        const bodyParameter = {
          email,
          password,
        };
        localStorage.setItem("show_modal", "true");
        Http.post("auth/login", bodyParameter)
          .then((res) => {
            console.log("Login View: ", res);
            this.isAuthenticated = true;
            this.access_token = res.data.data.access_token;
            this.user.id = res.data.data.user.id;
            this.user.name = res.data.data.user.name;
            this.user.email = res.data.data.user.email;
            this.user.profile = res.data.data.user.profile;
            this.roles = res.data.data.roles;
            this.permissions = res.data.data.permissions;
            this.user.last_logout_at = res.data.data.user.last_logout_at;
            this.user.isFirstLogin =
              this.user.last_logout_at === null ? true : false;
            this.user.department_name = res.data.data.department.name;
            resolve("Successfully Login");
          })
          .catch((error) => {
            reject(error.response.data);
          });
      });
    },
    logout() {
      return new Promise((resolve, reject) => {
        Http.post("auth/logout")
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    resetPassword(new_password, confirmed_new_password, token) {
      return new Promise((resolve, reject) => {
        const bodyParameter = {
          new_password,
          confirmed_new_password,
        };

        Http.put(`auth/v1/reset-password/${token}`, bodyParameter)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    updateTheme(theme) {
      this.theme = theme;
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: [
          "user",
          "isAuthenticated",
          "roles",
          "permissions",
          "access_token",
        ],
      },
    ],
  },
});
