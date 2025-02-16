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
                v-model="form.idea"
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

            <button type="submit" class="btn btn-primary">Post</button>
          </form>
        </div>
      </div>
      
    </div>
  </template>
<script setup>
import { ref, onMounted } from "vue";
import { Http } from "@/services/http-common";
const ideas = ref([]);
  const categories = ref([]);
  const form = ref({
    idea: "",
    category_id: "",
    file: null,
    comment: "",
  });
  
  onMounted(async () => {
    const response = await Http.get("/api/ideas");
    ideas.value = response.data;
    const responseCat = await Http.get("/api/categories");
    categories.value = responseCat.data;
  });
  
  const postIdea = async () => {
    const formData = new FormData();
    formData.append("idea", form.value.idea);
    formData.append("category_id", form.value.category_id);
    if (form.value.file) formData.append("file", form.value.file);
    const response = await Http.post("/api/ideas", formData);
    ideas.value.push(response.data);
    form.value.idea = "";
    form.value.category_id = "";
    form.value.file = null;
  };
  
  const handleFileChange = (e) => {
    form.value.file = e.target.files[0];
  };
  
  const thumbUp = async (idea) => {
    const response = await Http.post(`/api/ideas/${idea.id}/thumb-up`);
    idea.has_thumbs_up = true;
    idea.thumbs_up_count = response.data.thumbs_up_count;
  };
  
  const thumbDown = async (idea) => {
    const response = await Http.post(`/api/ideas/${idea.id}/thumb-down`);
    idea.has_thumbs_down = true;
    idea.thumbs_down_count = response.data.thumbs_down_count;
  };
  
  const openComments = (idea) => {
    idea.showComments = !idea.showComments;
  };
  
  const postComment = async (idea) => {
    const response = await Http.post(
      `/api/ideas/${idea.id}/comments`,
      idea.comments
    );
    idea.comments.push(response.data);
    form.value.comment = "";
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