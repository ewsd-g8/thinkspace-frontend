<template>
  <div>
    <div class="row px-1">
      <div class="col-12">
        <div class="page-title-box">
          <div class="page-title-right">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item active">Dashboard</li>
            </ol>
          </div>
          <h4 class="page-title">Dashboard</h4>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div class="mb-3">
          <div class="showcard">
            <h2>Ideas in each Department</h2>
            <div v-if="loadingStats" class="text-center">
              <p>Loading department statistics...</p>
            </div>
            <div v-else-if="departmentStats.length === 0" class="text-center">
              <p>No department statistics available.</p>
            </div>
            <div v-else class="d-flex flex-wrap justify-content-around">
              <div
                v-for="stat in departmentStats.departments"
                :key="stat.department_id"
                class="idea-card d-flex rounded mb-3"
                style="width: 250px"
              >
                <span
                  class="w-50 p-3 fs-3 rounded-start d-flex justify-content-center align-items-center"
                  :style="{
                    backgroundColor: stat.department_color,
                    color: '#fff',
                    textAlign: 'center',
                  }"
                >
                  {{ stat.ideas_count }}
                </span>
                <div
                  class="p-2 w-75 d-flex justify-content-center align-items-center"
                >
                  <div>
                    <div class="d-inline-block">
                      <span class="text-body-secondary">
                        Number of Ideas in
                      </span>
                    </div>
                    <div class="d-inline-block">
                      <span class="fs-4 fw-semibold" style="color: #620f10">
                        {{ stat.department_name }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-3">
          <div class="showcard">
            <h2>Download Ideas and Document for</h2>

            <button
              @click="downloadFile(1)"
              class="btn btn-primary m-1"
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
          </div>
        </div>

        <div class="row justify-content-between">
          <div class="col-8">
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
              :rows-per-page="5"
              buttons-pagination
              border-cell
              theme-color="#a1dcd8"
            >
              <template #loading>
                <Loading></Loading>
              </template>
              <template #item-action="data">
                <Popper arrow placement="top" content="Change Status" hover>
                  <button
                    class="btn btn-secondary waves-effect waves-light btn-sm me-1"
                    data-bs-toggle="modal"
                    data-bs-target="#change-status-modal"
                    @click="openChangeStatusModal(data.id)"
                  >
                    <i class="mdi mdi-sync text-white"></i>
                  </button>
                </Popper>
                <Popper arrow placement="right" content="Edit" hover>
                  <router-link
                    class="btn btn-sm btn-info"
                    :to="{ name: 'department-edit', params: { id: data.id } }"
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
          </div>
          <div class="col-4">
            <div class="p-3 shadow mb-5 bg-body-tertiary rounded">
              <span>Percentage of Browser Usage </span>
              <div class="w-100">
                <Pie :data="pieData" :options="options" />
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
          <div class="col-4">
            <div class="p-3 shadow mb-5 bg-body-tertiary rounded">
              <span class="mb-5">Percentage of Ideas Per Department</span>
              <div class="w-100 mt-1">
                <Doughnut :data="donutData" :options="options" />
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-8">
            <div class="">
              <h4>Most Active Users</h4>
            </div>
            <div class="discuss-box scale-in-center">
              <div class="box-top">
                <div class="discuss-pf">
                  <div class="pf-img">
                    <img src="/images/users/anonymous.jpg" alt="" />
                  </div>
                  <div class="name-user">
                    <strong>Ethan Martinez</strong>
                    <span>@ethanmartinez</span>
                  </div>
                </div>
              </div>
              <div class="comment">
                <p>
                  Jessica seems to be posting a lot of private material on
                  Instagram, which concerns me. Sometimes she's not aware of the
                  dangers involved in exposing her life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  <WelcomeModal
    v-if="isShowAlert"
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

import { createToast } from "mosha-vue-toastify";
import { Http } from "@/services/http-common";
import { useAuthStore } from "@/stores/auth";
import { downloadUrl } from "@/composables/fileDownload";
import WelcomeModal from "@/components/shared/modal.vue";
import Badge from "@/components/shared/Badge.vue";
import { reactive } from "vue";
import { color } from "chart.js/helpers";


const authStore = useAuthStore();
const lastLogout = authStore.getUserLogout;
let isFirstLogin = authStore.getIsFirstLogin;


 console.log(lastLogout);
 console.log(isFirstLogin);

const showModal = ref(false);
const modalTitle = ref("");
const modalMsg = ref("");

const exportBtnLoading = ref(false); // Loading state for Excel download
const zipBtnLoading = ref(false); // Loading state for ZIP download
const closures = ref([]); // Added closures ref
const departmentStats = ref([]); // New ref for department statistics
const loadingStats = ref(false); //Loading state for department stats

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
      (stat) => stat.department_color
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
const broswerStats = ref([]);
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

const pieColors = ref(["#41B883", "#E46651", "#00D8FF", "#DD1B16"]);

// Fetch department statistics
const fetchBrowserStats = async () => {
  loadingStats.value = true;
  try {
    const response = await Http.get("/stats/browsers");
    console.log("b", response);
    broswerStats.value = response.data; // Adjust based on your API response structure

    pieLabel_values.value = broswerStats.value.map((stat) => stat.name);

    pieData_values.value = broswerStats.value.map(
      (stat) => stat.usage_percentage
    );

    pieColors.value = broswerStats.value.map((stat) => stat.color);

    console.log("Pie Color:", pieColors.value);
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
        backgroundColor: pieColors.value,
        data: pieData_values.value,
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
    colors.value = ContributionStats.value.map((stat) => stat.department_color);

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

//show modal
const isShowAlert = computed(() => {
  let isShow = false;
  let showAlert = localStorage.getItem("show_modal");
  if (showAlert) {
    isShow = true;
    localStorage.removeItem("show_modal");
  }
  return isShow;
});

// Ideas of User in a department
const pageLoading = ref(true);
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

const headers = [
  { text: "Name", value: "name", sortable: true },
  { text: "User Name", value: "description", sortable: true },
  { text: "Created At", value: "created_at", sortable: true },
  { text: "Updated At", value: "updated_at", sortable: true },
  { text: "Active", value: "is_active", sortable: true },
  { text: "Action", value: "action", width: "200" },
];

const getResults = async () => {
  loading.value = true;

  if (searchValue.value) {
    serverOptions.value.page = 1;
  }
  try {
    const { data } = await Http.get(
      `stats/contributions-related-department?page=${serverOptions.value.page}&paginate=${serverOptions.value.rowsPerPage}&sortType=${serverOptions.value.sortType}&sortBy=${serverOptions.value.sortBy}&search=${searchValue.value}`
    );

    console.log("API response:", data);

    // Transform UTC dates to local timezone
    tableData.value = data.data.data.map((item) => item);
    console.log("Table Data: ", tableData.value);
    serverItemsLength.value = data.data.total;
  } catch (err) {
    console.error("Error fetching categories:", err);
  } finally {
    loading.value = false;
  }
};

const updateSort = (selectedSortOptions) => {
  serverOptions.value.sortType = selectedSortOptions.sortType
    ? selectedSortOptions.sortType
    : "";
  serverOptions.value.sortBy = selectedSortOptions.sortBy;
};

watch(
  serverOptions,
  (value) => {
    getResults();
  },
  { deep: true }
);
const timer = ref(null);
watch(
  searchValue,
  (value) => {
    clearTimeout(timer.value);
    timer.value = setTimeout(() => {
      getResults();
    }, 500);
  },
  { deep: true }
);

// Fetch data on mount
onMounted(async () => {
  await getClosure();
  await fetchDepartmentStats(); // Fetch department stats on mount
  await fetchContributions();
  await fetchBrowserStats();

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
<style scoped>
.idea-card {
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
}
</style>
<style scoped>
.discuss-box {
  box-shadow: 2px 2px 30px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  padding: 20px;
  margin: 15px;
  cursor: pointer;
}

.pf-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 10px;
}

.pf-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.discuss-pf {
  display: flex;
  align-items: center;
}

.name-user {
  display: flex;
  flex-direction: column;
}

.name-user strong {
  color: #3d3d3d;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.name-user span {
  color: #979797;
  font-size: 0.8rem;
}

.discuss-content a {
  color: #535353;
}

.box-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.comment p {
  font-size: 0.9rem;
  color: #4b4b4b;
}
</style>
