

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

// for category
const ReportTypeIndexView = () => import("@/views/report_type/IndexView.vue");
const ReportTypeCreateView = () => import("@/views/report_type/CreateView.vue");
const ReportTypeEditView = () => import("@/views/report_type/EditView.vue");

// for report
const reportView = () => import("@/views/idea_post/idea_report.vue");
const reportDetail = () => import("@/views/idea_post/report_detail.vue");

// for idea
const ideadetailsview = () => import("@/views/idea_post/ideadetails.vue");
const ideareportdetailsview = () =>import ("@/views/idea_post/report_idea_details.vue");
const appRoutes = [
  {
    path: "dashboard",
    name: "dashboard",
    component: DashboardView,
    meta : {
      requirePermissions: true,
      permissions:['dashboard-view'],

    },
  },
  {
    path: "users",
    name: "user-index",
    component: UserIndexView,
    meta : {
      requirePermissions: true,
      permissions:['user-list'],

    },
  },
  {
    path: "users/create",
    name: "user-create",
    component: UserCreateView,
    meta : {
      requirePermissions: true,
      permissions:['user-create'],

    },
  },
  {
    path: "users/:id/edit",
    name: "user-edit",
    component: UserEditView,
    meta : {
      requirePermissions: true,
      permissions:['user-edit'],

    },
  },
  {
    path: "roles",
    name: "role-index",
    component: RoleIndexView,
    meta : {
      requirePermissions: true,
      permissions:['role-list'],
    },
  },
  {
    path: "roles/create",
    name: "role-create",
    component: RoleCreateView,
    meta : {
      requirePermissions: true,
      permissions:['role-create'],
    },
  },
  {
    path: "roles/:id/edit",
    name: "role-edit",
    component: RoleEditView,
    meta : {
      requirePermissions: true,
      permissions:['role-edit'],
    },
  },
  {
    path: "idea_post/idea",
    name: "idea_post_idea",
    component: IdeaPostView,
    meta : {
      requirePermissions: true,
      permissions:['idea-list'],
    },
  },
  {
    path: "idea_post/post",
    name: "idea_post_post",
    component: PostView,
    meta : {
      requirePermissions: true,
      permissions:['idea-create'],
    },
  },
  {
    path: "idea_post/term_and_condition",
    name: "term_and_condition",
    component: TermView,
    meta : {
      requirePermissions: true,
      permissions:['idea-create'],
    },
  },
  {
    path: "closure",
    name: "closure-index",
    component: ClosureIndexView,
    meta : {
      requirePermissions: true,
      permissions:['closure-list'],

    },
  },
  {
    path: "closure/create",
    name: "closure-create",
    component: ClosureCreateView,
    meta : {
      requirePermissions: true,
      permissions:["closure-create"],

    },
  },
  {
    path: "closure/:id/edit",
    name: "closure-update",
    component: ClosureEditView,
    meta : {
      requirePermissions: true,
      permissions:['closure-edit'],

    },
  },

  // for category
  {
    path: "category",
    name: "category-index",
    component: categoryIndexView,
    meta : {
      requirePermissions: true,
      permissions:["category-list"],

    },
  },
  {
    path: "category/create",
    name: "category-create",
    component: categoryCreateView,
    meta : {
      requirePermissions: true,
      permissions:["category-create"],

    },
  },
  {
    path: "category/:id/edit",
    name: "category-edit",
    component: categoryEditView,
    meta : {
      requirePermissions: true,
      permissions:['category-edit'],

    },
  },
  // for department
  {
    path: "department",
    name: "department-index",
    component: departmentIndexView,
    meta : {
      requirePermissions: true,
      permissions:['department-list'],

    },
  },
  {
    path: "department/create",
    name: "department-create",
    component: departmentCreateView,
    meta : {
      requirePermissions: true,
      permissions:['department-create'],

    },
  },
  {
    path: "department/:id/edit",
    name: "department-edit",
    component: departmentEditView,
    meta : {
      requirePermissions: true,
      permissions:['department-edit'],

    },
  },


  // for idea 
  {
    path: "idea/:id",
    name: "idea_details",
    component: ideadetailsview,
    meta : {
      requirePermissions: true,
      permissions:['idea-list'],

    },
  },
  {
    path: "idea/:id/reportdetails",
    name: "report_idea_details",
    component: ideareportdetailsview,
    meta : {
      requirePermissions: true,
      permissions:['report-create'],

    },
  },
  

  // for report type
  {
    path: "reportType",
    name: "reportType-index",
    component: ReportTypeIndexView,
    meta : {
      requirePermissions: true,
      permissions:['reportType-list'],

    },
  },
  {
    path: "reportType/create",
    name: "reportType-create",
    component: ReportTypeCreateView,
    meta : {
      requirePermissions: true,
      permissions:['reportType-create'],

    },
  },
  {
    path: "reportType/:id/edit",
    name: "reportType-edit",
    component: ReportTypeEditView,
    meta : {
      requirePermissions: true,
      permissions:['reportType-edit'],

    },
  },

  // for report
  {
    path: "report/:id",
    name: "idea_report",
    component: reportView,
    meta : {
      requirePermissions: true,
      permissions:['reportType-edit'],

    },
  },

  //for report reason
  {
    path: "report_detail/:id/:ideaid",
    name: "report_detail",
    component: reportDetail,
  },
];

export default appRoutes;
