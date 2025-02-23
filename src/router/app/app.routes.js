import ChartDemoView from "@/views/chart_demo/LineChartView.vue";
import BarChartView from "@/views/chart_demo/BarChartView.vue";
import DoughnutChartView from "@/views/chart_demo/DoughnutChartView.vue";
import LineChartView from "@/views/chart_demo/LineChartView.vue";

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
// for category
const categoryIndexView = () => import("@/views/category/IndexView.vue");
const categoryCreateView = () => import("@/views/category/CreateView.vue");
const categoryEditView = () => import("@/views/category/EditView.vue");

// for department
const departmentIndexView = () => import("@/views/departments/IndexView.vue");
const departmentCreateView = () => import("@/views/departments/CreateView.vue");
const departmentEditView = () => import("@/views/departments/EditView.vue");

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
    path: "closure/:id/edit",
    name: "closure-update",
    component: ClosureEditView,
  },

  // for category
  {
    path: "category",
    name: "category-index",
    component: categoryIndexView,
  },
  {
    path: "category/create",
    name: "category-create",
    component: categoryCreateView,
  },
  {
    path: "category/:id/edit",
    name: "category-edit",
    component: categoryEditView,
  },
  // for department
  {
    path: "department",
    name: "department-index",
    component: departmentIndexView,
  },
  {
    path: "department/create",
    name: "department-create",
    component: departmentCreateView,
  },
  {
    path: "department/:id/edit",
    name: "department-edit",
    component: departmentEditView,
  },

  {
    path: "chart_demo/bar",
    name: "bar",
    component: BarChartView,
  },
  {
    path: "chart_demo/doughnut",
    name: "doughnut",
    component: DoughnutChartView,
  },
  {
    path: "chart_demo/line",
    name: "line",
    component: LineChartView,
  },
];

export default appRoutes;
