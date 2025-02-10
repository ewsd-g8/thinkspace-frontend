import { ref } from "vue";

const errors = ref([]);

export function errorFor(field) {
  const errorFor =
    null != errors.value && errors.value[field] ? errors.value[field] : null;

  return errorFor;
}

export function serverErrors(serverErrors) {
  errors.value = serverErrors;
  return errors;
}

export function resetServerErrors() {
  errors.value = [];
}
