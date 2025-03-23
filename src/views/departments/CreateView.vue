<template>
  <div>
    <div class="row px-1">
      <div class="col-12">
        <div class="page-title-box">
          <div class="page-title-right">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item active">
                <router-link :to="{ name: 'department-index' }"
                  >Department</router-link
                >
              </li>

              <li class="breadcrumb-item active">Create</li>
            </ol>
          </div>
          <h4 class="page-title">Department Create</h4>
        </div>
      </div>
    </div>
    <div class="card position-relative">
      <div class="card-body">
        <div v-if="loading">
          <Loading></Loading>
        </div>
        <div v-else>
          <form @submit.prevent="savedepartment()">
            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="name" class="form-label"
                  >Department Name <span class="text-danger">*</span></label
                >
                <input
                  class="form-control"
                  type="text"
                  id="name"
                  autofocus
                  placeholder="Enter department Name"
                  v-model="department.name"
                  :class="{
                    'is-invalid': v$?.name?.$error || errorFor('name'),
                  }"
                />
                <v-errors
                  :serverErrors="errorFor('name')"
                  :vuelidateErrors="{
                    errors: v$?.name?.$errors,
                    value: 'Name',
                  }"
                ></v-errors>
              </div>

              <!-- description -->
              <div class="mb-3 col-md-6">
                <label for="description" class="form-label"
                  >Description <span class="text-danger">*</span></label
                >
                <input
                  class="form-control"
                  type="text"
                  id="description"
                  autofocus
                  placeholder="Enter Description"
                  v-model="department.description"
                  :class="{
                    'is-invalid':
                      v$?.description?.$error || errorFor('description'),
                  }"
                />
                <v-errors
                  :serverErrors="errorFor('description')"
                  :vuelidateErrors="{
                    errors: v$?.description?.$errors,
                    value: 'Description',
                  }"
                ></v-errors>
              </div>
            </div>
            <div class="mt-2">
              <button
                type="submit"
                class="btn btn-primary loading-button me-2 loading-button"
              >
                Submit
              </button>
              <router-link
                :to="{ name: 'department-index' }"
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
import { Http } from "@/services/http-common";
import {
  serverErrors,
  errorFor,
  resetServerErrors,
} from "@/composables/validationErrors";

const loading = ref(false);
const router = useRouter();
const hidden = ref(false);
const departments = ref([]);

const color = ref([]);

const getDepartment = async () => {
  const res = await Http.get(`departments`);
  console.log("api response:", res);
  departments.value = res.data.data.data;
  console.log("Departments: ", departments.value);
  color.value = departments.value.map((stat) => stat.color);
  console.log(color);
};
const ramdomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
};

const department = reactive({
  name: "",
  description: "",
  color: ramdomColor(),
});
const v$ = useVuelidate(department);

const savedepartment = async () => {
  let isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  loading.value = true;

  resetServerErrors();
  const newColor = department.color;
  while (color.value.includes(department.color)) {
    newColor = ramdomColor();
  }
  department.color = newColor;

  const fd = new FormData();
  fd.append("name", department.name);
  fd.append("description", department.description);
  fd.append("color", department.color);

  await Http.post("departments", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then(() => {
      router.push({ name: "department-index" });
      createToast(
        {
          title: "Success",
          description: "Successfully Created Department!",
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
  getDepartment();
});
</script>
