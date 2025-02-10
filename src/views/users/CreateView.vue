<template>
  <div>
    <div class="row px-1">
      <div class="col-12">
        <div class="page-title-box">
          <div class="page-title-right">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item">
                <a href="javascript: void(0);">User Management</a>
              </li>

              <li class="breadcrumb-item active">
                <router-link :to="{ name: 'user-index' }">Users</router-link>
              </li>

              <li class="breadcrumb-item active">Create</li>
            </ol>
          </div>
          <h4 class="page-title">User Create</h4>
        </div>
      </div>
    </div>
    <div class="card position-relative">
      <div class="card-body">
        <div v-if="loading" style="height: 50vh">
          <Loading></Loading>
        </div>
        <div v-else>
          <div
            class="d-flex align-items-start align-items-sm-center gap-4 mb-3"
          >
            <img
              :src="imagePreview ? imagePreview : '/images/empty.png'"
              alt="user-profile"
              class="d-block rounded border"
              height="100"
              width="100"
              id="uploadedAvatar"
            />
            <div class="button-wrapper">
              <label
                for="upload"
                class="btn btn-success me-2 mb-2"
                tabindex="0"
              >
                <span class="d-none d-sm-block text-white">Add photo</span>
                <i class="bx bx-upload d-block d-sm-none"></i>
                <input
                  type="file"
                  id="upload"
                  name="profile"
                  class="account-file-input"
                  hidden
                  accept="image/png, image/jpeg"
                  @change="handleFileChange"
                />
              </label>
              <button
                type="button"
                @click="resetFile"
                class="btn btn-outline-secondary account-image-reset mb-2"
              >
                Reset
              </button>
              <p class="text-muted mb-2">
                Allowed JPG, GIF or PNG. Max size of 800K
              </p>
              <v-errors
                :serverErrors="errorFor('profile')"
                :vuelidateErrors="{
                  errors: v$.profile.$errors,
                  value: 'Profile',
                }"
              ></v-errors>
            </div>
          </div>
          <form @submit.prevent="saveUser()">
            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="name" class="form-label"
                  >Name <span class="text-danger">*</span></label
                >
                <input
                  class="form-control"
                  type="text"
                  id="name"
                  autofocus
                  placeholder="Enter Name"
                  v-model="user.name"
                  :class="{
                    'is-invalid': v$.name.$error || errorFor('name'),
                  }"
                />
                <v-errors
                  :serverErrors="errorFor('name')"
                  :vuelidateErrors="{
                    errors: v$.name.$errors,
                    value: 'Name',
                  }"
                ></v-errors>
              </div>
              <div class="mb-3 col-md-6">
                <label for="email" class="form-label"
                  >E-mail <span class="text-danger">*</span></label
                >
                <input
                  class="form-control"
                  type="text"
                  id="email"
                  placeholder="john.doe@example.com"
                  autocomplete="off"
                  v-model="user.email"
                  :class="{
                    'is-invalid': v$.email.$error || errorFor('email'),
                  }"
                />
                <v-errors
                  :serverErrors="errorFor('email')"
                  :vuelidateErrors="{
                    errors: v$.email.$errors,
                    value: 'Email',
                  }"
                ></v-errors>
              </div>
              <div class="mb-3 col-md-6">
                <label for="mobile" class="form-label"
                  >Password <span class="text-danger">*</span></label
                >
                <input
                  class="form-control"
                  type="password"
                  id="password"
                  autocomplete="off"
                  placeholder="Enter password"
                  v-model="user.password"
                  :class="{
                    'is-invalid': v$.password.$error || errorFor('password'),
                  }"
                />
                <v-errors
                  :serverErrors="errorFor('password')"
                  :vuelidateErrors="{
                    errors: v$.password.$errors,
                    value: 'Password',
                  }"
                ></v-errors>
              </div>
              <div class="mb-3 col-md-6">
                <label for="mobile" class="form-label">Password Confirm</label>
                <input
                  class="form-control"
                  type="password"
                  autocomplete="off"
                  placeholder="Enter confirm password"
                  id="password_confirmation"
                  v-model="user.password_confirmation"
                  :class="{
                    'is-invalid':
                      v$.password_confirmation.$error ||
                      errorFor('password_confirmation'),
                  }"
                />
                <v-errors
                  :serverErrors="errorFor('password_confirmation')"
                  :vuelidateErrors="{
                    errors: v$.password_confirmation.$errors,
                    value: 'Confirm Password',
                  }"
                ></v-errors>
              </div>
              <div class="mb-3 col-md-6">
                <label class="form-label"
                  >Role <span class="text-danger">*</span></label
                >
                <v-select
                  v-model="user.roles"
                  class="style-chooser"
                  placeholder="Select role"
                  label="name"
                  :options="roles"
                  :reduce="(role) => role.name"
                  :class="{
                    'vuelidate-invalid': v$.roles.$error || errorFor('roles'),
                  }"
                ></v-select>
                <v-errors
                  :serverErrors="errorFor('roles')"
                  :vuelidateErrors="{
                    errors: v$.roles.$errors,
                    value: 'Role',
                  }"
                ></v-errors>
              </div>
              <div class="mb-3 col-md-6">
                <label for="mobile" class="form-label">Mobile</label>
                <input
                  v-model="user.mobile"
                  class="form-control"
                  type="text"
                  id="mobile"
                  placeholder="Enter Mobile"
                  :class="{
                    'is-invalid': v$.mobile.$error || errorFor('mobile'),
                  }"
                />
                <v-errors
                  :serverErrors="errorFor('mobile')"
                  :vuelidateErrors="{
                    errors: v$.mobile.$errors,
                    value: 'Mobile',
                  }"
                ></v-errors>
              </div>
            </div>
            <div class="mt-2">
              <button
                type="submit"
                class="btn btn-success loading-button me-2 loading-button"
              >
                Submit
              </button>
              <router-link
                :to="{ name: 'user-index' }"
                class="btn btn-outline-secondary"
                >Cancel</router-link
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { useRouter } from "vue-router";
import { createToast } from "mosha-vue-toastify";
import Loading from "@/components/shared/TableLoading.vue";
import {
  required,
  minLength,
  email,
  sameAs,
  helpers,
} from "@vuelidate/validators";
import { Http } from "@/services/http-common";
import {
  serverErrors,
  errorFor,
  resetServerErrors,
} from "@/composables/validationErrors";

const loading = ref(false);
const imagePreview = ref("");
const router = useRouter();
const roles = ref([]);

const user = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  roles: [],
  mobile: "",
  profile: "",
});

const handleFileChange = (event) => {
  if (event.target.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
    user.profile = event.target.files[0];
  }
};

const resetFile = () => {
  imagePreview.value = "";
};

const getRoles = async () => {
  await Http.get("get-all-roles").then((res) => {
    roles.value = res.data.data;
  });
};

const mobileFormatValidator = helpers.withParams(
  { type: "mobileFormat" },
  (value) => /^09\d{7,9}$/.test(value)
);

const fileSizeValidator = helpers.withParams({ type: "fileSize" }, (value) => {
  if (!value) return true;

  const maxSize = 2 * 1024 * 1024;
  return value.size <= maxSize;
});

const rules = computed(() => {
  return {
    name: { required },
    email: { required, email },
    password: { required, minLength: minLength(6) },
    password_confirmation: {
      required,
      sameAsPassword: helpers.withMessage(
        "Must be same with Password",
        sameAs(user.password)
      ),
    },
    roles: { required },
    mobile: {
      required,
      formatValidator: helpers.withMessage(
        "Mobile must be Myanmar format",
        mobileFormatValidator
      ),
    },
    profile: {
      fileSizeValidator: helpers.withMessage(
        "File size must be max size of 2Mb.",
        fileSizeValidator
      ),
    },
  };
});
const v$ = useVuelidate(rules, user);

const saveUser = async () => {
  let isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  loading.value = true;

  resetServerErrors();

  const fd = new FormData();
  fd.append("name", user.name);
  fd.append("email", user.email);
  fd.append("password", user.password);
  fd.append("password_confirmation", user.password_confirmation);
  fd.append("roles", user.roles);
  fd.append("mobile", user.mobile);
  fd.append("profile", user.profile);

  await Http.post("users", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then(() => {
      router.push({ name: "user-index" });
      createToast(
        {
          title: "Success",
          description: "Successfully Created User!",
        },
        {
          type: "success",
          transition: "bounce",
          position: "top-right",
          showIcon: true,
        }
      );
    })
    .catch((error) => {
      serverErrors(error.response?.data.errors);
    })
    .finally(() => {
      loading.value = false;
    });
};
onMounted(() => {
  resetServerErrors();
  getRoles();
});
</script>
