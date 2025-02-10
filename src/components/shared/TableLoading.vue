<template>
  <div class="loading-overlay">
    <div class="sk-flow">
      <div class="sk-flow-dot"></div>
      <div class="sk-flow-dot"></div>
      <div class="sk-flow-dot"></div>
    </div>
  </div>
</template>
<style>
.sk-flow-dot {
  background-color: #2713dc !important;
}
.loading-overlay {
  z-index: 9999;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
