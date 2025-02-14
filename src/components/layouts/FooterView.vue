<template>
  <footer class="footer">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6">
          {{ currentYear }}
          &copy;
          <a
            href="https://eduplusmyanmar.com"
            class="link link-info"
            target="_blank"
            >Think Space</a
          >
          Admin System by
          <a href="javascript:void(0);" class="link link-info">EWSP-8</a>
        </div>
      </div>
    </div>
  </footer>
</template>
<script setup>
import { computed } from "vue";

const currentYear = computed(() => {
  return new Date().getFullYear();
});
</script>
