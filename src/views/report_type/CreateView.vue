<template>
  <div>
    <div class="row px-1">
      <div class="col-12">
        <div class="page-title-box">
          <div class="page-title-right">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item active">
                <router-link :to="{ name: 'reportType-index' }"
                  >Report Type</router-link
                >
              </li>

              <li class="breadcrumb-item active">Create</li>
            </ol>
          </div>
          <h4 class="page-title">Report Type Create</h4>
        </div>
      </div>
    </div>
    <div class="card position-relative">
      <div class="card-body">
        <div v-if="loading" >
          <Loading></Loading>
        </div>
        <div v-else>
          <form @submit.prevent="saveReport()">
            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="name" class="form-label"
                  >Report Type Name <span class="text-danger">*</span></label
                >
                <input
                  class="form-control"
                  type="text"
                  id="name"
                  autofocus
                  placeholder="Enter Report Type Name"
                  v-model="reportTypes.name"
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
                  v-model="reportTypes.description"
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
                :to="{ name: 'reportType-index' }"
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

const reportTypes = reactive({
  name: "",
  description: "",
});

const v$ = useVuelidate(reportTypes);

const saveReport = async () => {
  let isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  loading.value = true;

  resetServerErrors();

  const fd = new FormData();
  fd.append("name", reportTypes.name);
  fd.append("description", reportTypes.description);

  await Http.post("report-types", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then(() => {
      router.push({ name: "reportType-index" });
      createToast(
        {
          title: "Success",
          description: "Successfully Created Report Type!",
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
});
</script>
