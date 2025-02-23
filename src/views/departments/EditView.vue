<template>
    <div>
      <div class="row px-1">
        <div class="col-12">
          <div class="page-title-box">
            <div class="page-title-right">
              <ol class="breadcrumb m-0">
                <li class="breadcrumb-item">
                  
                </li>
  
                <li class="breadcrumb-item active">
                  <router-link :to="{ name: 'department-index' }">Department</router-link>
                </li>
  
                <li class="breadcrumb-item active">Edit</li>
              </ol>
            </div>
            <h4 class="page-title">Department Edit</h4>
          </div>
        </div>
      </div>
      <div class="card position-relative">
        <!-- Account -->
        <div class="card-body">
          <div v-if="loading" style="height: 50vh">
            <Loading></Loading>
          </div>

          <!-- edit -->
          <template v-else>
            <div class="row">
              <div class="mb-3 col-md-6">
                <label for="name" class="form-label"
                  >Department Name <span class="text-danger">*</span></label
                >
                <input
                  class="form-control"
                  type="text"
                  id="name"
                  autofocus
                  placeholder="Enter Category Name"
                  v-model="departments.name"
                  :class="{
                    'is-invalid': v$?.name?.$error || errorFor('name'),
                  }"
                />
                <v-errors
                  :serverErrors="errorFor('name')"
                  :vuelidateErrors="{
                    errors: v$?.name?.$errors,
                    value: 'name',
                  }"
                ></v-errors>
              </div>
              <div class="mb-3 col-md-6">
                <label for="description" class="form-label"
                  >Department Description <span class="text-danger">*</span></label
                >
                <input
                  class="form-control"
                  type="text"
                  id="description"
                  autofocus
                  placeholder="Enter Department Description"
                  v-model="departments.description"
                  :class="{
                    'is-invalid': v$?.description?.$error || errorFor('description'),
                  }"
                />
                <v-errors
                  :serverErrors="errorFor('description')"
                  :vuelidateErrors="{
                    errors: v$?.description?.$errors,
                    value: 'description',
                  }"
                ></v-errors>
              </div>
             
            </div>
            <div class="mt-2">
              <button
                @click="updatedepartment()"
                class="btn btn-success loading-button me-2 loading-button"
              >
                Update
              </button>
  
              <router-link
                :to="{ name: 'department-index' }"
                class="btn btn-outline-secondary"
                >Cancel</router-link
              >
            </div>
          </template>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { ref, reactive, onMounted, computed } from "vue";
  import { useVuelidate } from "@vuelidate/core";
  import { useRouter, useRoute } from "vue-router";
  import { createToast } from "mosha-vue-toastify";
  import Skeleton from "@/components/shared/Skeleton.vue";
  import { required, email, helpers } from "@vuelidate/validators";
  import { Http } from "@/services/http-common";
  import { getAuthUser } from "@/composables/getAuthUser";
  import {
    serverErrors,
    errorFor,
    resetServerErrors,
  } from "@/composables/validationErrors";
  
  const loading = ref(false);
  const router = useRouter();
  const route = useRoute();

  
  const departments = reactive({
    id: "",
    name: "",
    description: "",
   
  });
  
  

  
  const getDepartmentDetail = async () => {
    loading.value = true;
    await Http.get(`departments/${route.params.id}`)
      .then((res) => {
        console.log("res", res);
        departments.id = res.data.data.id;
        departments.name = res.data.data.name;
        departments.description = res.data.data.description;
        loading.value=false;
      })
      .catch((err) => {
        if (err.response.status == 404) {
          router.push({ name: "page-not-found" });
        }
      });
  
   
  };
  
  
 
  const v$ = useVuelidate( departments);
  
  const updatedepartment = async () => {
    let isFormCorrect = await v$.value.$validate();
    if (!isFormCorrect) return;
    loading.value = true;
  
    resetServerErrors();
  
    const fd = new FormData();
    fd.append("name", departments.name);
    fd.append("description", departments.description);
    
  
    await Http.post(`departments/${route.params.id}?_method=PUT`, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => {
        
        router.push({ name: "department-index" });
        createToast(
          {
            title: "Success",
            description: "Successfully Updated Department!",
          },
          {
            type: "success",
            transition: "bounce",
            position: "top-right",
            showIcon: true,
          }
        );
      })
      .catch((error) => {
        serverErrors(error.response?.data.errors);
      })
      .finally(() => {
        getAuthUser();
        loading.value = false;
      });
  };
  onMounted(() => {
    resetServerErrors();
    getDepartmentDetail();
  });
  </script>