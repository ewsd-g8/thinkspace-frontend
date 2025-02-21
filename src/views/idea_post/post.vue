<template>
    <div>
      <div class="card">
        <div class="card-body">
          <h4>Post Idea</h4>
          <form @submit.prevent="postIdea">
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
              <label for="category" class="form-label">Category</label>
              <select
                class="form-select"
                id="category"
                aria-label="Select Category"
                v-model="form.category_id"
              >
                <option value="" selected>Choose Category</option>
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label for="file" class="form-label">File</label>
              <input
                class="form-control"
                type="file"
                id="file"
                @change="handleFileChange"
              />
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
import {
    serverErrors,
    errorFor,
    resetServerErrors,
  } from "@/composables/validationErrors";
  const router = useRouter();

  const categories = ref([]);
  const form = ref({
    idea: "",
    category_id: "",
    file: null,
    comment: "",
  });
  
  onMounted(async () => {
    // const response = await Http.get("/api/ideas");
    // ideas.value = response.data;
    getCategory();
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
 
  const postIdea = async () => {
    const formData = new FormData();
    formData.append("idea", form.ideacontent);
    formData.append("category_id", form.value.category_id);
    form.value.idea = "";
    form.value.category_id = "";
    form.value.file = null;
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