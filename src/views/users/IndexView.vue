<template>
  <div>
    <div class="row px-1">
      <div class="col-12">
        <div class="page-title-box">
          <div class="page-title-right">
            <ol class="breadcrumb m-0">
              <li class="breadcrumb-item">
                <a href="javascript: void(0);">User Management</a>
              </li>
              <li class="breadcrumb-item active">Users</li>
            </ol>
          </div>
          <h4 class="page-title">Users</h4>
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
            class="mdi mdi-close text-danger fs-4"
            style="cursor: pointer"
            @click="searchValue = ''"
          ></i>
        </div>
        <router-link
          :to="{ name: 'user-create' }"
          class="btn btn-blue waves-effect waves-light float-end"
        >
          <i class="mdi mdi-plus me-sm-1 text-dark"></i>Add New
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
          <template #item-roles="data">
            <span v-for="role in data.roles" :key="role.name">
              <Badge :class="'bg-primary'" :name="role.name"></Badge>
            </span>
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

            <Popper arrow placement="top" content="Edit" hover>
              <router-link
                :to="{ name: 'user-edit', params: { id: data.id } }"
                class="btn btn-sm btn-info"
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
    <!-- Info Alert Modal -->
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
              <i
                class="dripicons-information text-info"
                style="font-size: 4rem"
              ></i>
              <h4 class="mb-3 mt-1 fs-4">Confirmation!</h4>
              <h5 class="mt-4 fs-5">Are you sure to change status?</h5>
              <div class="mt-2">
                <button
                  type="button"
                  class="btn btn-success my-2 me-2"
                  @click="changeUserStatus()"
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
                  Cancel&nbsp;
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- /.modal-content -->
      </div>
      <!-- /.modal-dialog -->
    </div>
    <!-- /.modal -->
  </div>
</template>
<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import { Http } from "@/services/http-common";
import Badge from "@/components/shared/Badge.vue";
import Skeleton from "@/components/shared/Skeleton.vue";
import { createToast } from "mosha-vue-toastify";

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
  { text: "Email", value: "email", sortable: true },
  { text: "Mobile", value: "mobile", sortable: true },
  { text: "Role", value: "roles", sortable: false },
  { text: "IsActive", value: "is_active", sortable: true },
  { text: "Action", value: "action", width: "180" },
];

const getResults = async () => {
  loading.value = true;

  if (searchValue.value) {
    serverOptions.value.page = 1;
  }

  await Http.get(
    `users?page=${serverOptions.value.page}&paginate=${serverOptions.value.rowsPerPage}&sortType=${serverOptions.value.sortType}&sortBy=${serverOptions.value.sortBy}&search=${searchValue.value}`
  )
    .then((res) => {
      tableData.value = res.data.data.data;
      serverItemsLength.value = res.data.data.total;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      loading.value = false;
    });
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

const userId = ref("");
const openChangeStatusModal = (id) => {
  userId.value = id;
};

const changeUserStatus = () => {
  loading.value = true;
  Http.get(`users/change-status/${userId.value}`)
    .then(() => {
      $("#change-status-modal").modal("hide");
      createToast(
        {
          title: "Success",
          description: "Successfully Change Status!",
        },
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
    })
    .finally(() => {
      getResults();
    });
};

onMounted(() => {
  getResults();
});
</script>
