<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h4>Report</h4>
        <div class="mb-3">
          <form @submit.prevent="">
            <div class="list-group">
              <h4>Why are you reporting this idea?</h4>
              <button
                type="button"
                class="list-group-item list-group-item-action d-flex"
                aria-current="true"
                v-for="reportType in reportTypes"
                :key="reportType.id"
                @click="
                  () =>
                    $router
                      .push({
                        name: 'report_detail',
                        params: { id: reportType.id, ideaid: route.params.id },
                      })
                      .catch((err) => console.error(err))
                "
              >
                <span class="p-2 w-100">{{ reportType.name }}</span>
                <i class="p-2 flex-shrink-1 icon-arrow-right"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";

import { useRouter, useRoute } from "vue-router";


import { Http } from "@/services/http-common";

import { useAuthStore } from "@/stores/auth";

const loading = ref(false);
const authStore = useAuthStore();
// const getUserID = computed(() => authStore.getUserId);
const router = useRouter();
const route = useRoute();

const reportTypes = ref([]);

const getReportTypeDetail = async () => {
  loading.value = true;
  await Http.get(`report-types`)
    .then((res) => {
      console.log("res", res);
      reportTypes.value = res.data.data.data;
      loading.value = false;
    })
    .catch((err) => {
      if (err.response.status == 404) {
        router.push({ name: "page-not-found" });
      }
    });
};

onMounted(() => {
  getReportTypeDetail();
});
</script>
