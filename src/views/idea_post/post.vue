<template>
    <div>
      <div class="card">
        <div class="card-body">
          <h4>Post Idea</h4>
          <form @submit.prevent="postIdea()">
            <div class="mb-3">
              <label for="userId" class="form-label" hidden>User ID</label>
              <input
                type="text"
                class="form-control"
                id="userId"
                v-model="form.userId"
                readonly hidden
              />
            </div>
            <div class="mb-3">
              <label for="title" class="form-label" required>Title</label>
              <input
                type="text"
                class="form-control"
                id="title"
                v-model="form.title"
                autofocus required
              />
            </div>
            <div class="mb-3">
              <label for="idea" class="form-label">Idea</label>
              <textarea
                class="form-control"
                id="idea"
                rows="3"
                v-model="form.ideacontent"
                autofocus required
                style="min-height:200px ; "
              ></textarea>
            </div>
            <div class="mb-3">
              <label class="form-label">Categories</label>
              
              <ul style="display:flex; flex-wrap:wrap; margin-right:10px;">
                <li  v-for="category in categories" :key="category.id" style="list-style-type: none; padding: 20px;">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :id="'category-' + category.id" 
                    :value="category.id" 
                    v-model="selectedCategories"
                    style="display:inline-block; margin-right:10px;"
                  />
                  <label class="form-check-label" :for="'category-' + category.id">
                    {{ category.name }}
                  </label>
                </li>
              </ul>
            </div>
          
            <div class="mb-3">
              <label for="closure" class="form-label">Closure</label>
              <select
                class="form-select"
                id="closure"
                aria-label="Select Closure"
                v-model="form.closure_id"
              >
                <option value="" selected>Choose Closure</option>
                <option
                  v-for="closure in closures"
                  :key="closure.id"
                  :value="closure.id"
                >
                  {{ closure.name }}
                </option>
              </select>
            </div>

            
            <div class="form-check mb-3">
  <input
    class="form-check-input"
    type="checkbox"
    id="terms"
    v-model="form.agreeTerms"
  />
  <label class="form-check-label" for="terms">
    I agree to the 
    <router-link
          :to="{ name: 'term_and_condition' }"
         
        >
        term and condition
        </router-link>
      </label>
 
</div>


            <button type="submit" class="btn btn-primary" style="background-color: #5d1010; width: 300px; border-radius: 10px; text-align: center;">Post</button>

           

          </form>
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
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();
const getUserID = computed(() => authStore.getUserId);

import {
    serverErrors,
    errorFor,
    resetServerErrors,
  } from "@/composables/validationErrors";
  const router = useRouter();

  const categories = ref([]);
  const form = ref({
    userId: getUserID,
    ideacontent: "",
    category_ids: "",
    closure_id: "",
    file: null,
    comment: "",
  });
  
  onMounted(async () => {
    // const response = await Http.get("/api/ideas");
    // ideas.value = response.data;
    getCategory();
    getClosure();
  });
  const getCategory = async () => {
     try {
    const response = await Http.get("categories");
    console.log("res",response);
    categories.value=response.data.data.data;
    
   
  } catch (error) {
    console.error("Failed to fetch categories", error);
  }
  };
 
  const getClosure = async () => {
     try {
    const response = await Http.get("closures");
    console.log("res",response);
    closures.value=response.data.data.data;
    
   
  } catch (error) {
    console.error("Failed to fetch closures", error);
  }
  };
  const postIdea = async () => {
    let isFormCorrect = await v$.value.$validate();
    if (!isFormCorrect) return;
    loading.value = true;
    resetServerErrors();
    const fd = new FormData();
    fd.append("title", form.value.ideacontent);
    fd.append("category_id", form.value.category_id);
    fd.append("closure_id", form.value.closure_id);
    fd.append("file", form.value.file);
    fd.append("comment", form.value.comment);
  };
  
  const handleFileChange = (e) => {
    form.value.file = e.target.files[0];
  };

  </script>
  
  <style scoped>
  ul.list-group {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  ul.list-group > li {
    padding: 10px;
    border-bottom: 1px solid #ccc;
  }
  
  ul.list-group > li:last-child {
    border-bottom: none;
  }
  </style>