<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h4>Ideas</h4>
          <!-- Summary Button (visible only to managers) -->
          <button class="btn btn-info" @click="toggleSummary">
            {{ showSummary ? "Hide Summary" : "Show Summary" }}
          </button>
        </div>

        <!-- Summary Section (shown when toggled) -->
        <div v-if="showSummary" class="summary-section mb-4 p-3 border rounded">
          <h5>Summary Dashboard</h5>
          <div class="row">
            <!-- Ideas per Category -->
            <div class="col-md-6">
              <h6>Ideas per Category</h6>
              <ul class="list-group">
                <li
                  v-for="(count, category) in ideasPerCategory"
                  :key="category"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  {{ category }}
                  <span class="badge bg-primary rounded-pill">{{ count }}</span>
                </li>
              </ul>
            </div>
            <!-- Categories per Closure -->
            <div class="col-md-6">
              <h6>Categories per Closure</h6>
              <ul class="list-group">
                <li
                  v-for="(categories, closure) in categoriesPerClosure"
                  :key="closure"
                  class="list-group-item d-flex justify-content-between align-items-center"
                >
                  {{ closure }}
                  <span class="badge bg-primary rounded-pill">{{
                    categories.length
                  }}</span>
                </li>
              </ul>
            </div>
            <!-- Ideas by Selected User -->
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
              @input="filterIdeas"
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
          <!-- Category Filter -->
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

          <!-- Department Filter -->
          <div style="flex: 1; margin: 0 10px; min-width: 200px">
            <select
              class="form-control"
              v-model="selectedDepartment"
              @change="filterIdeas"
            >
              <option value="">All Departments</option>
              <option v-for="department in uniqueDepartments" :key="department">
                {{ department }}
              </option>
            </select>
          </div>

          <!-- Closure Filter -->
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

          <!-- Sorting Filter -->
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

        <!-- Ideas List (shown only when not loading) -->
        <ul v-else class="list-group">
          <li
            class="list-group-item"
            v-for="idea in paginatedIdeas"
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
                    <span v-if="idea.content.length > 1000" class="see-more">
                      <router-link
                        :to="{ name: 'idea_details', params: { id: idea.id } }"
                        @click.stop
                      >
                        ...see more
                      </router-link>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <hr />
            <div>
              <button class="btn btn-sm" @click="thumbUp(idea)">
                <span v-if="idea.has_thumbs_up">1</span>
                <i class="mdi mdi-thumb-up"></i>
              </button>

              <button
                class="btn btn-sm"
                @click="thumbUp(idea)"
                :disabled="idea.has_thumbs_up"
              >
                <i class="mdi mdi-thumb-up"></i>
                <span
                  class="ml-1"
                  style="font-weight: bold; padding-right: 5px"
                  >{{ idea.thumbs_up_count.likes }}</span
                >
                <span v-if="!idea.has_thumbs_up">Like</span>
                <span v-if="idea.has_thumbs_up">Liked</span>
              </button>
              <button
                class="btn btn-sm"
                @click="thumbDown(idea)"
                :disabled="idea.has_thumbs_down"
              >
                <i class="mdi mdi-thumb-down"></i>
                <span
                  class="ml-1"
                  style="font-weight: bold; padding-right: 5px"
                  >{{ idea.thumbs_up_count.unlikes }}</span
                >
                <span v-if="idea.has_thumbs_down">Dislike</span>
                <span v-if="!idea.has_thumbs_down">Unlike</span>
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
            </div>
          </li>
        </ul>

        <!-- Pagination Controls (shown only when not loading) -->
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

const ideas = ref([]);
const searchQuery = ref("");
const selectedCategory = ref("");
const selectedDepartment = ref("");
const selectedClosure = ref("");

const selectedContentLength = ref("");
const sortOption = ref("newest");
const currentPage = ref(1);
const itemsPerPage = 5;
const loading = ref(true);
const showSummary = ref(false); // Toggle for summary section
const store = useAuthStore();
const user_id = store.getAuthUser.id;
const router = useRouter();

// Assuming manager role is indicated in the auth store (adjust as per your setup)

const uniqueCategories = computed(() => {
  const categories = ideas.value
    .map((idea) =>
      idea.categories ? idea.categories.map((cat) => cat.name) : []
    )
    .flat();
  return [...new Set(categories)];
});

const uniqueDepartments = computed(() => {
  const departments = ideas.value.map((idea) => idea.department || "Unknown");
  return [...new Set(departments)];
});

const uniqueClosures = computed(() => {
  const closures = ideas.value
    .filter((idea) => idea.closure)
    .map((idea) => ({
      id: idea.closure_id,
      name: idea.closure.name,
      created_at: idea.closure.created_at || idea.created_at,
    }));
  return [...new Set(closures.map((c) => JSON.stringify(c)))].map((c) =>
    JSON.parse(c)
  );
});

// Compute ideas per category
const ideasPerCategory = computed(() => {
  const categoryCount = {};
  ideas.value.forEach((idea) => {
    if (idea.categories && idea.categories.length) {
      idea.categories.forEach((cat) => {
        categoryCount[cat.name] = (categoryCount[cat.name] || 0) + 1;
      });
    } else {
      categoryCount["No categories"] =
        (categoryCount["No categories"] || 0) + 1;
    }
  });
  return categoryCount;
});

// Compute categories per closure
const categoriesPerClosure = computed(() => {
  const closureCategories = {};
  ideas.value.forEach((idea) => {
    const closureName = idea.closure_id ? idea.closure.name : "No closure ID";
    if (!closureCategories[closureName]) {
      closureCategories[closureName] = new Set();
    }
    if (idea.categories && idea.categories.length) {
      idea.categories.forEach((cat) =>
        closureCategories[closureName].add(cat.name)
      );
    }
  });
  // Convert Sets to Arrays for display
  Object.keys(closureCategories).forEach((closure) => {
    closureCategories[closure] = Array.from(closureCategories[closure]);
  });
  return closureCategories;
});

const filteredIdeas = computed(() => {
  let result = ideas.value.filter((idea) => {
    const matchesTitle = idea.title
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesCategory =
      selectedCategory.value === "" ||
      (idea.categories &&
        idea.categories.some((cat) => cat.name === selectedCategory.value));
    const matchesDepartment =
      selectedDepartment.value === "" ||
      idea.department === selectedDepartment.value;
    const matchesClosure =
      selectedClosure.value === "" ||
      (idea.closure && idea.closure.name === selectedClosure.value);
    const matchesContentLength =
      selectedContentLength.value === "" ||
      (selectedContentLength.value === "short" && idea.content.length < 100) ||
      (selectedContentLength.value === "medium" &&
        idea.content.length >= 100 &&
        idea.content.length <= 400) ||
      (selectedContentLength.value === "long" && idea.content.length > 400);
    return (
      matchesTitle &&
      matchesCategory &&
      matchesDepartment &&
      matchesClosure &&
      matchesContentLength
    );
  });

  if (sortOption.value === "newest") {
    result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (sortOption.value === "oldest") {
    result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  } else if (sortOption.value === "mostLikes") {
    result.sort((a, b) => b.thumbs_up_count.likes - a.thumbs_up_count.likes);
  } else if (sortOption.value === "mostDislikes") {
    result.sort(
      (a, b) => b.thumbs_up_count.unlikes - a.thumbs_up_count.unlikes
    );
  }

  return result;
});

const totalPages = computed(() => {
  return Math.ceil(filteredIdeas.value.length / itemsPerPage);
});

const paginatedIdeas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredIdeas.value.slice(start, end);
});

// Truncate content to approximately 2 lines (~400 characters)
const truncateContent = (content) => {
  const maxLength = 400;
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength).trim() + "...";
};

onMounted(async () => {
  try {
    loading.value = true;
    const { data } = await Http.get("ideas");
    ideas.value = data.data.data;

    await Promise.all(
      ideas.value.map((idea) =>
        Promise.all([getUserReactionForIdea(idea), getIdeaReactionCount(idea)])
      )
    );

    const newestClosure = uniqueClosures.value.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )[0];
    if (newestClosure) {
      selectedClosure.value = newestClosure.name;
    }
  } catch (error) {
    console.error("Failed to load ideas:", error);
  } finally {
    loading.value = false;
  }
});

const thumbUp = async (idea) => {
  try {
    const response = await Http.post(`reactions`, {
      user_id: user_id,
      idea_id: idea.id,
      type: true,
    });

    const { data } = response;
    if (data.success) {
      const index = ideas.value.findIndex((i) => i.id === idea.id);
      if (index !== -1) {
        ideas.value[index].has_thumbs_up = true;
        ideas.value[index].thumbs_up_count.likes += 1;
      }
    }
  } catch (error) {
    console.error("Error in thumbUp:", error);
  }
};

const thumbDown = async (idea) => {
  try {
    const response = await Http.post(`reactions`, {
      user_id: user_id,
      idea_id: idea.id,
      type: false,
    });

    const { data } = response;
    if (data.success) {
      const index = ideas.value.findIndex((i) => i.id === idea.id);
      if (index !== -1) {
        ideas.value[index].has_thumbs_down = true;
        ideas.value[index].thumbs_up_count.unlikes += 1;
      }
    }
  } catch (error) {
    console.error("Error in thumbDown:", error);
  }
};

const getUserReactionForIdea = async (idea) => {
  try {
    const response = await Http.get(`ideas/${idea.id}/reactions/me`);
    const { data } = response;
    if (data.message === "Success!") {
      const userReactions = data.data;
      idea.reactions = userReactions;
      idea.has_thumbs_up = userReactions.type === "1";
      idea.has_thumbs_down = userReactions.type === "0";
    }
  } catch (error) {
    console.error("Failed to get user reaction for idea:", error);
  }
};

const getIdeaReactionCount = async (idea) => {
  try {
    const response = await Http.get(`ideas/${idea.id}/count-reactions`);
    const { data } = response;
    if (data.message === "Success!") {
      idea.thumbs_up_count = data.data;
    }
  } catch (error) {
    console.error("Failed to get reaction count for idea:", error);
    idea.thumbs_up_count = { likes: 0, unlikes: 0 };
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const filterIdeas = () => {
  currentPage.value = 1;
};

const sortIdeas = () => {
  currentPage.value = 1;
};

const toggleSummary = () => {
  showSummary.value = !showSummary.value;
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

/* Responsive adjustment for smaller screens */
@media (max-width: 768px) {
  .d-flex.flex-wrap {
    flex-direction: column;
  }
  .d-flex.flex-wrap > div {
    margin: 0 0 10px 0 !important;
    width: 100%;
  }
}

/* Spinner styling */
.spinner-border {
  color: #5d1010;
}

/* Content preview styling */
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

/* Content length filter styling */
.content-length-filter {
  width: 150px;
  height: 30px;
  font-size: 14px;
  padding: 0 5px;
}

/* Summary section styling */
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
