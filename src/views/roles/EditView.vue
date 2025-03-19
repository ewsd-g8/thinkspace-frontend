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
              <li class="breadcrumb-item active">
                <router-link :to="{ name: 'role-index' }">Roles</router-link>
              </li>
              <li class="breadcrumb-item active">Edit</li>
            </ol>
          </div>
          <h4 class="page-title">Role Edit</h4>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div v-if="loading" style="height: 50vh">
          <Loading></Loading>
        </div>
        <template v-else>
          <div class="row">
            <div class="mb-3 col-md-6">
              <label for="name" class="form-label">
                Name <span class="text-danger">*</span>
              </label>
              <input
                class="form-control"
                type="text"
                autofocus
                placeholder="Enter Role Name"
                v-model="formData.name"
                :class="{ 'is-invalid': v$.name.$error || errorFor('name') }"
              />
              <v-errors
                :serverErrors="errorFor('name')"
                :vuelidateErrors="{ errors: v$.name.$errors, value: 'Name' }"
              ></v-errors>
            </div>
          </div>

          <!-- Permissions Section -->
          <div class="row">
            <div class="mb-3 col-md-12">
              <h5>Permissions</h5>
              <div
                class="table-responsive"
                :class="{ 'permission-is-invalid': v$.permission.$error || errorFor('permission') }"
              >
                <table class="table table-flush-spacing">
                  <tbody>
                    <tr>
                      <td class="text-nowrap fw-semibold" width="25%">
                        Administrator Access
                        <Popper
                          arrow
                          placement="top"
                          content="Allow full access to the system"
                          hover
                        >
                          <i class="mdi mdi-information-outline" style="cursor: pointer"></i>
                        </Popper>
                      </td>
                      <td width="75%">
                        <div class="row">
                          <div class="col-3">
                            <div class="form-check form-check-success">
                              <input
                                class="form-check-input rounded-circle"
                                id="select-all"
                                type="checkbox"
                                v-model="selectAllPermissions"
                                @change="checkAllPermissions()"
                              />
                              <label for="select-all" class="form-check-label">Select All</label>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr v-for="(permission, index) in permissions" :key="`permission${index}`">
                      <td class="text-nowrap fw-semibold" width="25%">{{ index }}</td>
                      <td width="75%">
                        <div class="row">
                          <div class="col-2" v-for="(data, idx) in permission" :key="idx">
                            <div class="form-check form-check-success">
                              <input
                                class="form-check-input rounded-circle"
                                :id="`checkbox${data.id}`"
                                type="checkbox"
                                v-model="formData.permission"
                                :value="data.id"
                              />
                              <label :for="`checkbox${data.id}`" class="form-check-label">
                                {{ data.label }}
                              </label>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <v-errors
                :serverErrors="errorFor('permission')"
                :vuelidateErrors="{ errors: v$.permission.$errors, value: 'Permission' }"
              ></v-errors>
            </div>
          </div>

          <!-- Menu Items Section -->
          <div class="row">
            <div class="mb-3 col-md-12">
              <h5>Menu Items</h5>
              <div class="table-responsive">
                <table class="table table-flush-spacing">
                  <tbody>
                    <tr>
                      <td class="text-nowrap fw-semibold" width="25%">
                        Menu Access
                        <Popper
                          arrow
                          placement="top"
                          content="Select which menu items this role can see"
                          hover
                        >
                          <i class="mdi mdi-information-outline" style="cursor: pointer"></i>
                        </Popper>
                      </td>
                      <td width="75%">
                        <div class="row">
                          <div class="col-3">
                            <div class="form-check form-check-success">
                              <input
                                class="form-check-input rounded-circle"
                                id="select-all-menus"
                                type="checkbox"
                                v-model="selectAllMenus"
                                @change="checkAllMenus()"
                              />
                              <label for="select-all-menus" class="form-check-label">Select All</label>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td class="text-nowrap fw-semibold" width="25%">Menu Options</td>
                      <td width="75%">
                        <div class="row">
                          <div class="col-3" v-for="(menu, index) in menuItems" :key="index">
                            <div class="form-check form-check-success">
                              <input
                                class="form-check-input rounded-circle"
                                :id="`menu${menu.id}`"
                                type="checkbox"
                                v-model="formData.menu_items"
                                :value="menu.id"
                              />
                              <label :for="`menu${menu.id}`" class="form-check-label">
                                {{ menu.label }}
                              </label>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="mt-2">
            <button class="btn btn-primary loading-button me-2" @click="updateRole()">
              Update
            </button>
            <router-link :to="{ name: 'role-index' }" class="btn btn-outline-secondary">
              Cancel
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { Http } from "@/services/http-common";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { createToast } from "mosha-vue-toastify";
import { useRouter, useRoute } from "vue-router";
import {
  errorFor,
  serverErrors,
  resetServerErrors,
} from "@/composables/validationErrors";

const permissions = ref([]);
const menuItems = ref([
  { id: "dashboard", label: "Dashboard" },
  { id: "category", label: "Category" },
  { id: "department", label: "Department" },
  { id: "report_type", label: "Report Type" },
  { id: "idea_post", label: "Idea Post" },
  { id: "user_management", label: "User Management" },
  { id: "closure", label: "Closure" },
  { id: "chart_demo", label: "Chart Demo" },
]);
const selectAllPermissions = ref(false);
const selectAllMenus = ref(false);
const loading = ref(false);

const router = useRouter();
const route = useRoute();
const formData = reactive({
  name: "",
  permission: [], // Permission IDs
  menu_items: [], // Menu item IDs
});

const rules = computed(() => ({
  name: { required },
  permission: { required },
  // menu_items is optional, so no validation required unless you want it
}));

const v$ = useVuelidate(rules, formData);

const getRoleDetail = async () => {
  loading.value = true;
  try {
    const res = await Http.get(`roles/${route.params.id}`);
    formData.name = res.data.data.role.name;
    formData.permission = res.data.data.role.permissions.map((p) => p.id);
    // Assuming the API returns menu_items as an array of IDs
    formData.menu_items = res.data.data.menu_items || [];
  } catch (err) {
    console.error("Error fetching role:", err);
    if (err.response?.status === 404) {
      router.push({ name: "role-index" });
    }
  } finally {
    loading.value = false;
  }
};

const getPermissions = async () => {
  try {
    const res = await Http.get("permissions");
    permissions.value = res.data.data;
  } catch (err) {
    console.error("Error fetching permissions:", err);
  }
};

const checkAllPermissions = () => {
  if (selectAllPermissions.value) {
    formData.permission = [];
    for (const key in permissions.value) {
      if (Object.hasOwnProperty.call(permissions.value, key)) {
        permissions.value[key].forEach((element) => {
          formData.permission.push(element.id);
        });
      }
    }
  } else {
    formData.permission = [];
  }
};

const checkAllMenus = () => {
  if (selectAllMenus.value) {
    formData.menu_items = menuItems.value.map((menu) => menu.id);
  } else {
    formData.menu_items = [];
  }
};

const updateRole = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  console.log("Sending payload:", formData);
  loading.value = true;
  resetServerErrors();

  try {
    await Http.put(`roles/${route.params.id}`, formData);
    router.push({ name: "role-index" });
    createToast(
      {
        title: "Success",
        description: "Successfully Updated Role!",
      },
      {
        type: "success",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
  } catch (err) {
    console.error("Update error:", err);
    serverErrors(err.response?.data.errors);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  resetServerErrors();
  getRoleDetail();
  getPermissions();
});
</script>