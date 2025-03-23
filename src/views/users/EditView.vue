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
              <li class="breadcrumb-item active">Edit</li>
            </ol>
          </div>
          <h4 class="page-title">User Edit</h4>
        </div>
      </div>
    </div>
    <div class="card position-relative">
      <div class="card-body">
        <div v-if="loading" style="height: 50vh">
          <Loading></Loading>
        </div>
        <template v-else>
          <div class="d-flex align-items-start align-items-sm-center gap-4 mb-3">
            <img
              :src="profile ? profile : '/images/empty.png'"
              alt="user-profile"
              class="d-block rounded"
              height="100"
              width="100"
              id="uploadedAvatar"
            />
            <div class="button-wrapper">
              <label for="upload" class="btn btn-success me-2 mb-4" tabindex="0">
                Add photo
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
                class="btn btn-outline-secondary account-image-reset mb-4"
              >
                Reset
              </button>
              <p class="text-muted mb-0">Allowed JPG, GIF or PNG. Max size of 800K</p>
            </div>
          </div>
          <div class="row">
            <div class="mb-3 col-md-6">
              <label for="name" class="form-label">
                Name <span class="text-danger">*</span>
              </label>
              <input
                class="form-control"
                type="text"
                id="name"
                autofocus
                placeholder="Enter User Name"
                v-model="user.name"
                :class="{ 'is-invalid': v$.name.$error || errorFor('name') }"
              />
              <v-errors
                :serverErrors="errorFor('name')"
                :vuelidateErrors="{ errors: v$.name.$errors, value: 'Name' }"
              ></v-errors>
            </div>
            <div class="mb-3 col-md-6">
              <label for="fullname" class="form-label">
                Full Name <span class="text-danger">*</span>
              </label>
              <input
                class="form-control"
                type="text"
                id="fullname"
                placeholder="Enter Full Name"
                v-model="user.fullname"
                :class="{ 'is-invalid': v$.fullname.$error || errorFor('fullname') }"
              />
              <v-errors
                :serverErrors="errorFor('fullname')"
                :vuelidateErrors="{ errors: v$.fullname.$errors, value: 'Full Name' }"
              ></v-errors>
            </div>
            <div class="mb-3 col-md-6">
              <label for="email" class="form-label">
                E-mail <span class="text-danger">*</span>
              </label>
              <input
                class="form-control"
                type="text"
                id="email"
                placeholder="john.doe@example.com"
                autocomplete="off"
                v-model="user.email"
                :class="{ 'is-invalid': v$.email.$error || errorFor('email') }"
              />
              <v-errors
                :serverErrors="errorFor('email')"
                :vuelidateErrors="{ errors: v$.email.$errors, value: 'Email' }"
              ></v-errors>
            </div>
            <div class="mb-3 col-md-6">
              <label class="form-label">
                Role <span class="text-danger">*</span>
              </label>
              <v-select
                v-model="user.roles" 
                class="style-chooser"
                label="name"
                :options="roles"
                :reduce="(role) => role.name"
                :class="{ 'vuelidate-invalid': v$.roles.$error || errorFor('roles') }"
              ></v-select>
              <v-errors
                :serverErrors="errorFor('roles')"
                :vuelidateErrors="{ errors: v$.roles.$errors, value: 'Role' }"
              ></v-errors>
            </div>
            <div class="mb-3 col-md-6">
              <label class="form-label">
                Department <span class="text-danger">*</span>
              </label>
              <v-select
                v-model="user.department_id"
                class="style-chooser"
                label="name"
                :options="departments"
                :reduce="(department) => department.id"
                :class="{ 'vuelidate-invalid': v$.department_id.$error || errorFor('department_id') }"
              ></v-select>
              <v-errors
                :serverErrors="errorFor('department_id')"
                :vuelidateErrors="{ errors: v$.department_id.$errors, value: 'Department' }"
              ></v-errors>
            </div>
            <div class="mb-3 col-md-6">
              <label for="mobile" class="form-label">
                Mobile <span class="text-danger">*</span>
              </label>
              <input
                v-model="user.mobile"
                class="form-control"
                type="text"
                id="mobile"
                placeholder="Enter Mobile"
                :class="{ 'is-invalid': v$.mobile.$error || errorFor('mobile') }"
              />
              <v-errors
                :serverErrors="errorFor('mobile')"
                :vuelidateErrors="{ errors: v$.mobile.$errors, value: 'Mobile' }"
              ></v-errors>
            </div>
          </div>
          <div class="mt-2">
            <button @click="updateUser()" class="btn btn-success loading-button me-2">
              Update
            </button>
            <router-link :to="{ name: 'user-index' }" class="btn btn-outline-secondary">
              Cancel
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { useRouter, useRoute } from "vue-router";
import { createToast } from "mosha-vue-toastify";
import { required, email, helpers } from "@vuelidate/validators";
import { Http } from "@/services/http-common";
import { getAuthUser } from "@/composables/getAuthUser";
import {
  serverErrors,
  errorFor,
  resetServerErrors,
} from "@/composables/validationErrors";

const loading = ref(false);
const profile = ref("");
const router = useRouter();
const route = useRoute();
const roles = ref([]);
const departments = ref([]);

const user = reactive({
  id: "",
  fullname: "",
  name: "",
  email: "",
  roles: "", // Single string
  department_id: null,
  mobile: "",
  profile: "",
  currentProfile: "",
});

const handleFileChange = (event) => {
  if (event.target.files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profile.value = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);
    user.profile = event.target.files[0];
  }
};

const resetFile = () => {
  user.profile = "";
  profile.value = user.currentProfile;
};

const getUserDetail = async () => {
  loading.value = true;
  try {
    const res = await Http.get(`users/${route.params.id}`);
    console.log("User data:", res.data.data);
    user.id = res.data.data.id;
    user.name = res.data.data.name;
    user.fullname = res.data.data.full_name;
    user.email = res.data.data.email;
    user.roles = res.data.data.roles[0]?.name || "";
    user.department_id = res.data.data.department.id;
    user.mobile = res.data.data.mobile;
    user.currentProfile = res.data.data.profile || "/images/empty.png";
    profile.value = user.currentProfile;
  } catch (err) {
    console.error("Error fetching user:", err);
    if (err.response?.status === 404) {
      router.push({ name: "page-not-found" });
    }
  } finally {
    loading.value = false;
  }
  await Promise.all([getRoles(), getDepartments()]);
};

const getRoles = async () => {
  try {
    const res = await Http.get("get-all-roles");
    roles.value = res.data.data;
    console.log("Roles:", roles.value);
  } catch (error) {
    console.error("Failed to fetch roles:", error);
  }
};

const getDepartments = async () => {
  try {
    const res = await Http.get("get-all-departments");
    departments.value = res.data.data;
    console.log("Departments:", departments.value);
  } catch (error) {
    console.error("Failed to fetch departments:", error);
  }
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

const rules = computed(() => ({
  name: { required },
  fullname: { required },
  email: { required, email },
  roles: { required },
  department_id: { required },
  mobile: {
    required,
    formatValidator: helpers.withMessage("Mobile must be Myanmar format", mobileFormatValidator),
  },
  profile: {
    fileSizeValidator: helpers.withMessage("File size must be max 2MB.", fileSizeValidator),
  },
}));

const v$ = useVuelidate(rules, user);

const updateUser = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  loading.value = true;
  resetServerErrors();

  const fd = new FormData();
  fd.append("name", user.name);
  fd.append("full_name", user.fullname);
  fd.append("email", user.email);
  fd.append("roles", user.roles); // Single role string
  fd.append("department_id", user.department_id);
  fd.append("mobile", user.mobile);
  if (user.profile) fd.append("profile", user.profile);
  fd.append("_method", "PUT");

  try {
    await Http.post(`users/${route.params.id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    router.push({ name: "user-index" });
    createToast(
      { title: "Success", description: "Successfully Updated User!" },
      { type: "success", transition: "bounce", position: "top-right", showIcon: true }
    );
  } catch (error) {
    console.error("Update error:", error);
    serverErrors(error.response?.data.errors);
  } finally {
    getAuthUser();
    loading.value = false;
  }
};

onMounted(() => {
  resetServerErrors();
  getUserDetail();
});
</script>