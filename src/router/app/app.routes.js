const DashboardView = () => import("@/views/dashboard/IndexView.vue");

const UserIndexView = () => import("@/views/users/IndexView.vue");
const UserCreateView = () => import("@/views/users/CreateView.vue");
const UserEditView = () => import("@/views/users/EditView.vue");

const RoleIndexView = () => import("@/views/roles/IndexView.vue");
const RoleCreateView = () => import("@/views/roles/CreateView.vue");
const RoleEditView = () => import("@/views/roles/EditView.vue");

const appRoutes = [
  {
    path: "dashboard",
    name: "dashboard",
    component: DashboardView,
  },
  {
    path: "users",
    name: "user-index",
    component: UserIndexView,
  },
  {
    path: "users/create",
    name: "user-create",
    component: UserCreateView,
  },
  {
    path: "users/:id/edit",
    name: "user-edit",
    component: UserEditView,
  },
  {
    path: "roles",
    name: "role-index",
    component: RoleIndexView,
  },
  {
    path: "roles/create",
    name: "role-create",
    component: RoleCreateView,
  },
  {
    path: "roles/:id/edit",
    name: "role-edit",
    component: RoleEditView,
  },
];

export default appRoutes;
