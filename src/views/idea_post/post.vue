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
              spellcheck="true"
            ></textarea>
           
          
          </div>
         
          <div class="mb-3">
            <label class="form-label"
              >Category <span class="text-danger">*</span></label>
           <p >
             Suggested Categories : 
             <span v-if="categories.length > 0" style="background-color: #fff; border: 1px solid #ccc; border-radius: 5px; padding: 5px; margin-right: 5px">{{ categories[categories.length - 1].name }}</span>
             <span v-if="categories.length > 1" style="background-color: #fff; border: 1px solid #ccc; border-radius: 5px; padding: 5px; margin-right: 5px">{{ categories[categories.length - 2].name }}</span>
             <span v-if="categories.length > 2" style="background-color: #fff; border: 1px solid #ccc; border-radius: 5px; padding: 5px; margin-right: 5px">{{ categories[categories.length - 5].name }}</span>
           </p>
            
            <v-select
              v-model="form.category_id"
              class="style-chooser"
              placeholder="Select category"
              label="name"
              :options="categories"
              :reduce="(category) => category.id"
              multiple
              :class="{
                'vuelidate-invalid': v$?.categories?.$error || errorFor('categories'),
              }"
            ></v-select>
            <v-errors
              :serverErrors="errorFor('categories')"
              :vuelidateErrors="{
                errors: v$?.categories?.$errors,
                value: 'Category',
              }"
            ></v-errors>
          </div>
          <!-- <div class="mb-3">
            <label for="categories" class="form-label">Categories</label>
            <ul class="category-list" style="display: flex; flex-wrap: wrap">
              <li
                v-for="category in categories"
                :key="category.id"
                class="category-item"
                style="list-style-type: none; padding: 20px"
              >
                <input
                  type="checkbox"
                  :id="'category-' + category.id"
                  :value="category.id"
                  v-model="form.category_id"
                  style="display: inline-block; margin-right: 10px"
                />
                <label :for="'category-' + category.id">
                  {{ category.name }}
                </label>
              </li>
            </ul>
          </div> -->

          <div class="mb-3">
            
            <p>
              
               This closure  is <span v-if="closures.length > 0 && closures[0]" style="font-weight: bold;">{{ closures[0].name }}</span> and opened in <span v-if="closures.length > 0 && closures[0]" style="font-weight: bold;">{{ closures[0].date }}</span> and will be closed in <span v-if="closures.length > 0 && closures[0]" style="font-weight: bold;">{{ closures[0].final_date }}</span>. After submitted your idea , QA manager will review your idea and will be closed within <span style="font-weight: bold;">{{ Math.ceil(Math.abs(new Date(closures[0]?.final_date) - new Date(closures[0]?.date)) / (1000 * 60 * 60 * 24)) }} days</span>.
              
            </p>
            <button type="button" class="af button" @click="$refs.fileInput.click()">
            
           
            <input
              type="file"
              ref="fileInput"
              style="display: none"
              @change="handleFileChange"
            />
  <svg
    aria-hidden="true"
    stroke="currentColor"
    stroke-width="2"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      stroke-width="2"
      stroke="#fffffff"
      d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
      stroke-linejoin="round"
      stroke-linecap="round"
    ></path>
    <path
      stroke-linejoin="round"
      stroke-linecap="round"
      stroke-width="2"
      stroke="#fffffff"
      d="M17 15V18M17 21V18M17 18H14M17 18H20"
    ></path>
  </svg></input>
  ADD FILE
   </button>
   </div>
          <div >
            <div
            class="d-flex align-items-start align-items-sm-center gap-4 mb-3"
          >
            <img
              :src="imagePreview ? imagePreview : '/images/empty.png'"
              alt="user-profile"
              class="d-block rounded border"
              height="100"
              width="100"
              id="uploadedAvatar"
            />
            <div class="button-wrapper">
              <label
                for="upload"
                class="btn btn-success me-2 mb-2"
                tabindex="0"
              >
                <span class="d-none d-sm-block text-dark">Add photo</span>
                <i class="bx bx-upload d-block d-sm-none"></i>
                <input
                  type="file"
                  id="upload"
                  name="profile"
                  multiple
                  class="account-file-input"
                  hidden
                  accept="image/png, image/jpeg"
                  @change="handleFileChange"
                />
              </label>
              <button
                type="button"
                @click="resetFile"
                class="btn btn-outline-secondary account-image-reset mb-2"
              >
                Reset
              </button>
              <!-- <p class="text-muted mb-2">
                Allowed JPG, GIF or PNG. Max size of 800K
              </p> -->
              <!-- <v-errors
                :serverErrors="errorFor('profile')"
                :vuelidateErrors="{
                  errors: v$.profile.$errors,
                  value: 'Profile',
                }"
              ></v-errors> -->
            </div>
          </div>
          </div>
          <div class="form-check mb-3">
            <input
              class="form-check-input"
              type="checkbox"
              id="terms"
              v-model="form.agreeTerms"
              required
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
  if (closures.value.length > 0) {
    fd.append("closure_id", closures.value[0].id);
   
  } else {
    createToast(
      {
        title: "Error",
        description: "No closure available",
      },
      {
        type: "danger",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
    return;
  }
  
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
.af  {
  border: none;
  display: flex;
  padding: 0.75rem 1.5rem;
  background-color: #f4e9c3;
  color: #ffffff;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  text-transform: uppercase;
  vertical-align: middle;
  align-items: center;
  border-radius: 0.5rem;
  user-select: none;
  gap: 0.75rem;
  box-shadow:
    0 4px 6px -1px #488aec31,
    0 2px 4px -1px #488aec17;
  transition: all 0.6s ease;
}

.af :hover {
  box-shadow:
    0 10px 15px -3px #488aec4f,
    0 4px 6px -2px #488aec17;
}

.af :focus,
.af :active {
  opacity: 0.85;
  box-shadow: none;
}

.af  svg {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
