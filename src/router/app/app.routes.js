const DashboardView = () => import("@/views/dashboard/IndexView.vue");

const UserIndexView = () => import("@/views/users/IndexView.vue");
const UserCreateView = () => import("@/views/users/CreateView.vue");
const UserEditView = () => import("@/views/users/EditView.vue");

const RoleIndexView = () => import("@/views/roles/IndexView.vue");
const RoleCreateView = () => import("@/views/roles/CreateView.vue");
const RoleEditView = () => import("@/views/roles/EditView.vue");

const IdeaPostView = () => import("@/views/idea_post/idea.vue");
const PostView = () => import("@/views/idea_post/post.vue");
const TermView = () => import("@/views/idea_post/term_and_condition.vue");

const ClosureIndexView = () => import("@/views/closure/IndexView.vue");
const ClosureCreateView = () => import("@/views/closure/CreateView.vue");
const ClosureEditView = () => import("@/views/closure/UpdateView.vue");

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
  {
    path: "idea_post/idea",
    name: "idea_post_idea",
    component: IdeaPostView,
  },
  {
    path: "idea_post/post",
    name: "idea_post_post",
    component: PostView,
  },
  {
    path: "idea_post/term_and_condition",
    name: "term_and_condition",
    component: TermView,
  },
  {
    path: "closure",
    name: "closure-index",
    component: ClosureIndexView,
  },
  {
    path: "closure/create",
    name: "closure-create",
    component: ClosureCreateView,
  },
  {
    path: "closure/update",
    name: "closure-update",
    component: ClosureEditView,
  },
];

export default appRoutes;
