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
          <div
            class="showcard text-center shadow-lg p-3 mb-5 bg-body-tertiary rounded"
          >
            <div class="card-header mb-3">
              <h2>Ideas in each Department</h2>
            </div>
            <div v-if="loadingStats" class="text-center">
              <p>Loading department statistics...</p>
            </div>
            <div v-else-if="departmentStats.length === 0" class="text-center">
              <p>No department statistics available.</p>
            </div>
            <div
              v-else
              class="d-flex flex-wrap justify-content-around align-items-center"
            >
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

        <div class="row d-flex justify-content-between flex-wrap">

          <div class="col-8">
            <div
              class="card text-center shadow-lg p-3 mb-5 bg-body-tertiary rounded"
            >
              <div class="card-header">
                <h3 class="fw-bold" style="color: #620f10">Most Active User</h3>
              </div>
              <div class="card-body">
                <EasyDataTable
                  v-model:server-options="serverOptions"
                  :server-items-length="serverItemsLength"

                  :loading="ActiveLoading"
                  :headers="mostactive"
                  :items="MostActiveTable"
                  show-index
                  :rows-items="[5, 10]"

                  table-class-name="mostactive-table"
                  :rows-per-page="5"
                  buttons-pagination
                  theme-color="#a1dcd8"
                >
                  <template #loading>
                    <Loading></Loading>
                  </template>
                  <template #item-profile="data">
                    <img
                      class="rounded-circle object-fit-cover"
                      style="width: 35px; height: 35px"
                      :src="
                        data.profile
                          ? data.profile
                          : '/images/users/anonymous.jpg'
                      "
                      alt=""
                    />
                  </template>
                </EasyDataTable>
              </div>
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

        <div class="row row d-flex justify-content-between flex-wrap">
          <div class="col-8 shadow p-2 mb-5 bg-body-tertiary rounded">

            <span class="">Percentage of Ideas Per Department</span>
            <div class="w-100 mt-1" style="height: 320px">
              <Line :data="lineData" :options="options" />
            </div>
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

        <div class="row d-flex flex-wrap">
          <div class="col-6" v-if="userRole === 'QAcoordinator'">
            <div
              class="card text-center p-3 shadow mb-5 bg-body-tertiary rounded"
            >
              <div class="card-header">
                <h3 class="fw-bold" style="color: #620f10">
                  Contributions of Users in The Department
                </h3>
              </div>
              <div class="card-body">
                <EasyDataTable
                  v-model:server-options="conServerOptions"
                  :server-items-length="conItemLength"
                  :loading="conLoading"
                  :headers="headers"
                  :items="userData"
                  show-index
                  :rows-items="[5, 10]"
                  table-class-name="usersInDept-table"
                  :rows-per-page="5"
                  buttons-pagination
                  theme-color="#a1dcd8"
                >
                  <template #loading>
                    <Loading></Loading>
                  </template>
                </EasyDataTable>
              </div>
            </div>
          </div>
          <div :class="userRole === 'QAcoordinator' ? 'col-6' : 'col'">

            <div
              class="card text-center p-3 shadow mb-5 bg-body-tertiary rounded"
            >
              <div class="card-header">
                <h3 class="fw-bold" style="color: #620f10">
                  Download Ideas and Document
                </h3>
              </div>
              <div class="card-body">
                <table class="table table-bordered" style="color: #000">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Closure Name</th>
                      <th scope="col">Closure Date</th>
                      <th scope="col">Final Date</th>
                    </tr>
                  </thead>
                  <tbody class="table-group-divider" style="color: black">
                    <tr>
                      <th scope="row">1</th>
                      <td>{{ closure.name }}</td>
                      <td>{{ closure.date }}</td>
                      <td>{{ closure.finaldate }}</td>
                    </tr>
                    <tr>
                      <td colspan="3">
                        <button
                          @click="downloadFile(1)"
                          class="btn btn-outline-primary"
                          :disabled="exportBtnLoading.value"
                        >
                          {{
                            exportBtnLoading.value
                              ? "Downloading..."
                              : "Download Ideas as Excel"
                          }}
                        </button>
                      </td>
                      <td>
                        <button
                          @click="downloadDocumentsAsZip"
                          class="btn btn-outline-primary"
                          :disabled="zipBtnLoading.value"
                        >
                          {{
                            zipBtnLoading.value
                              ? "Downloading..."
                              : "Download Documents as ZIP"
                          }}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
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

import Badge from "@/components/shared/Badge.vue";
import { reactive } from "vue";
import { color } from "chart.js/helpers";

const authStore = useAuthStore();

const userRoles = authStore.getAuthUserRoles;
const userDeptName = authStore.getDeptName;
const userRole = userRoles[0];
console.log("User Role:", userRole);

console.log("Department:", userDeptName);

const exportBtnLoading = ref(false); // Loading state for Excel download
const zipBtnLoading = ref(false); // Loading state for ZIP download
const closures = ref([]); // Added closures ref
const departmentStats = ref([]); // New ref for department statistics
const loadingStats = ref(false); //Loading state for department stats
const ActiveLoading = ref(false); // Loading contribution in department
const loading = ref(false); // loading for closure detail

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

const closure = reactive({
  id: "",
  name: "",
  date: "",
  finaldate: "",
});

const getClosureDetail = async () => {
  loading.value = true;
  const closureId = closures.value[0]?.id;
  await Http.get(`closures/${closureId}`)
    .then((res) => {
      console.log("res", res);
      closure.id = res.data.data.id;
      closure.name = res.data.data.name;
      closure.date = res.data.data.date;
      closure.finaldate = res.data.data.final_date;
      loading.value = false;
    })
    .catch((err) => {
      if (err.response.status == 404) {
        router.push({ name: "page-not-found" });
      }
    });
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

// Ideas of User in a department

const conLoading = ref(false);
const contableData = ref({});

const conItemLength = ref(0);
const conServerOptions = ref({
  page: 1,
  rowsPerPage: 5,
  sortType: "",
  sortBy: "",
});
const headers = [
  { text: "Name", value: "user_name", sortable: true },
  { text: "Ideas", value: "ideas.length", sortable: true },
  { text: "Comments", value: "comments.length", sortable: true },
];
const userData = ref([]);
const getResults = async () => {
  conLoading.value = true;
  try {
    const { data } = await Http.get(
      `/stats/contributions-related-department?page=${conServerOptions.value.page}&paginate=${conServerOptions.value.rowsPerPage}`
    );
    console.log("Result: ", data);
    contableData.value = data.data.users;
    console.log("Table Data: ", contableData.value);
    // Map users to the table format

    userData.value = contableData.value.map((user) => user);
    console.log("Mapped contribData:", userData.value);
    conItemLength.value = data.pagination.total;
    console.log(conItemLength.value);
  } catch (err) {
    console.error("Error fetching contribution related department:", err);
  } finally {
    conLoading.value = false;
  }
};


//Most Active Users


const serverItemsLength = ref(0);
const searchValue = ref("");
const serverOptions = ref({
  page: 1,
  rowsPerPage: 5,
  sortType: "",
  sortBy: "",
});


const MostActiveTable = ref([]);
const mostactive = [
  { text: "Profile", value: "profile", sortable: true },
  { text: "Name", value: "name", sortable: true },
  { text: "Department", value: "department.name", sortable: true },
  { text: "Ideas", value: "ideas_count", sortable: true },
  { text: "Comments", value: "comments_count", sortable: true },
];

const getMostActiveUser = async () => {
  ActiveLoading.value = true;
  try {
    const { data } = await Http.get(
      `/stats/most-active-users?page=${serverOptions.value.page}&paginate=${serverOptions.value.rowsPerPage}`
    );

    console.log("Most Active API response:", data);

    // Transform UTC dates to local timezone
    MostActiveTable.value = data.data.map((item) => ({
      ...item,
    }));
    console.log("Most Active user:", MostActiveTable.value);
    serverItemsLength.value = data.total;
  } catch (err) {
    console.error("Error fetching Most active users:", err);

  } finally {
    ActiveLoading.value = false;
  }
};


watch(
  serverOptions,
  (value) => {
    getResults();
    getMostActiveUser();
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
      getMostActiveUser();
    }, 500);
  },
  { deep: true }
);

// Fetch data on mount
onMounted(async () => {
  await getClosure();

  getClosureDetail();

  await fetchDepartmentStats(); // Fetch department stats on mount
  await fetchContributions();
  await fetchBrowserStats();
  getResults();
  getMostActiveUser();
});
</script>
<style scoped>
.idea-card {
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2);
}
</style>
