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

              <li class="breadcrumb-item active">Create</li>
            </ol>
          </div>
          <h4 class="page-title">Role Create</h4>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-body">
        <div v-if="loading" style="height: 50vh">
          <Loading></Loading>
        </div>
        <div class="row">
          <div class="mb-3 col-md-6">
            <label for="name" class="form-label"
              >Name <span class="text-danger">*</span></label
            >
            <input
              class="form-control"
              type="text"
              autofocus=""
              placeholder="Enter Role Name"
              v-model="formData.name"
              :class="{
                'is-invalid': v$.name.$error || errorFor('name'),
              }"
            />
            <v-errors
              :serverErrors="errorFor('name')"
              :vuelidateErrors="{
                errors: v$.name.$errors,
                value: 'Name',
              }"
            ></v-errors>
          </div>
        </div>
        <div class="row">
          <div class="mb-3 col-md-12">
            <div
              class="table-responsive"
              style="overflow-x: hidden"
              :class="{
                'permission-is-invalid':
                  v$.permission.$error || errorFor('permission'),
              }"
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
                        <i
                          class="mdi mdi-information-outline"
                          style="cursor: pointer"
                        ></i>
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
                              v-model="selectAll"
                              @change="checkAllPermissions()"
                            />
                            <label for="select-all" class="form-check-label"
                              >Select All
                            </label>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                  <tr
                    v-for="(permission, index) in permissions"
                    :key="`permission${index}`"
                  >
                    <td class="text-nowrap fw-semibold" width="25%">
                      {{ index }}
                    </td>
                    <td width="75%">
                      <div class="row">
                        <div
                          class="col-2"
                          v-for="(data, index) in permission"
                          :key="index"
                        >
                          <div class="form-check form-check-success">
                            <input
                              class="form-check-input rounded-circle"
                              :id="`checkbox${data.id}`"
                              type="checkbox"
                              v-model="formData.permission"
                              :value="data.id"
                            />
                            <label
                              :for="`checkbox${data.id}`"
                              class="form-check-label"
                              >{{ data.label }}
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
              :vuelidateErrors="{
                errors: v$.permission.$errors,
                value: 'Permission',
              }"
            ></v-errors>
          </div>
        </div>
        <div class="mt-2">
          <button
            class="btn btn-success loading-button me-2"
            @click="updateRole()"
          >
            Create
          </button>
          <router-link
            :to="{ name: 'role-index' }"
            class="btn btn-outline-secondary"
            >Cancel</router-link
          >
        </div>
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
const selectAll = ref(false);
const loading = ref(false);

const router = useRouter();
const route = useRoute();
const formData = reactive({
  name: "",
  permission: [],
});

const rules = computed(() => {
  return {
    name: { required },
    permission: { required },
  };
});
const v$ = useVuelidate(rules, formData);

const getRoleDetail = async () => {
  loading.value = true;
  await Http.get(`roles/${route.params.id}`).then((res) => {
    formData.name = res.data.data.role.name;
    formData.permission = res.data.data.role.permissions.map(
      (permission) => permission.id
    );
  });
  getPermissions();
};

const getPermissions = async () => {
  loading.value = true;
  await Http.get("permissions").then((res) => {
    permissions.value = res.data.data;
  });
  loading.value = false;
};

const checkAllPermissions = () => {
  if (selectAll.value) {
    for (const key in permissions.value) {
      if (Object.hasOwnProperty.call(permissions.value, key)) {
        permissions.value[key].map((element) => {
          formData.permission.push(element.id);
        });
      }
    }
  } else {
    formData.permission = [];
  }
};

const updateRole = async () => {
  let isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  loading.value = true;

  await Http.put(`roles/${route.params.id}`, formData)
    .then(() => {
      router.push({ name: "role-index" });
      createToast(
        {
          title: "Success",
          description: "Successfully Created Role!",
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
      serverErrors(err.response?.data.errors);
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  resetServerErrors();
  getRoleDetail();
});
</script>
