import { createRouter, createWebHistory } from "vue-router";
import MasterView from "@/components/layouts/MasterView.vue";
import authRoutes from "./auth/auth.routes";
import appRoutes from "./app/app.routes";

const baseRoutes = [
  {
    path: "/admin",
    redirect: { name: "admin-home" },
    component: MasterView,
    meta: {
      requiresAuth: true,
    },
    children: appRoutes,
  },
  {
    path: "/",
    name: "home",
    redirect: { name: "login" },
  },
];

const routes = [...baseRoutes, ...authRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
