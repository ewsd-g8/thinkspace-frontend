<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h1>Dashboard Page</h1>

        <div class="card">
          <div class="card-body">
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
                <div
                  v-else-if="departmentStats.length === 0"
                  class="text-center"
                >
                  <p>No department statistics available.</p>
                </div>
                <div v-else class="card-container">
                  <div
                    v-for="stat in departmentStats"
                    :key="stat.department_id"
                    class="Card"
                  >
                    <div class="name">{{ stat.department_name }}</div>
                    <div class="cardcontent">
                      Number of Ideas:
                      <div class="count">{{ stat.ideas_count }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style="width: 50%">
          <Doughnut :data="data.value" :options="options" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
// Imports for categories
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";

ChartJS.register(ArcElement, Tooltip, Legend);

import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { createToast } from "mosha-vue-toastify";
import { Http } from "@/services/http-common";
import { useAuthStore } from "@/stores/auth";
import { downloadUrl } from "@/composables/fileDownload";
import { reactive } from "vue";

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

const authStore = useAuthStore();
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

const departmentIdea = reactive({
  departments: "",
});
// Fetch department statistics
const fetchDepartmentStats = async () => {
  loadingStats.value = true;
  try {
    const response = await Http.get("/stats/ideas-per-department");
    console.log("d", response);
    departmentStats.value = response.data; // Adjust based on your API response structure
    departmentIdea.departments = response.data.departments;
    console.log("Department Stats:", departmentStats.value);
    console.log("Departments", departmentIdea.departments);
    updateDonutChart();
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

// Department Donut chart
const data = ref({
  labels: [],
  datasets: [
    {
      backgroundColor: [],
      data: [],
    },
  ],
});

const options = {
  responsive: true,
  maintainAspectRatio: false,
};

// Function to update chart data
const updateDonutChart = () => {
  if (departmentIdea.departments.length > 0) {
    data.value.labels = departmentIdea.departments.map(
      (stat) => stat.department_name
    );
    console.log(data.value.labels);
    data.value.datasets[0].data = departmentIdea.departments.map(
      (stat) => stat.percentage
    );

    console.log(data.value.datasets[0].data);
    if (
      departmentIdea.departments.length >
      data.value.datasets[0].backgroundColor.length
    ) {
      data.value.datasets[0].backgroundColor = departmentIdea.departments.map(
        (_, index) => `#${Math.floor(Math.random() * 16777215).toString(16)}` // Random color generator
      );
    }
    console.log(data.value);
  } else {
    data.value.labels = [];
    data.value.datasets[0].data = [];
  }
};

// Watch for changes in departmentStats and update chart
watch(departmentStats, () => {
  updateDonutChart();
});

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

// Fetch data on mount
onMounted(async () => {
  await getClosure();
  await fetchDepartmentStats(); // Fetch department stats on mount
});
</script>
