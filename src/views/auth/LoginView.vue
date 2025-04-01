<template>
  <div class="auth-fluid">
    <div
      class="auth-fluid-right text-center bg-white d-flex align-items-center justify-content-center"
    >
      <div class="auth-user-testimonial">
        <img
          src="/icon/think-space-logo.png"
          alt="logo"
          class="img-fluid auth-logo"
        />
        <br />
      </div>
    </div>
    <div class="auth-fluid-form-box">
      <div class="align-items-center d-flex h-100">
        <div class="card-body">
          <div class="w-100 mb-4">
            <img
              src="/icon/think-space-icon.png"
              alt="logo"
              class="img-fluid card-logo"
            />
            <h4 class="mt-0 fw-bold text-focus-in">Welcome to Think Space!!</h4>
          </div>
          <form @submit.prevent="submitForm">
            <!-- email field -->
            <p class="text-secondary">
              Enter your email address and password to access account.
            </p>
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
                    class="input-group-text toggle-password"
                    @click="showHidePassword()"
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
            <div class="mb-3">
              <div ref="recaptcha" class="g-recaptcha" :data-sitekey="recaptchaSiteKey"></div>
            </div>
            <div class="text-center d-grid">
  <button class="button" type="submit" :disabled="loading">
    <span v-if="loading" class="spinner-border text-light spinner-border-sm me-1"></span>
    {{ loading ? "Loading..." : "Login" }}
    <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
      <path
        fill-rule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
        clip-rule="evenodd"
      ></path>
    </svg>
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
const recaptcha = ref(null);
const recaptchaSiteKey = "6LcBVQMrAAAAAKTiw28hPVcXgLlTrwH5_es_0ydX"; 

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
  const recaptchaResponse = document.querySelector(".g-recaptcha-response").value;
  if (!recaptchaResponse) {
    createToast(
      { title: "Error", description: "Please complete the reCAPTCHA." },
      {
        type: "danger",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
    return;
  }

  loading.value = true;

  authStore
    .login(user.email, user.password, recaptchaResponse)
    .then(() => {
      router.push({ name: "idea_post_idea" });
      createToast(
      { title: "Success", description: "Successfully login." },
      {
        type: "success",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
    })
    .catch((err) => {
      console.error(err);
      createToast(
      { title: "Error", description: "Login failed: " + err.message },
      {
        type: "danger",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  if (typeof grecaptcha !== "undefined") {
    grecaptcha.render(recaptcha.value, {
      sitekey: recaptchaSiteKey,
    });
  }
});
</script>
