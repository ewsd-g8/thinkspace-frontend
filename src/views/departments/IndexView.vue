<template>
  <div>
    <div class="row px-1">
      <div class="col-12">
        <div class="page-title-box">
          <div class="page-title-right">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item active">Department</li>
            </ol>
          </div>
          <h4 class="page-title">Department</h4>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="pt-3 px-3 d-flex justify-content-end bg-white">
        <div class="d-flex position-relative me-2">
          <input
            type="text"
            class="form-control pe-4"
            v-model="searchValue"
            placeholder="Search..."
            @keydown.esc="searchValue = ''"
          />
          <i
            v-show="searchValue"
            class="mdi mdi-close text-danger fs-4 clear-icon"
            @click="searchValue = ''"
          ></i>
        </div>
        <router-link
          :to="{ name: 'department-create' }"
          class="btn btn-primary waves-effect waves-light float-end"
        >
          <i class="mdi mdi-plus me-sm-1 text-white"></i>Add New
        </router-link>
      </div>
      <div class="card-body">
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
    </div>

    <div
      id="change-status-modal"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body py-3 px-2">
            <div class="text-center">
              <i class="dripicons-information text-info modal-icon"></i>
              <h4 class="mb-3 mt-1 fs-4">Confirmation!</h4>
              <h5 class="mt-4 fs-5">Are you sure to change status?</h5>
              <div class="mt-2">
                <button
                  type="button"
                  class="btn btn-success my-2 me-2"
                  @click="changeDepartmentStatus()"
                  :disabled="loading"
                >
                  <span
                    v-if="loading"
                    class="spinner-border text-light spinner-border-sm me-1"
                  ></span>
                  {{ loading ? "Loading" : "Confirm" }}
                </button>
                <button
                  type="button"
                  class="btn btn-danger my-2"
                  data-bs-dismiss="modal"
                >
                  Cancel
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
import { ref, onMounted, reactive, watch } from "vue";
import { Http } from "@/services/http-common";
import Badge from "@/components/shared/Badge.vue";
import { createToast } from "mosha-vue-toastify";
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
  { text: "Description", value: "description", sortable: true },
  { text: "Created At", value: "created_at", sortable: true },
  { text: "Updated At", value: "updated_at", sortable: true },
  { text: "Active", value: "is_active", sortable: true },
  { text: "Action", value: "action", width: "200" },
];
// Function to convert UTC to local timezone
const formatToLocalTime = (utcDate) => {
  if (!utcDate) return ""; // Handle null/undefined
  const date = new Date(utcDate); // Parse UTC date string
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }); // e.g., "Mar 04, 2024, 10:00:00 AM"
};
const getResults = async () => {
  loading.value = true;

  if (searchValue.value) {
    serverOptions.value.page = 1;
  }
  try {
    const { data } = await Http.get(
      `departments?page=${serverOptions.value.page}&paginate=${serverOptions.value.rowsPerPage}&sortType=${serverOptions.value.sortType}&sortBy=${serverOptions.value.sortBy}&search=${searchValue.value}`
    );

    console.log("API response:", data);

    // Transform UTC dates to local timezone
    tableData.value = data.data.data.map((item) => ({
      ...item,
      created_at: formatToLocalTime(item.created_at),
      updated_at: formatToLocalTime(item.updated_at),
    }));
    console.log(tableData.value);
    serverItemsLength.value = data.data.total;
    console.log("Total: ", data.data.total);
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

const departmentId = ref("");
const openChangeStatusModal = (id) => {
  departmentId.value = id;
};

const changeDepartmentStatus = () => {
  loading.value = true;
  Http.get(`departments/change-status/${departmentId.value}`)
    .then(() => {
      $("#change-status-modal").modal("hide");
      createToast(
        { title: "Success", description: "Successfully Changed Status!" },
        {
          type: "success",
          transition: "bounce",
          position: "top-right",
          showIcon: true,
        }
      );
    })
    .catch((err) => {
      console.log(err);
      createToast(
        { title: "Error", description: "Failed to change status" },
        { type: "danger", position: "top-right" }
      );
    })
    .finally(() => getResults());
};

onMounted(() => {
  getResults();
});
</script>
