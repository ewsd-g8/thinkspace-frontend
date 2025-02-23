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
              readonly
              hidden
            />
          </div>
          <div class="mb-3">
            <label for="title" class="form-label" required>Title</label>
            <input
              type="text"
              class="form-control"
              id="title"
              v-model="form.title"
              autofocus
              required
            />
          </div>
          <div class="mb-3">
            <label for="content" class="form-label">Idea Content</label>
            <textarea
              class="form-control"
              id="content"
              rows="3"
              v-model="form.content"
              autofocus
              required
              style="min-height: 200px"
            ></textarea>
          </div>
          <div class="mb-3">
            <label for="categories" class="form-label">Categories</label>
            <ul class="category-list" style="display: flex; flex-wrap: wrap;">
              <li
                v-for="category in categories"
                :key="category.id"
                class="category-item" style="list-style-type: none; padding: 20px;"
              >
                <input
                  type="checkbox"
                  :id="'category-' + category.id"
                  :value="category.id"
                  v-model="form.category_id"
                  style="display: inline-block; margin-right: 10px"
                />
                <label
                  :for="'category-' + category.id"
                >
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
              <option value="" class="style-checkbox" selected>
                Choose Closure
              </option>
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
              <router-link :to="{ name: 'term_and_condition' }">
                term and condition
              </router-link>
            </label>
          </div>
          <button
            type="submit"
            class="btn btn-primary"
            style="
              background-color: #5d1010;
              width: 300px;
              border-radius: 10px;
              text-align: center;
            "
          >
            Post
          </button>
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
import { Http } from "@/services/http-common";
import { useAuthStore } from "@/stores/auth";
import {
  serverErrors,
  errorFor,
  resetServerErrors,
} from "@/composables/validationErrors";

const authStore = useAuthStore();
const getUserID = computed(() => authStore.getUserId);
const router = useRouter();

const categories = ref([]);
const closures = ref([]);
const form = reactive({

  title: "",

  // the content of the idea
  content: "",

  // the ID of the closure that the idea belongs to
  closure_id: "",
  userId: getUserID,
  // the categories that the idea belongs to
 

  category_id: [],

 
});


onMounted(async () => {
  getCategory();
  getClosure();

});

const getCategory = async () => {
  try {
    const response = await Http.get("categories");
    categories.value = response.data.data.data;
  } catch (error) {
    console.error("Failed to fetch categories", error);
  }
};

const getClosure = async () => {
  try {
    const response = await Http.get("closures");
    closures.value = response.data.data.data;
  } catch (error) {
    console.error("Failed to fetch closures", error);
  }
};

const v$ = useVuelidate();

const postIdea = async () => {
  let isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;

  resetServerErrors();
  const fd = new FormData();

  fd.append("title", form.title);
  fd.append("content", form.content);
  fd.append("closure_id", form.closure_id);
  fd.append("user_id", form.userId);
  fd.append("categories", form.category_id);
  form.category_id.forEach((category_id) => {
    fd.append("categories[]", category_id);
  });

  console.log(form);
  console.log("category_id", form.category_id);
  if (form.category_id.length === 0) {
    return createToast(
      {
        title: "Error",
        description: "You must choose at least one category",
      },
      {
        type: "danger",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
  }
  try {
    await Http.post("ideas", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    router.push({ name: "category-index" });
    createToast(
      {
        title: "Success",
        description: "Successfully Created Post!",
      },
      {
        type: "success",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
  } catch (error) {
    serverErrors(error.response?.data.errors);
    console.error("Failed to create post", error);
  }
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
