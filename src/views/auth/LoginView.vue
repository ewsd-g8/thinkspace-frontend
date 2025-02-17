<template>
  <div class="auth-fluid">
    <div
      class="auth-fluid-right text-center bg-white d-flex align-items-center justify-content-center"
    >
      <div class="auth-user-testimonial">
        <img
          src="/icon/think-space-logo.png"
          alt="logo"
          style="width: 400px; height: 400px"
        />
        <br />
        <!-- <img
          src="/images/ani2.gif"
          alt="logo"
          class="img-fluid"
          style="height: 250px"
        /> -->
      </div>
    </div>
    <div class="auth-fluid-form-box" style="background-color: #670e10">
      <div class="align-items-center d-flex h-100">
        <div class="card-body">
          <img
            src="/icon/think-space-icon.png"
            alt="logo"
            class="img-fluid"
            style="width: 350px; height: 105px"
          />
          <h4 class="mt-0 fw-bold text-focus-in">
            Welcome to Think Space Admin System!
          </h4>
          <p class="mb-4 text-secondary">
            Enter your email address and password to access account.
          </p>
          <form @submit.prevent="submitForm">
            <!-- email field -->
            <div class="mb-3">
              <label for="emailaddress" class="form-label label">
                <input
                  class="input form-control"
                  type="email"
                  id="emailaddress"
                  v-model="user.email"
                  :class="{
                    'is-invalid': v$.email.$error || errorFor('email'),
                  }"
                  placeholder="Enter your email"
                />
              </label>
              <v-errors
                :serverErrors="errorFor('email')"
                :vuelidateErrors="{
                  errors: v$.email.$errors,
                  value: 'Email',
                }"
              ></v-errors>
            </div>
            <div class="mb-3">
              <label for="password" class="form-label label">
                <div class="input-group input-group-merge">
                  <input
                    :type="inputFieldType"
                    id="password"
                    autocomplete="on"
                    v-model="user.password"
                    class="input form-control"
                    :class="{
                      'is-invalid': v$.password.$error || errorFor('password'),
                    }"
                    placeholder="Enter your password"
                  />
                  <div
                    class="input-group-text"
                    @click="showHidePassword()"
                    style="cursor: pointer"
                  >
                    <i
                      v-if="inputFieldType == 'password'"
                      class="mdi mdi-eye-outline"
                    ></i>
                    <i
                      v-if="inputFieldType == 'text'"
                      class="mdi mdi-eye-off-outline"
                    ></i>
                  </div>
                </div>
              </label>
              <v-errors
                :serverErrors="errorFor('password')"
                :vuelidateErrors="{
                  errors: v$.password.$errors,
                  value: 'Password',
                }"
              ></v-errors>
            </div>
            <div class="text-center d-grid">
              <button
                class="btn btn-success text-focus-in"
                type="submit"
                :disabled="loading"
              >
                <span
                  v-if="loading"
                  class="spinner-border text-light spinner-border-sm me-1"
                ></span>
                {{ loading ? "Loading..." : "Login" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
// import Loading from "@/components/shared/Loading.vue";
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "@/stores/auth";
import {
  serverErrors,
  errorFor,
  resetServerErrors,
} from "@/composables/validationErrors";

import { useVuelidate } from "@vuelidate/core";
import { required, minLength, email } from "@vuelidate/validators";

import { createToast } from "mosha-vue-toastify";

const authStore = useAuthStore();
const router = useRouter();

const inputFieldType = ref("password");
const showHidePassword = () => {
  inputFieldType.value =
    inputFieldType.value == "password" ? "text" : "password";
};

const loading = ref(false);

const user = reactive({
  email: "",
  password: "",
});

const rules = computed(() => {
  return {
    email: { required, email },
    password: { required, minLength: minLength(6) },
  };
});
const v$ = useVuelidate(rules, user);

const submitForm = async () => {
  let isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;

  loading.value = true;

  authStore
    .login(user.email, user.password)
    .then(() => {
      router.push({ name: "dashboard" });
      createToast(
        {
          title: "Success",
          description: "You are successfully login!",
          toastBackgroundColor: "#670e10",
        },
        {
          type: "success",
          transition: "bounce",
          position: "top-right",
          showIcon: true,
        }
      );
      resetServerErrors();
    })
    .catch((err) => {
      console.log(err.errors);
      serverErrors(err.errors);
      createToast(
        {
          title: "Error",
          description: err.message,
        },
        {
          type: "danger",
          showIcon: true,
        }
      );
    })
    .finally(() => {
      loading.value = false;
    });
};

// onMounted(() => {
//   let vendorScriptElement = document.getElementById("vendorScript");
//   let appScriptElement = document.getElementById("appScript");
//   if (vendorScriptElement) {
//     document.body.removeChild(vendorScriptElement);
//   }
//   if (appScriptElement) {
//     document.body.removeChild(appScriptElement);
//   }
// });
</script>
