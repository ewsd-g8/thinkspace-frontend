<template>
  <router-view></router-view>
</template>
<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import { getAuthUser } from "@/composables/getAuthUser";

const store = useAuthStore();

onMounted(() => {
  if (store.getIsAuthenticated) {
    getAuthUser();
  }
});
</script>
