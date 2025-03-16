<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h1>Dashboard Page</h1>
        <div></div>
        <div>
          <div class="card">
            <div class="card-body">
              <h4>Category Page</h4>
              <EasyDataTable
                v-model:server-options="serverOptions"
                :server-items-length="serverItemsLength"
                :loading="loading"
                :headers="headers"
                :items="tableData"
                show-index
                @update-sort="updateSort"
                :rows-items="[10, 30, 50]"
                :search-value="searchValue"
                table-class-name="customize-table"
                :rows-per-page="10"
                buttons-pagination
                border-cell
                theme-color="#a1dcd8"
              >
                <template #loading>
                  <Loading></Loading>
                </template>
                <template #item-action="data">
                  <Popper arrow placement="right" content="Edit" hover>
                    <router-link
                      class="btn btn-sm btn-info"
                      :to="{ name: 'role-edit', params: { id: data.id } }"
                    >
                      <i class="mdi mdi-square-edit-outline"></i>
                    </router-link>
                  </Popper>
                </template>
                <template #item-is_active="data">
                  <Badge
                    :class="data.is_active ? 'bg-success' : 'bg-danger'"
                    :name="data.is_active ? 'Active' : 'Inactive'"
                  ></Badge>
                </template>
              </EasyDataTable>

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
                  class="btn btn-primary"
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
                      v-for="stat in departmentStats"
                      :key="stat.department_id"
                      class="Card"
                    >
                      <div class="name">{{ stat.department_name }}</div>
                      <div class="cardcontent">
                        Number of Ideas: <div class="count">{{ stat.ideas_count }}</div> 
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
// Imports for categories
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "vue-chartjs";
import { Pie } from "vue-chartjs";
ChartJS.register(ArcElement, Tooltip, Legend);

import { ref, watch, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { createToast } from "mosha-vue-toastify";
import { Http } from "@/services/http-common";
import { useAuthStore } from "@/stores/auth";
import { downloadUrl } from "@/composables/fileDownload";
import { reactive } from "vue";

const authStore = useAuthStore();

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

const headers = [
  { text: "Name", value: "name", sortable: true },
  { text: "Created At", value: "created_at", sortable: true },
  { text: "Updated At", value: "updated_at", sortable: true },
  { text: "Status", value: "is_active", sortable: true },
  { text: "Action", value: "action", width: "200" },
];


const router = useRouter();

// Fetch table data based on serverOptions
const fetchTableData = async () => {
  loading.value = true;
  try {
    const response = await Http.get("/get-all-categories", {
      params: {
        page: serverOptions.value.page,
        per_page: serverOptions.value.rowsPerPage,
        sortType: serverOptions.value.sortType,
        sortBy: serverOptions.value.sortBy,
        search: searchValue.value,
      },
    });
    tableData.value = response.data.data;
    serverItemsLength.value = response.data.total;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    createToast(
      { title: "Error", description: "Failed to load categories." },
      {
        type: "danger",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
  } finally {
    loading.value = false;
  }
};

// Update sort when triggered by EasyDataTable
const updateSort = (sortInfo) => {
  serverOptions.value.sortBy = sortInfo.sortBy;
  serverOptions.value.sortType = sortInfo.sortType;
  fetchTableData();
};

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

// Fetch department statistics
const fetchDepartmentStats = async () => {
  loadingStats.value = true;
  try {
    const response = await Http.get("/stats/ideas-per-department");
    console.log("d", response)
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

// Department Donut chart
const pieData_values = ref([40, 39, 10, 40, 39, 80, 40]);
const pieLabel_values = ref([
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
]);

const colors = ref(["#41B883", "#E46651", "#00D8FF", "#DD1B16"]);

// Fetch department statistics
const fetchBrowsers = async () => {
  loadingStats.value = true;
  try {
    const response = await Http.get("/stats/ideas-per-department");
    console.log("d", response);
    departmentStats.value = response.data; // Adjust based on your API response structure

    pieLabel_values.value = response.data.departments.map(
      (stat) => stat.department_name
    );

    pieData_values.value = response.data.departments.map(
      (stat) => stat.percentage
    );

    colors.value = response.data.departments.map(
      () =>
        `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`
    );

    console.log("background Color:", colors.value);
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

const pieData = computed(() => {
  return {
    labels: pieLabel_values.value,
    datasets: [
      {
        label: "Data One",
        backgroundColor: colors.value,
        data: pieData_values.value,
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

// Fetch data on mount
onMounted(async () => {
  await fetchTableData();
  await getClosure();
  await fetchDepartmentStats(); // Fetch department stats on mount
});
</script>