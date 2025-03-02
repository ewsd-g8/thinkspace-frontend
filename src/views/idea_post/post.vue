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
            <label class="form-label">Category <span class="text-danger">*</span></label>
            <p>
              Suggested Categories:
              <span v-if="categories.length > 0" style="background-color: #fff; border: 1px solid #ccc; border-radius: 5px; padding: 5px; margin-right: 5px">
                {{ categories[categories.length - 1].name }}
              </span>
              <span v-if="categories.length > 1" style="background-color: #fff; border: 1px solid #ccc; border-radius: 5px; padding: 5px; margin-right: 5px">
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

          <!-- Document Upload -->
          <div class="mb-3">
            <label class="form-label">Documents (Max 3, JPG/JPEG/PNG/PDF, 5MB each)</label>
            <input
              type="file"
              ref="documentInput"
              style="display: none"
              multiple
              accept=".jpg,.jpeg,.png,.pdf"
              @change="handleDocumentChange"
            />
            <button type="button" class="btn btn-primary" @click="triggerDocumentInput">
              <svg
                aria-hidden="true"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="icon"
              >
                <path
                  stroke-width="2"
                  stroke="#ffffff"
                  d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                ></path>
                <path
                  stroke-linejoin="round"
                  stroke-linecap="round"
                  stroke-width="2"
                  stroke="#ffffff"
                  d="M17 15V18M17 21V18M17 18H14M17 18H20"
                ></path>
              </svg>
              Add Documents and photos
            </button>
            <ul v-if="selectedDocuments.length" class="mt-3">
              <li v-for="(file, index) in selectedDocuments" :key="index">{{ file.name }} ({{ (file.size / 1024 / 1024).toFixed(2) }} MB)</li>
            </ul>
            <p v-if="documentError" class="text-danger">{{ documentError }}</p>
          </div>

        
          

          <!-- Closure Information -->
          <div class="mb-3">
            <p v-if="closures.length > 0 && closures[0]">
              This closure is <span style="font-weight: bold;">{{ closures[0].name }}</span> and opened on
              <span style="font-weight: bold;">{{ closures[0].date }}</span> and will be closed on
              <span style="font-weight: bold;">{{ closures[0].final_date }}</span>. After submission, your idea will be reviewed by the QA manager and closed within
              <span style="font-weight: bold;">{{ Math.ceil(Math.abs(new Date(closures[0]?.final_date) - new Date(closures[0]?.date)) / (1000 * 60 * 60 * 24)) }} days</span>.
            </p>
          </div>

          <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" id="terms" v-model="form.agreeTerms" required />
            <label class="form-check-label" for="terms">
              I agree to the <router-link :to="{ name: 'term_and_condition' }">terms and conditions</router-link>
            </label>
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            style="background-color: #5d1010; width: 300px; border-radius: 10px; text-align: center;"
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
import { useRouter } from "vue-router";
import { createToast } from "mosha-vue-toastify";
import { Http } from "@/services/http-common";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const getUserID = computed(() => authStore.getUserId);
const router = useRouter();

const categories = ref([]);
const closures = ref([]);
const form = reactive({
  title: "",
  content: "",
  closure_id: "",
  userId: getUserID,
  category_id: [],
  agreeTerms: false,
});

const documentInput = ref(null);

const selectedDocuments = ref([]);

const documentError = ref("");

// Trigger document input
const triggerDocumentInput = () => {
  documentInput.value.click();
};



// Handle document selection with validation
const handleDocumentChange = (event) => {
  const files = Array.from(event.target.files);
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes

  // Reset error
  documentError.value = "";

  // Validate files
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


onMounted(async () => {
  await getCategory();
  await getClosure();
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

const postIdea = async () => {
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

  // Append categories as an array
  form.category_id.forEach(categoryId => {
    fd.append("categories[]", categoryId);
  });

  // Append documents as an array
  selectedDocuments.value.forEach((file, index) => {
    fd.append(`documents[${index}]`, file);
  });


  

  try {
    await Http.post("ideas", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    router.push({ name: "category-index" });
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
<style scoped>
.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  font-size: 16px;
}

.icon {
  width: 24px;
  height: 24px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  padding: 5px 0;
}

.text-danger {
  font-size: 14px;
  margin-top: 5px;
}
</style>