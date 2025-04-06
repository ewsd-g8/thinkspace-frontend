<template>
  <div>
    <WelcomeModal
      v-if="isShowAlert"
      :title="modalTitle"
      :message="modalMsg"
      :show="showModal"
      @close="closeModal()"
    />
  </div>
  <router-view></router-view>
  <div>
    <WelcomeModal
      v-if="isShowAlert"
      :title="modalTitle"
      :message="modalMsg"
      :show="showModal"
      @close="closeModal()"
    />
  </div>
</template>
<script setup>
import { ref, watch, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth.js";
import { getAuthUser } from "@/composables/getAuthUser";
import WelcomeModal from "@/components/shared/modal.vue";

const showModal = ref(false);
const modalTitle = ref("");
const modalMsg = ref("");

const store = useAuthStore();
const closeModal = () => {
  showModal.value = false;
};

const authStore = useAuthStore();
const lastLogout = authStore.getUserLogout;
let isFirstLogin = authStore.getIsFirstLogin;

console.log(lastLogout);
console.log(isFirstLogin);

//show modal
const isShowAlert = computed(() => {
  let isShow = false;
  let showAlert = localStorage.getItem("show_modal");
  if (showAlert) {
    isShow = true;
    localStorage.removeItem("show_modal");
  }
  return isShow;
});

onMounted(() => {
  if (store.getIsAuthenticated) {
    getAuthUser();
  }
  if (isFirstLogin) {
    modalTitle.value = "Welcom to Think Space";
    modalMsg.value =
      "Thank you for participating us! This is your first time Logging in";
    showModal.value = true;
    isFirstLogin = false;
  } else if (lastLogout) {
    const lastLoginDate = new Date(lastLogout).toLocaleString();
    modalTitle.value = "Welcome Back!";
    modalMsg.value = `You last logged in at ${lastLoginDate}.`;
    showModal.value = true;
  }
});
</script>
