const authRoutes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
    meta: { requiresVisitor: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "page-not-found",
    component: () => import("@/views/PageNotFoundView.vue"),
  },
];

export default authRoutes;
