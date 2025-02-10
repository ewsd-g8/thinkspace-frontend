import { createApp } from "vue";
import "./assets/css/main.css";
import App from "./App.vue";
import router from "./router";

import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";

import { useAuthStore } from "./stores/auth";

import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";

import ValidationErrors from "@/components/shared/ValidationErrors.vue";

import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";

import Loading from "@/components/shared/TableLoading.vue";

import "mosha-vue-toastify/dist/style.css";

import Popper from "vue3-popper";

import "spinkit/spinkit.css";

router.beforeEach((to) => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;

  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.getIsAuthenticated) {
    return { name: "login" };
  }

  if (to.meta.requiresVisitor && authStore.getIsAuthenticated) {
    return { name: "dashboard" };
  }

  if (to.meta.requirePermissions) {
    if (authStore.permissions.length == 0 || authStore.roles.length == 0) {
      const user = {
        id: "",
        name: "",
        email: "",
        profile: "",
      };

      authStore.user = user;
      authStore.isAuthenticated = false;
      authStore.roles = [];
      authStore.permissions = [];

      return { name: "login" };
    }

    if (!hasPermissions(to.meta.permissions)) {
      return { name: "page-not-found" };
    }
  }
});

const app = createApp(App);

app.component("v-select", vSelect);
app.component("v-errors", ValidationErrors);
app.component("EasyDataTable", Vue3EasyDataTable);
app.component("Loading", Loading);
app.component("Popper", Popper);

const pinia = createPinia();
pinia.use(piniaPersist);

app.use(pinia);
app.use(router);
app.mount("#app");
