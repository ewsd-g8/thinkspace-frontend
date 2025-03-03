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

              <!-- 
<script setup>
import { ref, onMounted } from 'vue';
import { Http } from '@/services/http-common';

const ideas = ref([]);
const newCategory = ref('');

onMounted(async () => {
  const response = await Http.get('/api/ideas');
  ideas.value = response.data;
});

const addCategory = async () => {
  if (newCategory.value.trim() === '') return;

  await Http.post('/api/categories', { name: newCategory.value });
  newCategory.value = '';
  // Optionally, fetch ideas again if they depend on categories
};
</script> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// for categories
import { ref } from "vue";
import { Http } from "@/services/http-common";

const categories = ref([]);

// const fetchCategories = async () => {
//   const response = await Http.get("/api/categories");
//   console.log(response);
//   categories.value = response.data.data.data;
// };

// fetchCategories();
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
  { text: "Status", value: "is_active", sortable: true },
  { text: "Action", value: "action", width: "200" },
];
</script>
