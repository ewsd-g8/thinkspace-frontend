<template>
  <div>
    <div class="row px-1">
      <div class="col-12">
        <div class="page-title-box">
          <div class="page-title-right">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item active">
                <router-link :to="{ name: 'closure-index' }"
                  >Closure</router-link
                >
              </li>

              <li class="breadcrumb-item active">Create</li>
            </ol>
          </div>
          <h4 class="page-title">Closure Create</h4>
        </div>
      </div>
    </div>
    <div class="card position-relative">
      <div class="card-body">
        <div v-if="loading" style="height: 50vh">
          <Loading></Loading>
        </div>
        <div v-else>
          <form @submit.prevent="saveClosure()">
            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="name" class="form-label"
                  >Closure Name <span class="text-danger">*</span></label
                >
                <input
                  class="form-control"
                  type="text"
                  id="name"
                  autofocus
                  placeholder="Enter Closure Name"
                  v-model="closure.name"
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

              <div class="mb-3 col-md-6">
                <label for="date" class="form-label"
                  >Date <span class="text-danger">*</span></label
                >
                <input
                  class="form-control"
                  type="date"
                  id="date"
                  autofocus
                  v-model="closure.date"
                  :class="{
                    'is-invalid': v$?.date?.$error || errorFor('date'),
                  }"
                />
                <v-errors
                  :serverErrors="errorFor('date')"
                  :vuelidateErrors="{
                    errors: v$?.date?.$errors,
                    value: 'Date',
                  }"
                ></v-errors>
              </div>
              <div class="mb-3 col-md-6">
                <label for="finaldate" class="form-label"
                  >Final Date<span class="text-danger">*</span></label
                >
                <input
                  class="form-control"
                  type="date"
                  id="finaldate"
                  autofocus
                  v-model="closure.finaldate"
                  :class="{
                    'is-invalid':
                      v$?.finaldate?.$error || errorFor('finaldate'),
                  }"
                />
                <v-errors
                  :serverErrors="errorFor('finaldate')"
                  :vuelidateErrors="{
                    errors: v$?.finaldate?.$errors,
                    value: 'Final Date',
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
                :to="{ name: 'closure-index' }"
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

const closure = reactive({
  name: "",
  date: "",
  finaldate: "",
});

const v$ = useVuelidate(closure);

const saveClosure = async () => {
  let isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  loading.value = true;

  resetServerErrors();

  const fd = new FormData();
  fd.append("name", closure.name);
  fd.append("date", closure.date);
  fd.append("final_date", closure.finaldate);

  await Http.post("closures", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then(() => {
      router.push({ name: "closure-index" });
      createToast(
        {
          title: "Success",
          description: "Successfully Created Closure Date!",
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
