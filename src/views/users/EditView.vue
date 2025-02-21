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
      <!-- Account -->
      <div class="card-body">
        <div v-if="loading" style="height: 50vh">
          <Loading></Loading>
        </div>
        <template v-else>
          <div
            class="d-flex align-items-start align-items-sm-center gap-4 mb-3"
          >
            <img
              :src="profile ? profile : '/images/empty.png'"
              alt="user-profile"
              class="d-block rounded"
              height="100"
              width="100"
              id="uploadedAvatar"
            />
            <div class="button-wrapper">
              <label
                for="upload"
                class="btn btn-success me-2 mb-4"
                tabindex="0"
              >
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
              <p class="text-muted mb-0">
                Allowed JPG, GIF or PNG. Max size of 800K
              </p>
            </div>
          </div>
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
                placeholder="Enter User Name"
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
              <label class="form-label"
                >Roles <span class="text-danger">*</span></label
              >
              <v-select
                v-model="user.roles"
                class="style-chooser"
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
              @click="updateUser()"
              class="btn btn-success loading-button me-2 loading-button"
            >
              Update
            </button>

            <router-link
              :to="{ name: 'user-index' }"
              class="btn btn-outline-secondary"
              >Cancel</router-link
            >
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
import Skeleton from "@/components/shared/Skeleton.vue";
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

const user = reactive({
  id: "",
  name: "",
  email: "",
  roles: "",
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
  await Http.get(`users/${route.params.id}`)
    .then((res) => {
      console.log(res)
      user.id = res.data.data.id;
      user.name = res.data.data.name;
      user.email = res.data.data.email;
      user.currentProfile = res.data.data.profile
        ? res.data.data.profile
        : "/images/empty.png";
      profile.value = res.data.data.profile
        ? res.data.data.profile
        : "/images/empty.png";
      user.roles = res.data.data.roles[0]?.name;
      user.mobile = res.data.data.mobile;
    })
    .catch((err) => {
      if (err.response.status == 404) {
        router.push({ name: "page-not-found" });
      }
    });

  getRoles();
};

const getRoles = async () => {
  await Http.get("get-all-roles").then((res) => {
    roles.value = res.data.data;
  });
  loading.value = false;
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
        "File size must be max size of  2Mb.",
        fileSizeValidator
      ),
    },
  };
});
const v$ = useVuelidate(rules, user);

const updateUser = async () => {
  let isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  loading.value = true;

  resetServerErrors();

  const fd = new FormData();
  fd.append("name", user.name);
  fd.append("email", user.email);
  fd.append("roles", user.roles);
  fd.append("mobile", user.mobile);
  fd.append("profile", user.profile);

  await Http.post(`users/${route.params.id}?_method=PUT`, fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then(() => {
      router.push({ name: "user-index" });
      createToast(
        {
          title: "Success",
          description: "Successfully Updated User!",
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
      getAuthUser();
      loading.value = false;
    });
};
onMounted(() => {
  resetServerErrors();
  getUserDetail();
});
</script>
