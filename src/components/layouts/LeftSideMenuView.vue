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

<!-- idea_post post and idea -->
<li> 
            <a
              href="#idea_post"
              :aria-expanded="isActive(['/admin/users', '/admin/roles'])"
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
                    :class="{
                      'router-link-active': isActive(['/admin/idea_post_post']),
                    }"
                    > <i class="mdi mdi-message-text-outline"></i><span class="ms-1">Post</span></router-link
                  >
                </li>
                <li>
                  <router-link
                    :to="{ name: 'idea_post_idea' }"
                    :class="{
                      'router-link-active': isActive(['/admin/idea_post_idea']),
                    }"
                    ><i class="mdi mdi-file-document-outline"></i><span class="ms-1">Idea</span></router-link
                  >
                </li>
              </ul>
            </div>
          </li>
<!-- user management -->
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
