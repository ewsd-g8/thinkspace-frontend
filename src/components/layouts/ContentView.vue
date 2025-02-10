<template>
  <div class="content">
    <div class="my-2">
      <router-view v-slot="{ Component, route }">
        <transition name="fade-down" mode="out-in">
          <component :is="Component" :key="route.path"></component>
        </transition>
      </router-view>
    </div>
  </div>
</template>
<style scope>
.fade-down-enter-active,
.fade-down-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}

.fade-down-enter,
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-80px);
}
</style>
