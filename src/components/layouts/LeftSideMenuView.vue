<template>
  <div class="left-side-menu">
    <div class="h-100" data-simplebar>
      <div id="sidebar-menu">
        <ul id="side-menu">
          

          <!-- Dashboard (Visible to QAmanager, QAcoordinator, Superadmin) -->
          <li v-if="canAccessAdminFeatures">
            <router-link :to="{ name: 'dashboard' }">
              <i class="mdi mdi-desktop-mac-dashboard"></i>
              <span> Dashboards </span>
            </router-link>
          </li>

          <li class="menu-title mt-2"></li>

          <!-- Category (Visible to QAmanager, QAcoordinator, Superadmin) -->
          <li v-if="canAccessAdminFeatures">
            <router-link :to="{ name: 'category-index' }">
              <i class="mdi mdi-folder"></i>
              <span> Category </span>
            </router-link>
          </li>

          <!-- Department (Visible to QAmanager, QAcoordinator, Superadmin) -->
          <li v-if="canAccessAdminFeatures">
            <router-link :to="{ name: 'department-index' }">
              <i class="mdi mdi-office-building"></i>
              <span> Department </span>
            </router-link>
          </li>

          <!-- Report Type (Visible to QAmanager, QAcoordinator, Superadmin) -->
          <li v-if="canAccessAdminFeatures">
            <router-link :to="{ name: 'reportType-index' }">
              <i class="icon-flag"></i>
              <span> Report Type </span>
            </router-link>
          </li>

          <!-- Idea Post (Visible to Staff, QAmanager, QAcoordinator, Superadmin) -->
          <li v-if="canAccessIdeaPost">
            <a
              href="#idea_post"
              :aria-expanded="
                isActive(['/admin/idea_post_post', '/admin/idea_post_idea'])
              "
              data-bs-toggle="collapse"
            >
              <i class="mdi mdi-lightbulb-outline"></i>
              <span> Idea Post </span>
              <span class="menu-arrow"></span>
            </a>
            <div
              class="collapse"
              :class="{
                show: isActive(['/admin/idea_post_post', '/admin/idea_post_idea']),
              }"
              id="idea_post"
            >
              <ul class="nav-second-level">
                <li>
                  <router-link
                    :to="{ name: 'idea_post_post' }"
                    :class="{ 'router-link-active': isActive(['/admin/idea_post_post']) }"
                  >
                    <i class="mdi mdi-message-text-outline"></i>
                    <span class="ms-1">Post</span>
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'idea_post_idea' }"
                    :class="{ 'router-link-active': isActive(['/admin/idea_post_idea']) }"
                  >
                    <i class="mdi mdi-file-document-outline"></i>
                    <span class="ms-1">Idea</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </li>

          <!-- User Management (Visible to QAmanager, QAcoordinator, Superadmin) -->
          <li v-if="canAccessAdminFeatures">
            <a
              href="#user-management"
              :aria-expanded="isActive(['/admin/users', '/admin/roles'])"
              data-bs-toggle="collapse"
            >
              <i class="mdi mdi-account-group"></i>
              <span> User Management </span>
              <span class="menu-arrow"></span>
            </a>
            <div
              class="collapse"
              :class="{ show: isActive(['/admin/users', '/admin/roles']) }"
              id="user-management"
            >
              <ul class="nav-second-level">
                <li>
                  <router-link
                    :to="{ name: 'user-index' }"
                    :class="{ 'router-link-active': isActive(['/admin/users']) }"
                  >
                    Users
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'role-index' }"
                    :class="{ 'router-link-active': isActive(['/admin/roles']) }"
                  >
                    Roles
                  </router-link>
                </li>
              </ul>
            </div>
          </li>

          <!-- Closure (Visible to QAmanager, QAcoordinator, Superadmin) -->
          <li v-if="canAccessAdminFeatures">
            <router-link :to="{ name: 'closure-index' }">
              <i class="mdi mdi-desktop-mac-dashboard"></i>
              <span> Closure </span>
            </router-link>
          </li>

          <!-- Chart Demo (Visible to QAmanager, QAcoordinator, Superadmin) -->
          <li v-if="canAccessAdminFeatures">
            <a
              href="#chart_demo"
              :aria-expanded="
                isActive(['/admin/chart_demo/bar', '/admin/chart_demo/doughnut', '/admin/chart_demo/line'])
              "
              data-bs-toggle="collapse"
            >
              <i class="mdi mdi-account-group"></i>
              <span> Chart Demo </span>
              <span class="menu-arrow"></span>
            </a>
            <div
              class="collapse"
              :class="{
                show: isActive(['/admin/chart_demo/bar', '/admin/chart_demo/doughnut', '/admin/chart_demo/line']),
              }"
              id="chart_demo"
            >
              <ul class="nav-second-level">
                <li>
                  <router-link
                    :to="{ name: 'bar' }"
                    :class="{ 'router-link-active': isActive(['/chart_demo/bar']) }"
                  >
                    Bar Chart
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'doughnut' }"
                    :class="{ 'router-link-active': isActive(['/chart_demo/doughnut']) }"
                  >
                    Doughnut Chart
                  </router-link>
                </li>
                <li>
                  <router-link
                    :to="{ name: 'line' }"
                    :class="{ 'router-link-active': isActive(['/chart_demo/line']) }"
                  >
                    Line Chart
                  </router-link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div class="clearfix"></div>
    </div>
  </div>
</template>
<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Http } from "@/services/http-common";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Get the user's roles from the auth store
const userRoles = computed(() => authStore.getAuthUserRoles || []);

// Define roles for different access levels
const ideaPostRoles = ["Staff", "QAmanager", "QAcoordinator", "Superadmin"]; // Idea Post access
const adminFeatureRoles = ["QAmanager", "QAcoordinator", "Superadmin"]; // Admin features including Dashboard

// Check if the user can access "Idea Post"
const canAccessIdeaPost = computed(() => {
  console.log("Checking canAccessIdeaPost, roles:", userRoles.value);
  return userRoles.value.some((role) => ideaPostRoles.includes(role));
});

// Check if the user can access admin features (Dashboard, Category, Department, Report Type, User Management, Closure, Chart Demo)
const canAccessAdminFeatures = computed(() => {
  console.log("Checking canAccessAdminFeatures, roles:", userRoles.value);
  return userRoles.value.some((role) => adminFeatureRoles.includes(role));
});

// Check if the current route is active
const isActive = (paths) => {
  return paths.some((path) => route.path.startsWith(path));
};

// Fetch user data if not authenticated
onMounted(async () => {
  console.log("Auth store state:", {
    isAuthenticated: authStore.getIsAuthenticated,
    roles: userRoles.value,
    token: authStore.getToken,
  });
  if (!authStore.getIsAuthenticated && authStore.getToken) {
    try {
      const res = await Http.get("auth-user");
      authStore.isAuthenticated = true;
      authStore.user = res.data.data;
      authStore.roles = res.data.data.roles.map((r) => r.name); // Map role names
      console.log("Fetched user roles:", authStore.roles);
    } catch (error) {
      console.error("Failed to fetch auth user:", error);
      router.push({ name: "login" });
    }
  } else if (!authStore.getToken) {
    router.push({ name: "login" });
  } else {
    console.log("Already authenticated, roles:", userRoles.value);
  }
});
</script>