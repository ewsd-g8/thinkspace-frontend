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

              <li class="breadcrumb-item active">Update</li>
            </ol>
          </div>
          <h4 class="page-title">Closure Update</h4>
        </div>
      </div>
    </div>
    <div class="card position-relative">
      <!-- Account -->
      <div class="card-body">
        <div v-if="loading" style="height: 50vh">
          <Loading></Loading>
        </div>

        <!-- edit -->
        <template v-else>
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
                v-model="closures.name"
                :class="{
                  'is-invalid': v$?.name?.$error || errorFor('name'),
                }"
              />
              <v-errors
                :serverErrors="errorFor('name')"
                :vuelidateErrors="{
                  errors: v$?.name?.$errors,
                  value: 'name',
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
                v-model="closures.date"
                :class="{
                  'is-invalid': v$?.date?.$error || errorFor('date'),
                }"
              />
              <v-errors
                :serverErrors="errorFor('date')"
                :vuelidateErrors="{
                  errors: v$?.date?.$errors,
                  value: 'date',
                }"
              ></v-errors>
            </div>
            <div class="mb-3 col-md-6">
              <label for="finaldate" class="form-label"
                >Final Date <span class="text-danger">*</span></label
              >
              <input
                class="form-control"
                type="date"
                id="finaldate"
                v-model="closures.finaldate"
                :class="{
                  'is-invalid': v$?.finaldate?.$error || errorFor('finaldate'),
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
              @click="updateClosure()"
              class="btn btn-success loading-button me-2 loading-button"
            >
              Update
            </button>

            <router-link
              :to="{ name: 'closure-index' }"
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
const router = useRouter();
const route = useRoute();

const closures = reactive({
  id: "",
  name: "",
  date: "",
  finaldate: "",
});

const getClosureDetail = async () => {
  loading.value = true;
  await Http.get(`closures/${route.params.id}`)
    .then((res) => {
      console.log("res", res);
      closures.id = res.data.data.id;
      closures.name = res.data.data.name;
      closures.date = res.data.data.date;
      closures.finaldate = res.data.data.final_date;
      loading.value = false;
    })
    .catch((err) => {
      if (err.response.status == 404) {
        router.push({ name: "page-not-found" });
      }
    });
};

const v$ = useVuelidate(closures);

const updateClosure = async () => {
  let isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  loading.value = true;

  resetServerErrors();

  const fd = new FormData();
  fd.append("name", closures.name);
  fd.append("date", closures.date);
  fd.append("final_date", closures.finaldate);

  await Http.post(`closures/${route.params.id}?_method=PUT`, fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then(() => {
      router.push({ name: "closure-index" });
      createToast(
        {
          title: "Success",
          description: "Successfully Updated Closure!",
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
  getClosureDetail();
});
</script>
