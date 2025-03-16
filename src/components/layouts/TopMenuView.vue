<template>
  <div class="navbar-custom">
    <div class="container-fluid">
      <ul class="list-unstyled topnav-menu float-end mb-0">
        <li class="d-none d-lg-block"></li>

        <li class="dropdown d-none d-lg-inline-block">
          <a
            @click="enableFullScreenMode()"
            class="nav-link dropdown-toggle arrow-none waves-effect waves-light"
            data-toggle="fullscreen"
            href="#"
          >
            <i class="fe-maximize noti-icon"></i>
          </a>
        </li>
        <li class="dropdown notification-list topbar-dropdown">
          <a
            class="nav-link dropdown-toggle nav-user me-0 waves-effect waves-light"
            data-bs-toggle="dropdown"
            href="#"
            role="button"
            aria-haspopup="false"
            aria-expanded="false"
          >
            <img
              :src="
                store.getAuthUser.profile
                  ? store.getAuthUser.profile
                  : '/images/users/user-1.jpg'
              "
              class="rounded-circle"
            />
            <span class="pro-user-name ms-1">
              {{ store.getAuthName }} <i class="mdi mdi-chevron-down"></i>
            </span>
          </a>
          <div class="dropdown-menu dropdown-menu-end profile-dropdown">
            <!-- item-->
            <div class="dropdown-header noti-title">
              <h6 class="text-overflow m-0">Welcome !</h6>
            </div>
            <div class="dropdown-divider"></div>

            <!-- item-->
            <a
              href="javascript:void(0);"
              @click="logout()"
              class="dropdown-item notify-item"
            >
              <i class="fe-log-out"></i>
              <span>Logout</span>
            </a>
          </div>
        </li>
      </ul>

      <!-- LOGO -->
      <div class="logo-box">
        <a href="index.html" class="logo logo-dark text-center">
          <span class="logo-sm">
            <img
              src="/icon/think-space.png"
              alt=""
              class="img-fluid"
              height="22"
            />
          </span>
          <span class="logo-lg">
            <img
              src="/icon/think-space.png"
              alt=""
              class="img-fluid"
              height="20"
            />
          </span>
        </a>

        <a href="index.html" class="logo logo-light text-center">
          <span class="logo-sm">
            <img
              src="/icon/think-space-white-logo.png"
              alt=""
              class="img-fluid"
              height="22"
            />
          </span>
          <span class="logo-lg">
            <img
              src="/icon/think-space-icon.png"
              alt=""
              class="img-fluid"
              height="10"
              
            />
          </span>
        </a>
      </div>

      <ul class="list-unstyled topnav-menu topnav-menu-left m-0">
        <li>
          <button
            class="button-menu-mobile waves-effect waves-light"
            @click="clickMenuIcon()"
          >
            <i class="fe-menu"></i>
          </button>
        </li>

        <li>
          <!-- Mobile menu toggle (Horizontal Layout)-->
          <a
            class="navbar-toggle nav-link"
            data-bs-toggle="collapse"
            data-bs-target="#topnav-menu-content"
          >
            <div class="lines">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </a>
          <!-- End mobile menu toggle-->
        </li>
      </ul>
      <div class="clearfix"></div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import { useRouter } from "vue-router";
import { createToast } from "mosha-vue-toastify";
import {
  clickMenuIcon,
  enableFullScreenMode,
} from "@/composables/template/customFunctions.js";

const router = useRouter();
const store = useAuthStore();
let userId = store.getAuthUser.id;
const emit = defineEmits(["loading"]);

const logout = async () => {
  emit("loading", true);
  await store
    .logout()
    .then(() => {
      router.push({ name: "login" });
      const user = {
        id: "",
        name: "",
        email: "",
        profile: "",
      };

      store.user = user;
      store.isAuthenticated = false;
      store.access_token = "";
      store.roles = [];
      store.permissions = [];

      createToast(
        {
          title: "Success",
          description: "You are successfully logout!",
        },
        {
          type: "success",
          showIcon: true,
        }
      );
    })
    .catch(() => {
      router.push({ name: "login" });
    });

  emit("loading", false);
};
</script>
