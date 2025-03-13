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
                <button @click="downloadFile(1)" class="btn btn-primary" :disabled="exportBtnLoading.value">
                  {{ exportBtnLoading.value ? 'Downloading...' : 'Download Ideas as Excel' }}
                </button>
                <button @click="downloadDocumentsAsZip" class="btn btn-primary" :disabled="zipBtnLoading.value">
                  {{ zipBtnLoading.value ? 'Downloading...' : 'Download Documents as ZIP' }}
                </button>
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
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { createToast } from "mosha-vue-toastify";
import { Http } from "@/services/http-common";
import { useAuthStore } from "@/stores/auth";
import { downloadUrl } from "@/composables/fileDownload";

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

const headers = [
  { text: "Name", value: "name", sortable: true },
  { text: "Created At", value: "created_at", sortable: true },
  { text: "Updated At", value: "updated_at", sortable: true },
  { text: "Status", value: "is_active", sortable: true },
  { text: "Action", value: "action", width: "200" },
];

const authStore = useAuthStore();
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
    tableData.value = response.data.data; // Adjust based on your API response structure
    serverItemsLength.value = response.data.total; // Adjust based on your API response structure
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    createToast(
      { title: "Error", description: "Failed to load categories." },
      { type: "danger", transition: "bounce", position: "top-right", showIcon: true }
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
      { type: "danger", transition: "bounce", position: "top-right", showIcon: true }
    );
  }
};

// Download ideas as Excel (still using downloadUrl)
const downloadFile = async (type) => {
  if (!closures.value.length) {
    createToast(
      { title: "Error", description: "No closure available to export ideas." },
      { type: "danger", transition: "bounce", position: "top-right", showIcon: true }
    );
    return;
  }

  exportBtnLoading.value = true;
  const closureId = closures.value[0]?.id;
  let url = `/export-ideas/${closureId}?export-type=${type}&sortType=${serverOptions.value.sortBy}&search=${searchValue.value}`;
  let name = "-ideas-export";
  let extension = type === 1 ? ".xlsx" : ".csv";

  try {
    await downloadUrl(url, name, extension);
    createToast(
      { title: "Success", description: "Ideas downloaded successfully!" },
      { type: "success", transition: "bounce", position: "top-right", showIcon: true }
    );
  } catch (error) {
    console.error("Failed to download ideas:", error);
    const errorMessage = error.message || "Failed to download ideas.";
    createToast(
      { title: "Error", description: errorMessage },
      { type: "danger", transition: "bounce", position: "top-right", showIcon: true }
    );
  } finally {
    exportBtnLoading.value = false;
  }
};

// Download documents as ZIP (without using downloadUrl)
const downloadDocumentsAsZip = async () => {
  if (!closures.value.length) {
    createToast(
      { title: "Error", description: "No closure available to export documents." },
      { type: "danger", transition: "bounce", position: "top-right", showIcon: true }
    );
    return;
  }

  zipBtnLoading.value = true;
  const closureId = closures.value[0]?.id;
  const url = `/download-documents/${closureId}`;

  try {
    // Make the HTTP request to fetch the ZIP file
    const response = await Http.get(url, {
      responseType: "blob", // Ensure the response is treated as a Blob
    });

    // Check if the response status indicates an error
    if (response.status >= 400) {
      // Attempt to parse the response as JSON to get the error message
      const text = await response.data.text();
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch (e) {
        throw new Error("Failed to download ZIP: Invalid response format");
      }
      throw new Error(errorData.message || "Failed to download ZIP");
    }

    // Create a Blob from the response data
    const blob = new Blob([response.data], {
      type: response.headers["content-type"] || "application/zip", // Fallback to application/zip if Content-Type is missing
    });

    // Create a temporary URL for the Blob
    const blobUrl = window.URL.createObjectURL(blob);

    // Create a hidden <a> element to trigger the download
    const a = document.createElement("a");
    a.href = blobUrl;
    const currentDate = new Date();
    const isoDate = currentDate.toISOString().split("T")[0];
    a.download = `${isoDate}-documents-${closureId}.zip`; // Set the filename
    a.click();

    // Clean up the Blob URL
    window.URL.revokeObjectURL(blobUrl);

    createToast(
      { title: "Success", description: "Documents downloaded as ZIP!" },
      { type: "success", transition: "bounce", position: "top-right", showIcon: true }
    );
  } catch (error) {
    console.error("Failed to download documents:", error);
    const errorMessage = error.message || "Failed to download documents as ZIP.";
    createToast(
      { title: "Error", description: errorMessage },
      { type: "danger", transition: "bounce", position: "top-right", showIcon: true }
    );
  } finally {
    zipBtnLoading.value = false;
  }
};

// Fetch data on mount
onMounted(async () => {
  await fetchTableData();
  await getClosure();
});
</script>