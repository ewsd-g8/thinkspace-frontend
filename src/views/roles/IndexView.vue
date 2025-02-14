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
              <li class="breadcrumb-item active">Roles</li>
            </ol>
          </div>
          <h4 class="page-title">Roles</h4>
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
          :to="{ name: 'role-create' }"
          class="btn btn-blue waves-effect waves-light float-end"
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
      </div> 

    </div>
  </div>
</template>





<script setup>
import { ref, onMounted, reactive, watch } from "vue";
import { Http } from "@/services/http-common";
import Badge from "@/components/shared/Badge.vue";

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
  { text: "Created At", value: "created_at", sortable: true },
  { text: "Updated At", value: "updated_at", sortable: true },
  { text: "Action", value: "action", width: "200" },
];

const getResults = async () => {
  loading.value = true;

  if (searchValue.value) {
    serverOptions.value.page = 1;
  }

  await Http.get(
    `roles?page=${serverOptions.value.page}&paginate=${serverOptions.value.rowsPerPage}&sortType=${serverOptions.value.sortType}&sortBy=${serverOptions.value.sortBy}&search=${searchValue.value}`
  )
    .then((res) => {
      tableData.value = res.data.data.roles.data;
      serverItemsLength.value = res.data.data.roles.total;
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

onMounted(() => {
  getResults();
});
</script>
