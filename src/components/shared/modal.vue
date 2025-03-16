<template>
  <div
    v-if="show"
    class="modal fade show"
    tabindex="-1"
    style="display: block; background: rgba(0, 0, 0, 0.5)"
    @click.self="close"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header" style="background-color: #670e10">
          <img
            src="/icon/think-space-white-logo.png"
            alt="logo"
            class="img-fluid"
            style="width: 60px; height: 50px"
          />
          <h5 class="modal-title" style="color: #fff">{{ title }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            @click="close"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="close"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
  <div v-if="show" class="modal-backdrop fade show"></div>
</template>
<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  title: String,
  message: String,
  show: Boolean,
});

const emit = defineEmits(["close"]);

const close = () => {
  emit("close");
};
</script>
