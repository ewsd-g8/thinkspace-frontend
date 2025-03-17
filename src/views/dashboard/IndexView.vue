<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h1>Dashboard Page</h1>
        <div class="mb-3">
          <button
            @click="downloadFile(1)"
            class="btn btn-primary"
            :disabled="exportBtnLoading.value"
          >
            {{
              exportBtnLoading.value
                ? "Downloading..."
                : "Download Ideas as Excel"
            }}
          </button>
          <button
            @click="downloadDocumentsAsZip"
            class="btn btn-primary ml-2"
            :disabled="zipBtnLoading.value"
          >
            {{
              zipBtnLoading.value
                ? "Downloading..."
                : "Download Documents as ZIP"
            }}
          </button>
          <div class="showcard">
            <h2>Ideas in each Department</h2>
            <div v-if="loadingStats" class="text-center">
              <p>Loading department statistics...</p>
            </div>
            <div v-else-if="departmentStats.length === 0" class="text-center">
              <p>No department statistics available.</p>
            </div>
            <div v-else class="card-container">
              <div
                v-for="stat in departmentStats.departments"
                :key="stat.department_id"
                class="Card"
              >
                <div class="name">{{ stat.department_name }}</div><br>
                <div class="cardcontent">
                  Number of Ideas: <br>
                  <div class="count">{{ stat.ideas_count }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-between">
          <div class="col-6">
            <div class="p-3 shadow mb-5 bg-body-tertiary rounded">
              <span class="mb-5">Percentage of Ideas Per Department</span>
              <div class="w-100 mt-1">
                <Doughnut :data="donutData" :options="options" />
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="p-3 shadow mb-5 bg-body-tertiary rounded">
              <span>Percentage of Ideas Per Department</span>
              <div class="w-100">
                <Pie :data="donutData" :options="options" />
              </div>
            </div>
          </div>
        </div>
        <div class="row" style="height: 400px">
          <div
            class="col-8 shadow p-2 mb-5 bg-body-tertiary rounded"
            style="height: 100%"
          >
            <span class="">Percentage of Ideas Per Department</span>
            <div class="w-100 mt-1" style="height: 90%">
              <Line :data="lineData" :options="options" />
            </div>
          </div>
          <div class="col-4">col-4</div>
        </div>
      </div>
    </div>
    <WelcomeModal
      :title="modalTitle"
      :message="modalMsg"
      :show="showModal"
      @close="closeModal()"
    />
  </div>
</template>
<script setup>
// Imports for categories
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "vue-chartjs";
import { Pie } from "vue-chartjs";

import { Line } from "vue-chartjs";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import { ref, watch, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { createToast } from "mosha-vue-toastify";
import { Http } from "@/services/http-common";
import { useAuthStore } from "@/stores/auth";
import { downloadUrl } from "@/composables/fileDownload";
import WelcomeModal from "@/components/shared/modal.vue";
import { reactive } from "vue";

const authStore = useAuthStore();
const lastLogout = authStore.getUserLogout;
const isFirstLogin = authStore.getIsFirstLogin;

console.log(lastLogout);
console.log(isFirstLogin);

const showModal = ref(false);
const modalTitle = ref("");
const modalMsg = ref("");

const userLogout = authStore.getUserLogout;

console.log(userLogout);

const loading = ref(false);
const tableData = ref([]);
const serverItemsLength = ref(0);
const searchValue = ref("");
const serverOptions = ref({
  page: 1,
  rowsPerPage: 10,
  sortType: "",
  sortBy: "",
});
const exportBtnLoading = ref(false); // Loading state for Excel download
const zipBtnLoading = ref(false); // Loading state for ZIP download
const closures = ref([]); // Added closures ref
const departmentStats = ref([]); // New ref for department statistics
const loadingStats = ref(false); // Loading state for department stats

const router = useRouter();

// Fetch closures data
const getClosure = async () => {
  try {
    const response = await Http.get("closures");
    closures.value = response.data.data.data;
    console.log("closures", closures.value);
  } catch (error) {
    console.error("Failed to fetch closures", error);
    createToast(
      { title: "Error", description: "Failed to load closures." },
      {
        type: "danger",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
  }
};

// Department Donut chart
const donutData_values = ref([40, 39, 10, 40, 39, 80, 40]);
const donutLabel_values = ref([
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
]);

const backgroundColors = ref(["#41B883", "#E46651", "#00D8FF", "#DD1B16"]);

// Fetch department statistics
const fetchDepartmentStats = async () => {
  loadingStats.value = true;
  try {
    const response = await Http.get("/stats/ideas-per-department");
    console.log("d", response);
    departmentStats.value = response.data; // Adjust based on your API response structure

    donutLabel_values.value = response.data.departments.map(
      (stat) => stat.department_name
    );

    donutData_values.value = response.data.departments.map(
      (stat) => stat.percentage
    );

    backgroundColors.value = response.data.departments.map(
      () =>
        `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`
    );

    console.log("background Color:", backgroundColors.value);
  } catch (error) {
    console.error("Failed to fetch department stats:", error);
    createToast(
      { title: "Error", description: "Failed to load department statistics." },
      {
        type: "danger",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
    departmentStats.value = []; // Reset on error
  } finally {
    loadingStats.value = false;
  }
};

const donutData = computed(() => {
  return {
    labels: donutLabel_values.value,
    datasets: [
      {
        label: "Data One",
        backgroundColor: backgroundColors.value,
        data: donutData_values.value,
      },
    ],
  };
});

// Department Line chart
const lineData_values = ref([40, 39, 10, 40, 39, 80, 40]);
const lineLabel_values = ref([
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
]);

const colors = ref(["#41B883", "#E46651", "#00D8FF", "#DD1B16"]);

// Fetch user contributions statistics
const ContributionStats = ref([]);
const fetchContributions = async () => {
  loadingStats.value = true;
  try {
    const response = await Http.get("/stats/contributions-per-department");
    console.log("con", response);
    ContributionStats.value = response.data; // Adjust based on your API response structure

    lineLabel_values.value = ContributionStats.value.map(
      (stat) => stat.department_name
    );

    lineData_values.value = ContributionStats.value.map(
      (stat) => stat.users.length
    );

    console.log(lineLabel_values.value);
    console.log(lineData_values.value);
    colors.value = ContributionStats.value.map(
      () =>
        `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`
    );

    console.log("background Color:", colors.value);
  } catch (error) {
    console.error("Failed to fetch contributions stats:", error);
    createToast(
      {
        title: "Error",
        description: "Failed to load Contributions statistics.",
      },
      {
        type: "danger",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
    ContributionStats.value = []; // Reset on error
  } finally {
    loadingStats.value = false;
  }
};

const lineData = computed(() => {
  return {
    labels: lineLabel_values.value,
    datasets: [
      {
        label: "User Contributions",
        backgroundColor: colors.value,
        data: lineData_values.value,
      },
    ],
  };
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
};

// Download ideas as Excel
const downloadFile = async () => {
  if (!closures.value.length) {
    createToast(
      { title: "Error", description: "No closure available to export ideas." },
      {
        type: "danger",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
    return;
  }

  exportBtnLoading.value = true;
  const closureId = closures.value[0]?.id;
  let url = `/export-ideas/${closureId}?sortType=${serverOptions.value.sortBy}&search=${searchValue.value}`;
  let name = "-ideas-export";
  let extension = ".csv";

  try {
    await downloadUrl(url, name, extension);
    createToast(
      { title: "Success", description: "Ideas downloaded successfully!" },
      {
        type: "success",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
  } catch (error) {
    console.error("Failed to download ideas:", error);
    const errorMessage = error.message || "Failed to download ideas.";
    createToast(
      { title: "Error", description: errorMessage },
      {
        type: "danger",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
  } finally {
    exportBtnLoading.value = false;
  }
};

// Download documents as ZIP
const downloadDocumentsAsZip = async () => {
  if (!closures.value.length) {
    createToast(
      {
        title: "Error",
        description: "No closure available to export documents.",
      },
      {
        type: "danger",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
    return;
  }

  zipBtnLoading.value = true;
  const closureId = closures.value[0]?.id;
  const url = `/download-documents/${closureId}`;

  try {
    const response = await Http.get(url, { responseType: "blob" });
    if (response.status >= 400) {
      const text = await response.data.text();
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch (e) {
        throw new Error("Failed to download ZIP: Invalid response format");
      }
      throw new Error(errorData.message || "Failed to download ZIP");
    }

    const blob = new Blob([response.data], {
      type: response.headers["content-type"] || "application/zip",
    });
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    const currentDate = new Date();
    const isoDate = currentDate.toISOString().split("T")[0];
    a.download = `${isoDate}-documents-${closureId}.zip`;
    a.click();
    window.URL.revokeObjectURL(blobUrl);

    createToast(
      { title: "Success", description: "Documents downloaded as ZIP!" },
      {
        type: "success",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
  } catch (error) {
    console.error("Failed to download documents:", error);
    const errorMessage =
      error.message || "Failed to download documents as ZIP.";
    createToast(
      { title: "Error", description: errorMessage },
      {
        type: "danger",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
  } finally {
    zipBtnLoading.value = false;
  }
};

const closeModal = () => {
  showModal.value = false;
};

// Fetch data on mount
onMounted(async () => {
  await getClosure();
  await fetchDepartmentStats(); // Fetch department stats on mount
  await fetchContributions();
  if (isFirstLogin) {
    modalTitle.value = "Welcom to Think Space";
    modalMsg.value =
      "Thank you for participating us! This is your first time Logging in";
    showModal.value = true;
    isFirstLogin = false;
  } else if (lastLogout) {
    const lastLoginDate = new Date(lastLogout).toLocaleString();
    modalTitle.value = "Welcome Back!";
    modalMsg.value = `You last logged in at ${lastLoginDate}.`;
    showModal.value = true;
  }
});
</script>
