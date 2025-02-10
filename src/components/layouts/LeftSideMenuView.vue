<template>
  <div class="left-side-menu">
    <div class="h-100" data-simplebar>
      <div id="sidebar-menu">
        <ul id="side-menu">
          <li class="menu-title">Home</li>
          <li>
            <router-link :to="{ name: 'dashboard' }">
              <i class="mdi mdi-desktop-mac-dashboard"></i>
              <span> Dashboards </span>
            </router-link>
          </li>

          <li class="menu-title mt-2">ADMINISTRATOR</li>
          <li>
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
              :class="{
                show: isActive(['/admin/users', '/admin/roles']),
              }"
              id="user-management"
            >
              <ul class="nav-second-level">
                <li>
                  <router-link
                    :to="{ name: 'user-index' }"
                    :class="{
                      'router-link-active': isActive(['/admin/users']),
                    }"
                    >Users</router-link
                  >
                </li>
                <li>
                  <router-link
                    :to="{ name: 'role-index' }"
                    :class="{
                      'router-link-active': isActive(['/admin/roles']),
                    }"
                    >Roles</router-link
                  >
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
import { useRoute } from "vue-router";
import { hasPermission } from "@/composables/checkAuthorize";

const route = useRoute();

const isActive = (paths) => {
  let value = paths.filter((path) => {
    return route.path.startsWith(path);
  });

  if (value.length) return true;
};
</script>
