<template>
  <Loading v-if="loading"></Loading>
  <div id="wrapper">
    <TopMenuView @loading="(emittedValue) => (loading = emittedValue)" />
    <LeftSideMenuView />
    <div class="content-page">
      <ContentView />
      <FooterView />
    </div>
  </div>
</template>
<script setup>
import TopMenuView from "./TopMenuView.vue";
import LeftSideMenuView from "./LeftSideMenuView.vue";
import ContentView from "./ContentView.vue";
import FooterView from "./FooterView.vue";

import { ref, onMounted, onUnmounted } from "vue";

const loading = ref(false);
</script>
