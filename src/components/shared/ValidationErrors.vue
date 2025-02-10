<template>
  <small v-if="serverErrors || vuelidateErrors" class="text-danger">
    <template v-if="vuelidateErrors">
      <p
        class="mb-0 text-danger"
        v-for="vulidate_error of vuelidateErrors.errors"
        :key="vulidate_error.$uid"
      >
        {{ vulidate_error.$message.replace("Value", vuelidateErrors.value) }}
      </p>
    </template>
    <template v-if="serverErrors">
      <p
        class="mb-0 text-danger"
        v-for="(error, index) in serverErrors"
        :key="`validation_error_${index}_${Math.random()}`"
      >
        {{ error }}
      </p>
    </template>
  </small>
</template>

<script>
export default {
  props: ["serverErrors", "vuelidateErrors"],
};
</script>

<style>
.login-form.p-invalid ~ small > .text-danger {
  display: block;
}
</style>
