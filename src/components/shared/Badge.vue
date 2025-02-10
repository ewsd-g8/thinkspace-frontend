<template>
  <span class="badge me-1" :class="props.class">{{ props.name }}</span>
</template>
<script setup>
const props = defineProps(["name", "class"]);
</script>
