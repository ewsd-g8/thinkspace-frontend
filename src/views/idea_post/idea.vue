<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4>Ideas</h4>
          <button class="btn btn-info" @click="toggleSummary">
            {{ showSummary ? "Hide Summary" : "Show Summary" }}
          </button>
        </div>

        <!-- Summary Section -->
        <div v-if="showSummary" class="summary-section mb-4 p-3 border rounded">
          <h5>Summary Dashboard</h5>
          <div class="row">
            <div class="col-md-6">
              <h6>Ideas per Category</h6>
              <ul class="list-group">
                <li v-for="(count, category) in ideasPerCategory" :key="category" class="list-group-item d-flex justify-content-between align-items-center">
                  {{ category }}
                  <span class="badge bg-primary rounded-pill">{{ count }}</span>
                </li>
              </ul>
            </div>
            <div class="col-md-6">
              <h6>Categories per Closure</h6>
              <ul class="list-group">
                <li v-for="(categories, closure) in categoriesPerClosure" :key="closure" class="list-group-item d-flex justify-content-between align-items-center">
                  {{ closure }}
                  <span class="badge bg-primary rounded-pill">{{ categories.length }}</span>
                </li>
              </ul>
            </div>
            <div class="col-md-6">
              <h6>Ideas per Department</h6>
              <ul class="list-group">
                <li v-for="(count, department) in ideasPerDepartment" :key="department" class="list-group-item d-flex justify-content-between align-items-center">
                  {{ department }}
                  <span class="badge bg-primary rounded-pill">{{ count }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Search and Content Length Filters -->
        <div class="mb-3 d-flex justify-content-between flex-wrap">
          <div style="flex: 4; margin-right: 10px; min-width: 200px">
            <input
              type="text"
              class="form-control"
              placeholder="Search by title"
              v-model="searchQuery"
              @input="debouncedFilterIdeas"
            />
          </div>
          <div style="flex: 1; margin: 0 10px; min-width: 200px">
            <select
              class="form-control form-control-sm content-length-filter"
              v-model="selectedContentLength"
              @change="filterIdeas"
            >
              <option value="">All Lengths</option>
              <option value="short">Short (< 100 chars)</option>
              <option value="medium">Medium (100-400 chars)</option>
              <option value="long">Long (> 400 chars)</option>
            </select>
          </div>
        </div>

        <!-- Filters Container -->
        <div class="mb-3 d-flex justify-content-between flex-wrap">
          <div style="flex: 1; margin-right: 10px; min-width: 200px">
            <select
              class="form-control"
              v-model="selectedCategory"
              @change="filterIdeas"
            >
              <option value="">All Categories</option>
              <option v-for="category in uniqueCategories" :key="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div style="flex: 1; margin: 0 10px; min-width: 200px">
            <select
              class="form-control"
              v-model="selectedDepartment"
              @change="filterIdeas"
            >
              <option value="">All Departments</option>
              <option
                v-for="department in uniqueDepartments"
                :key="department.id"
                :value="department.name"
              >
                {{ department.name }}
              </option>
            </select>
          </div>
          <div style="flex: 1; margin: 0 10px; min-width: 200px">
            <select
              class="form-control"
              v-model="selectedClosure"
              @change="filterIdeas"
            >
              <option value="">All Closures</option>
              <option
                v-for="closure in uniqueClosures"
                :key="closure.id"
                :value="closure.name"
              >
                {{ closure.name }}
              </option>
            </select>
          </div>
          <div style="flex: 1; margin-left: 10px; min-width: 200px">
            <select
              class="form-control"
              v-model="sortOption"
              @change="sortIdeas"
            >
              <option value="newest">Newest to Oldest</option>
              <option value="oldest">Oldest to Newest</option>
              <option value="mostLikes">Most Likes</option>
              <option value="mostDislikes">Most Dislikes</option>
            </select>
          </div>
        </div>

        <!-- Loading Animation -->
        <div v-if="loading" class="text-center my-5">
          <div
            class="spinner-border"
            role="status"
            style="width: 3rem; height: 3rem"
          >
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Loading ideas...</p>
        </div>

        <!-- Ideas List -->
        <ul v-else class="list-group">
          <li
            class="list-group-item"
          
            v-for="idea in filteredIdeas"
            :key="idea.id"
            style="
              box-shadow: 3px 6px 14px 1px rgba(0, 0, 0, 0.49);
              margin-bottom: 20px;
            "
          >
            <div style="display: inline-block">
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <i
                  class="mdi mdi-account-circle rounded-circle"
                  style="font-size: 40px"
                ></i>
                <span style="font-weight: bold; margin-left: 5px"
                  >Anonymous Participant</span
                >
              </div>
            </div>
            <div class="d-flex justify-content-between">
              <div>
                <p class="text-muted">
                  <span
                    style="
                      background-color: #e5e5e5;
                      border: 1px solid #ccc;
                      border-radius: 5px;
                      padding: 5px;
                      margin-right: 5px;
                    "
                  >
                    {{
                      idea.categories && idea.categories.length
                        ? `Tagged Categories: ${idea.categories
                            .map((cat) => cat.name)
                            .join(", ")}`
                        : "No categories"
                    }}
                  </span>
                  - -
                  <span style="font-weight: bold">{{
                    idea.closure_id ? ` ${idea.closure.name}` : "No closure ID"
                  }}</span>
                </p>
                <h5 style="font-weight: bold; font-size: 20px">
                  {{ idea.title }}
                </h5>
                <div style="font-size: 15px">
                  <p class="content-preview">
                    {{ truncateContent(idea.content) }}
                    <span
                      v-if="idea.content.length > 1000"
                      class="see-more"
                    >
                      <router-link
                        :to="{
                          name: 'idea_details',
                          params: { id: idea.id },
                        }"
                        @click.stop
                        >...see more</router-link
                      >
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <hr />
           
           
                <button class="btn btn-sm" @click="thumbUp(idea)" :disabled="idea.has_thumbs_up">
    <i class="mdi mdi-thumb-up"></i>
    <span class="ml-1" style="font-weight: bold; padding-right: 5px">{{ idea.likes }}</span>
    <span>{{ idea.likes ? "Liked" : "Like" }}</span>
  </button>
  <button class="btn btn-sm" @click="thumbDown(idea)" :disabled="idea.has_thumbs_down">
    <i class="mdi mdi-thumb-down"></i>
    <span class="ml-1" style="font-weight: bold; padding-right: 5px">{{ idea.unlikes }}</span>
    <span>{{ idea.unlikes? "Disliked" : "Unlike" }}</span>
  </button>

 
              <button
                class="btn btn-sm"
                @click="
                  () =>
                    $router
                      .push({ name: 'idea_details', params: { id: idea.id } })
                      .catch((err) => console.error(err))
                "
              >
                <i class="mdi mdi-comment"></i>
              </button>
         
          </li>
        </ul>

        <!-- Pagination Controls -->
        <div v-if="!loading" class="d-flex justify-content-between mt-3">
          <button
            class="btn btn-primary"
            @click="previousPage"
            :disabled="currentPage === 1"
          >
            Previous
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            class="btn btn-primary"
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { Http } from "@/services/http-common";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.js";

// Custom debounce function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const ideas = ref([]);
const searchQuery = ref("");
const departments = ref([]);
const selectedCategory = ref("");
const selectedDepartment = ref("");
const selectedClosure = ref("");
const selectedContentLength = ref("");
const sortOption = ref("newest");
const currentPage = ref(1);
const itemsPerPage = 5;
const totalIdeas = ref(0);
const loading = ref(true);
const showSummary = ref(false);
const store = useAuthStore();
const user_id = store.getAuthUser.id;
const router = useRouter();

// Store original ideas for client-side filtering
const originalIdeas = ref([]);

const uniqueCategories = computed(() => {
  const categories = ideas.value
    .map((idea) => (idea.categories ? idea.categories.map((cat) => cat.name) : []))
    .flat();
  return [...new Set(categories)];
});

const uniqueDepartments = computed(() => {
  const validDepartments = departments.value
    .filter((d) => d.name && d.name !== "[department]")
    .map((d) => ({ id: d.id, name: d.name }));
  return validDepartments.length > 0 ? validDepartments : [{ name: "Unknown" }];
});

const uniqueClosures = computed(() => {
  const closures = ideas.value
    .filter((idea) => idea.closure)
    .map((idea) => ({
      id: idea.closure_id,
      name: idea.closure.name,
      created_at: idea.closure.created_at || idea.created_at,
    }));
  return [...new Set(closures.map((c) => JSON.stringify(c)))].map((c) => JSON.parse(c));
});

const ideasPerCategory = computed(() => {
  const categoryCount = {};
  ideas.value.forEach((idea) => {
    if (idea.categories && idea.categories.length) {
      idea.categories.forEach((cat) => {
        categoryCount[cat.name] = (categoryCount[cat.name] || 0) + 1;
      });
    } else {
      categoryCount["No categories"] = (categoryCount["No categories"] || 0) + 1;
    }
  });
  return categoryCount;
});

const categoriesPerClosure = computed(() => {
  const closureCategories = {};
  ideas.value.forEach((idea) => {
    const closureName = idea.closure_id ? idea.closure.name : "No closure ID";
    if (!closureCategories[closureName]) closureCategories[closureName] = new Set();
    if (idea.categories && idea.categories.length) {
      idea.categories.forEach((cat) => closureCategories[closureName].add(cat.name));
    }
  });
  Object.keys(closureCategories).forEach((closure) => {
    closureCategories[closure] = Array.from(closureCategories[closure]);
  });
  return closureCategories;
});

const ideasPerDepartment = computed(() => {
  const departmentCount = {};
  departments.value.forEach((department) => {
    departmentCount[department.name] = 0;
  });
  ideas.value.forEach((idea) => {
    const departmentName =
      departments.value.find((d) => d.id === idea.user?.department_id)?.name || "Unknown";
    departmentCount[departmentName] = (departmentCount[departmentName] || 0) + 1;
  });
  return departmentCount;
});

const totalPages = computed(() => {
  return Math.ceil(totalIdeas.value / itemsPerPage);
});

// Client-side filtered ideas
const filteredIdeas = computed(() => {
  let filtered = [...originalIdeas.value];

  if (searchQuery.value) {
    filtered = filtered.filter((idea) =>
      idea.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (selectedCategory.value) {
    filtered = filtered.filter((idea) =>
      idea.categories && idea.categories.some((cat) => cat.name === selectedCategory.value)
    );
  }

  if (selectedDepartment.value) {
    filtered = filtered.filter((idea) =>
      departments.value.find((d) => d.id === idea.user?.department_id)?.name === selectedDepartment.value
    );
  }

  if (selectedClosure.value) {
    filtered = filtered.filter((idea) =>
      idea.closure && idea.closure.name === selectedClosure.value
    );
  }

  if (selectedContentLength.value) {
    filtered = filtered.filter((idea) => {
      const length = idea.content.length;
      return (
        (selectedContentLength.value === "short" && length < 100) ||
        (selectedContentLength.value === "medium" && length >= 100 && length <= 400) ||
        (selectedContentLength.value === "long" && length > 400)
      );
    });
  }

  if (sortOption.value === "newest") {
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortOption.value === "oldest") {
    filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else if (sortOption.value === "mostLikes") {
    filtered.sort((a, b) => b.thumbs_up_count.likes - a.thumbs_up_count.likes);
  } else if (sortOption.value === "mostDislikes") {
    filtered.sort((a, b) => b.thumbs_up_count.unlikes - a.thumbs_up_count.unlikes);
  }

  return filtered;
});

const fetchIdeas = async (page = currentPage.value) => {
  loading.value = true;
  try {
    const url = `ideas?page=${page}&paginate=${itemsPerPage}&search=${encodeURIComponent(
      searchQuery.value
    )}&category=${encodeURIComponent(selectedCategory.value)}&department=${encodeURIComponent(
      selectedDepartment.value
    )}&closure=${encodeURIComponent(selectedClosure.value)}&contentLength=${encodeURIComponent(
      selectedContentLength.value
    )}&sort=${encodeURIComponent(sortOption.value)}`;
        console.log("url",url)
    console.log("Fetching ideas with URL:", url);
    const { data } = await Http.get(url);
    console.log("API response:", data);

    ideas.value = data.data.data || [];
    originalIdeas.value = [...ideas.value];
    totalIdeas.value = data.data.total || 0;

    const newestClosure = uniqueClosures.value.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )[0];
    if (newestClosure && !selectedClosure.value) {
      selectedClosure.value = newestClosure.name;
    }
  } catch (error) {
    console.error("Failed to load ideas:", error);
    ideas.value = [];
    originalIdeas.value = [];
    totalIdeas.value = 0;
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
   
    await getDepartments();
    await fetchIdeas(1);
    
  } catch (error) {
    console.error("Failed to initialize:", error);
  }
});

const debouncedFilterIdeas = debounce(() => {
  filterIdeas();
}, 500);

const filterIdeas = () => {
  // Client-side filtering only; no fetchIdeas call
};

const sortIdeas = () => {
  // Client-side sorting only; no fetchIdeas call
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchIdeas(currentPage.value);
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchIdeas(currentPage.value);
  }
};

const thumbUp = async (idea) => {
  const index = ideas.value.findIndex(i => i.id === idea.id);
  if (index === -1) return;

  // Optimistically update UI
  const originalIdea = { ...ideas.value[index] };
  ideas.value = [
    ...ideas.value.slice(0, index),
    {
      ...ideas.value[index],
      has_thumbs_up: true,
      has_thumbs_down: false,
      
    },
    ...ideas.value.slice(index + 1),
  ];
console.log("orgi",originalIdea)
  try {
    const response = await Http.post(`reactions`, {
      user_id: user_id,
      idea_id: idea.id,
      type: true,
    });

    const { data } = response;
    // Check for "Reaction set" instead of "success"
    if (data.message !== "Reaction set") {
      // Rollback on failure
      ideas.value = [
        ...ideas.value.slice(0, index),
        originalIdea,
        ...ideas.value.slice(index + 1),
      ];
      console.error("Thumb up failed:", data);
    }
  } catch (error) {
    // Rollback on error
    ideas.value = [
      ...ideas.value.slice(0, index),
      originalIdea,
      ...ideas.value.slice(index + 1),
    ];
    console.error("Error in thumbUp:", error);
  }
};

const thumbDown = async (idea) => {
  const index = ideas.value.findIndex(i => i.id === idea.id);
  if (index === -1) return;

  // Optimistically update UI
  const originalIdea = { ...ideas.value[index] };
  ideas.value = [
    ...ideas.value.slice(0, index),
    {
      ...ideas.value[index],
      has_thumbs_up: false,
      has_thumbs_down: true,
     
    },
    ...ideas.value.slice(index + 1),
  ];

  try {
    const response = await Http.post(`reactions`, {
      user_id: user_id,
      idea_id: idea.id,
      type: false,
    });

    const { data } = response;
    // Check for "Reaction set" instead of "success"
    if (data.message !== "Reaction set") {
      // Rollback on failure
      ideas.value = [
        ...ideas.value.slice(0, index),
        originalIdea,
        ...ideas.value.slice(index + 1),
      ];
      console.error("Thumb down failed:", data);
    }
  } catch (error) {
    // Rollback on error
    ideas.value = [
      ...ideas.value.slice(0, index),
      originalIdea,
      ...ideas.value.slice(index + 1),
    ];
    console.error("Error in thumbDown:", error);
  }
};

const getDepartments = async () => {
  try {
    const res = await Http.get("get-all-departments");
    console.log("Departments:", res.data);
    departments.value = res.data.data;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
  }
};

const toggleSummary = () => {
  showSummary.value = !showSummary.value;
};

const truncateContent = (content) => {
  const maxLength = 400;
  if (!content || typeof content !== "string") return "";
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + "...";
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

@media (max-width: 768px) {
  .d-flex.flex-wrap {
    flex-direction: column;
  }
  .d-flex.flex-wrap > div {
    margin: 0 0 10px 0 !important;
    width: 100%;
  }
}

.spinner-border {
  color: #5d1010;
}

.content-preview {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  line-height: 1.5;
}

.see-more {
  font-size: 14px;
  color: #007bff;
}

.see-more a {
  text-decoration: none;
  color: inherit;
}

.see-more a:hover {
  text-decoration: underline;
}

.content-length-filter {
  width: 150px;
  height: 30px;
  font-size: 14px;
  padding: 0 5px;
}

.summary-section {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
}

.summary-section .list-group-item {
  padding: 8px 12px;
}

.summary-section .badge {
  font-size: 12px;
}
</style>