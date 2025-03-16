<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h4>Post Idea</h4>
        <form @submit.prevent="postIdea()">
          <div class="mb-3">
            <label for="userId" class="form-label" hidden>User ID</label>
            <input type="text" class="form-control" id="userId" v-model="form.userId" readonly hidden />
          </div>
          <div class="mb-3">
            <label for="title" class="form-label" required>Title</label>
            <input type="text" class="form-control" id="title" v-model="form.title" autofocus required />
          </div>
          <div class="mb-3">
            <label for="content" class="form-label">Idea Content</label>
            <textarea
              class="form-control content-textarea"
              id="content"
              rows="3"
              v-model="form.content"
              autofocus
              required
              spellcheck="true"
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Category <span class="text-danger">*</span></label>
            <p>
              Suggested Categories:
              <span v-if="categories.length > 0" class="suggested-category">
                {{ categories[categories.length - 1].name }}
              </span>
              <span v-if="categories.length > 1" class="suggested-category">
                {{ categories[categories.length - 2].name }}
              </span>
            </p>
            <v-select
              v-model="form.category_id"
              class="style-chooser"
              placeholder="Select category"
              label="name"
              :options="categories"
              :reduce="(category) => category.id"
              multiple
            ></v-select>
          </div>

          <!-- Document Upload with New Uiverse.io Button -->
          <div class="mb-3">
            <label class="form-label">Documents (Max 3, JPG/JPEG/PNG/PDF, 5MB each)</label>
            <label class="custum-file-upload" for="documentInput">
              <div class="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill=""
                  viewBox="0 0 24 24"
                >
                  <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
                  <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      fill=""
                      d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                    ></path>
                  </g>
                </svg>
              </div>
              <div class="text">
                <span>Add Documents and Photos</span>
              </div>
              <input
                type="file"
                id="documentInput"
                ref="documentInput"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                @change="handleDocumentChange"
                class="hidden-input"
              />
            </label>
            <ul v-if="selectedDocuments.length" class="mt-3 document-list">
              <li v-for="(file, index) in selectedDocuments" :key="index">{{ file.name }} ({{ (file.size / 1024 / 1024).toFixed(2) }} MB)</li>
            </ul>
            <p v-if="documentError" class="text-danger error-message">{{ documentError }}</p>
          </div>

          <!-- Anonymous Switch -->
          <div class="mb-3">
            <label class="form-label">Post Anonymously</label>
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="isAnonymous"
                v-model="form.isAnonymous"
              />
              <label class="form-check-label" for="isAnonymous">
                {{ form.isAnonymous ? 'Post as Anonymous' : 'Post with Username' }}
              </label>
            </div>
          </div>

          <!-- Closure Information -->
          <div class="mb-3">
            <p v-if="closures.length > 0 && closures[0]">
              This closure is <span class="bold-text">{{ closures[0].name }}</span> and opened on
              <span class="bold-text">{{ closures[0].date }}</span> and will be closed on
              <span class="bold-text">{{ closures[0].final_date }}</span>. After submission, your idea will be reviewed by the QA manager and closed within
              <span class="bold-text">{{ Math.ceil(Math.abs(new Date(closures[0]?.final_date) - new Date(closures[0]?.date)) / (1000 * 60 * 60 * 24)) }} days</span>.
            </p>
          </div>

          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" id="terms" v-model="form.agreeTerms" required />
            <label class="form-check-label" for="terms">
              I agree to the <router-link :to="{ name: 'term_and_condition' }">terms and conditions</router-link>
            </label>
          </div>

          <!-- Post Button -->
          <button
            class="cssbuttons-io-button"
            type="submit"
            :disabled="isBlocked"
            :title="isBlocked ? 'You are blocked and cannot react' : ''"
          >
            Post
            <div class="icon">
              <svg
                height="24"
                width="24"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { createToast } from "mosha-vue-toastify";
import { Http } from "@/services/http-common";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const getUserID = computed(() => authStore.getUserId);
const router = useRouter();

const isBlocked = ref(false);
const categories = ref([]);
const closures = ref([]);
const form = reactive({
  title: "",
  content: "",
  closure_id: "",
  userId: getUserID,
  category_id: [],
  isAnonymous: false,
  agreeTerms: false,
});

const documentInput = ref(null);
const selectedDocuments = ref([]);
const documentError = ref("");
const exportBtnLoading = ref(false);
const serverOptions = ref({ sortBy: "default" });
const searchValue = ref("");

const handleDocumentChange = (event) => {
  const files = Array.from(event.target.files);
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
  const maxSize = 5 * 1024 * 1024;

  documentError.value = "";

  if (files.length > 3) {
    documentError.value = "Maximum of 3 documents allowed.";
    return;
  }

  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      documentError.value = "Only JPG, JPEG, PNG, and PDF files are allowed.";
      return;
    }
    if (file.size > maxSize) {
      documentError.value = "Each file must be less than 5MB.";
      return;
    }
  }

  selectedDocuments.value = files;
  console.log("Selected documents:", selectedDocuments.value);
};

const fetchUserDetails = async () => {
  try {
    const response = await Http.get(`/auth-user`);
    console.log("user", response);
    isBlocked.value = response.data.data.is_blocked || false;
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    createToast(
      { title: "Error", description: "Could not verify user status." },
      { type: "danger", transition: "bounce", position: "top-right", showIcon: true }
    );
  }
};

onMounted(async () => {
  await getAllCategory();
  await getClosure();
  await fetchUserDetails();
});

const getAllCategory = async () => {
  try {
    const response = await Http.get("/get-all-categories");
    console.log("cate", response);
    categories.value = response.data.data;
    console.log("cate", categories.value);
  } catch (error) {
    console.error("Failed to fetch categories", error);
  }
};

const getClosure = async () => {
  try {
    const response = await Http.get("closures");
    closures.value = response.data.data.data;
    console.log("closure", closures.value);
  } catch (error) {
    console.error("Failed to fetch closures", error);
  }
};

const postIdea = async () => {
  if (isBlocked.value) {
    createToast(
      { title: "Blocked", description: "You are blocked and cannot post ideas. Contact your administrator." },
      { type: "danger", transition: "bounce", position: "top-right", showIcon: true }
    );
    return;
  }
  if (!form.agreeTerms) {
    createToast(
      { title: "Error", description: "You must agree to the terms and conditions." },
      { type: "danger", transition: "bounce", position: "top-right", showIcon: true }
    );
    return;
  }

  if (form.category_id.length === 0) {
    createToast(
      { title: "Error", description: "You must choose at least one category." },
      { type: "danger", transition: "bounce", position: "top-right", showIcon: true }
    );
    return;
  }

  if (documentError.value) {
    createToast(
      { title: "Error", description: documentError.value },
      { type: "danger", transition: "bounce", position: "top-right", showIcon: true }
    );
    return;
  }

  const fd = new FormData();
  fd.append("title", form.title);
  fd.append("content", form.content);
  if (closures.value.length > 0) {
    fd.append("closure_id", closures.value[0].id);
  } else {
    createToast(
      { title: "Error", description: "No closure available." },
      { type: "danger", transition: "bounce", position: "top-right", showIcon: true }
    );
    return;
  }
  fd.append("user_id", form.userId);
  fd.append("is_anonymous", form.isAnonymous ? 1 : 0);

  form.category_id.forEach(categoryId => {
    fd.append("categories[]", categoryId);
  });

  selectedDocuments.value.forEach((file, index) => {
    fd.append(`documents[${index}]`, file);
  });

  try {
    await Http.post("ideas", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    router.push({ name: "idea_post_idea" });
    createToast(
      { title: "Success", description: "Successfully Created Post!" },
      { type: "success", transition: "bounce", position: "top-right", showIcon: true }
    );
  } catch (error) {
    console.error("Failed to create post", error);
    createToast(
      { title: "Error", description: error.response?.data?.message || "Failed to post idea." },
      { type: "danger", transition: "bounce", position: "top-right", showIcon: true }
    );
  }
};
</script>

