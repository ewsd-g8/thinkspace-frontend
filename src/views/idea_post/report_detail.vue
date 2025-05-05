<template>
  <div class="card">
    <div class="card-header">Idea Report</div>
    <div class="card-body">
      <h5 class="card-title">
        Reason --
        <span class="report-type-name">
          {{ reportTypes.name }}
        </span>
      </h5>
      <p class="card-text">
        Description --
        <span class="description-text">{{ reportTypes.description }}</span>
      </p>
      <form @submit.prevent="sendReport()">
        <div class="mb-3">
          <label for="reason" class="form-label">
            Give your Reason <span class="text-danger">*</span>
          </label>
          <textarea
            class="form-control reason-textarea"
            id="reason"
            rows="4"
            v-model="reports.reason"
            autofocus
            required
            spellcheck="true"
          ></textarea>
          <v-errors
            :serverErrors="errorFor('reason')"
            :vuelidateErrors="{
              errors: v$?.reason?.$errors,
              value: 'Reason',
            }"
          ></v-errors>
          <small class="form-text">
            {{ wordCount }} / {{ maxWords }} words
            <span v-if="wordCount > maxWords" class="text-danger">
              (Exceeds limit!)
            </span>
          </small>
        </div>
        <div class="d-grid gap-2">
          <button class="btn btn-primary submit-button" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { useRouter, useRoute } from "vue-router";
import { createToast } from "mosha-vue-toastify";
import { Http } from "@/services/http-common";
import {
  serverErrors,
  errorFor,
  resetServerErrors,
} from "@/composables/validationErrors";

const loading = ref(false);
const router = useRouter();
const route = useRoute();

const reportTypes = reactive({
  name: "",
  description: "",
});

const getReportTypeDetail = async () => {
  loading.value = true;
  await Http.get(`report-types/${route.params.id}`)
    .then((res) => {
      console.log("res", res);
      reportTypes.name = res.data.data.name;
      reportTypes.description = res.data.data.description;
      loading.value = false;
    })
    .catch((err) => {
      if (err.response.status == 404) {
        router.push({ name: "page-not-found" });
      }
    });
};

// Word Count limit
const maxWords = ref(5000); // Set your desired word limit here
const wordCount = computed(() => {
  const text = reports.reason.trim();
  return text ? text.split(/\s+/).filter((word) => word.length > 0).length : 0;
});

// Report Upload
const reports = reactive({
  reason: "",
  reportTypeid: route.params.id,
  idea_id: route.params.ideaid,
});

const v$ = useVuelidate(reports);

const sendReport = async () => {
  let isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  loading.value = true;

  resetServerErrors();

  const fd = new FormData();
  fd.append("reason", reports.reason);
  fd.append("report_type_id", reports.reportTypeid);
  fd.append("idea_id", reports.idea_id);

  await Http.post("reports", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then(() => {
      router.push({ name: "idea_post_idea" });
      createToast(
        {
          title: "Success",
          description: "Successfully Report The Idea!",
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
      console.log("Error Response:", error.response); // Log status, data, headers
      serverErrors(error.response?.data.errors);
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  getReportTypeDetail();
});
</script>
