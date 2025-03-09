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


        <!-- Search and Content Length Filters -->
        <div class="mb-3 d-flex justify-content-between flex-wrap">
          <div style="flex: 4; margin-right: 10px; min-width: 200px">
            <input type="text" class="form-control" placeholder="Search by title" v-model="searchQuery"
              @input="debouncedSearchIdeas" />
          </div>
          <div style="flex: 1; margin: 0 10px; min-width: 200px">
            <select class="form-control form-control-sm content-length-filter" v-model="selectedContentLength"
              @change="filterIdeas">
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
            <select class="form-control" v-model="selectedCategory" @change="filterIdeas">
              <option value="">All Categories</option>
              <option v-for="category in categories" :key="category.id" :value="category.name">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div style="flex: 1; margin: 0 10px; min-width: 200px">
            <select class="form-control" v-model="selectedDepartment" @change="filterIdeas">
              <option value="">All Departments</option>
              <option v-for="department in departments" :key="department.id" :value="department.name">
                {{ department.name }}
              </option>
            </select>
          </div>
          <div style="flex: 1; margin: 0 10px; min-width: 200px">
            <select class="form-control" v-model="selectedClosure" @change="filterIdeas">
              <option value="">All Closures</option>
              <option v-for="closure in uniqueClosures" :key="closure.id" :value="closure.name">
                {{ closure.name }}
              </option>
            </select>
          </div>
          <div style="flex: 1; margin-left: 10px; min-width: 200px">
            <select class="form-control" v-model="sortOption" @change="sortIdeas">
              <option value="newest">Newest to Oldest</option>
              <option value="oldest">Oldest to Newest</option>
              <option value="mostLikes">Most Likes</option>
              <option value="mostDislikes">Most Dislikes</option>
              <option value="mostViews">Most Views</option> <!-- Fixed label -->
            </select>
          </div>
        </div>

        <!-- Loading Animation -->
        <div v-if="loading" class="text-center my-5">
          <div class="spinner-border" role="status" style="width: 3rem; height: 3rem">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p>Loading ideas...</p>
        </div>

        <!-- Ideas List -->
        <ul v-else class="list-group">
          <li class="list-group-item" v-for="idea in filteredIdeas" :key="idea.id" style="
              box-shadow: 3px 6px 14px 1px rgba(0, 0, 0, 0.49);
              margin-bottom: 20px;
            ">
            <div style="display: inline-block">
              <div style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">
                <i class="mdi mdi-account-circle rounded-circle" style="font-size: 40px"></i>
                <span style="font-weight: bold; margin-left: 5px">Anonymous Participant</span> 
              </div>
            </div><span style="opacity: 0.5; float: right;">{{ idea.views_count }} views</span>
            <div class="d-flex justify-content-between">
              <div>
                <p class="text-muted">
                  <span style="
                      background-color: #e5e5e5;
                      border: 1px solid #ccc;
                      border-radius: 5px;
                      padding: 5px;
                      margin-right: 5px;
                    ">
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
                  {{ idea.title }} , 
                </h5>
                <div style="font-size: 15px">
                  <p class="content-preview">
                    {{ truncateContent(idea.content) }}
                    <span v-if="idea.content.length > 300" class="see-more">
                      <router-link :to="{
                        name: 'idea_details',
                        params: { id: idea.id },
                      }" @click.stop>...see more</router-link>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <hr />


            <button class="btn btn-sm":class="{ 'liked': idea.has_thumbs_up }"
  @click="thumbUp(idea)"
  :disabled="isBlocked"
  :title="isBlocked ? 'You are blocked and cannot react' : ''">
              <i class="mdi mdi-thumb-up"></i>
              <span class="ml-1" style="margin-left: 5px; font-weight: bold; padding-right: 5px">{{ idea.likes }}</span>
              <span>{{ idea.likes ? "Liked" : "Like" }}</span>
            </button>
            <button class="btn btn-sm" :class="{ 'unliked': idea.has_thumbs_down }"
  @click="thumbDown(idea)"
  :disabled="isBlocked"
  :title="isBlocked ? 'You are blocked and cannot react' : ''">
              <i class="mdi mdi-thumb-down"></i>
              <span class="ml-1" style="margin-left: 5px; font-weight: bold; padding-right: 5px">{{ idea.unlikes }}</span>
              <span>{{ idea.has_thumbs_down ? "Disliked" : "Unlike" }}</span>
            </button>



            <button class="btn btn-sm" @click="viewIdeaDetails(idea.id)"
  :disabled="isBlocked"
  :title="isBlocked ? 'You are blocked and cannot comment' : ''">
              <i class="mdi mdi-comment"></i>  <span class="ml-1" style="font-weight: bold; padding-right: 5px">{{ idea.comments_count }}</span> 
              <span>Comments</span>
            </button>
           
          </li>
        </ul>

        <!-- Pagination Controls -->
        <div v-if="!loading" class="d-flex justify-content-between mt-3">
          <button class="btn btn-primary" @click="previousPage" :disabled="currentPage === 1">
            Previous
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button class="btn btn-primary" @click="nextPage" :disabled="currentPage === totalPages">
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
const categories = ref([]);
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
const isBlocked = ref(false);
const originalIdeas = ref([]);
const fetchUserDetails = async () => {
  try {
    const response = await Http.get("/auth-user");
    isBlocked.value = response.data.data.is_blocked || false;
  } catch (error) {
    console.error("Failed to fetch user details:", error);
  }
};
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

const totalPages = computed(() => {
  return Math.ceil(totalIdeas.value / itemsPerPage) || 1;
});

const filteredIdeas = computed(() => {
  return [...ideas.value];
});

const fetchIdeas = async (page = currentPage.value, search = searchQuery.value) => {
  loading.value = true;
  try {
    const url = `ideas?page=${page}&paginate=${itemsPerPage}&search=${encodeURIComponent(
      search
    )}&category=${encodeURIComponent(selectedCategory.value)}&department=${encodeURIComponent(
      selectedDepartment.value
    )}&closure=${encodeURIComponent(selectedClosure.value)}&contentLength=${encodeURIComponent(
      selectedContentLength.value
    )}&sort=${encodeURIComponent(sortOption.value)}`;
    console.log("Fetching ideas with URL:", url);
    const { data } = await Http.get(url);
    console.log("API response:", data);

    ideas.value = (data.data.data || []).map(idea => ({
      ...idea,
      likes: idea.likes || 0,
      unlikes: idea.unlikes || 0,
      views_count: idea.views_count || 0,
      comments_count:idea.comments_count || 0,
      has_thumbs_up: idea.has_reacted && idea.user_reaction === true,
      has_thumbs_down: idea.has_reacted && idea.user_reaction === false,
    }));
    originalIdeas.value = ideas.value.map(idea => ({ ...idea }));
    totalIdeas.value = data.data.total || 0;
  } catch (error) {
    console.error("Failed to load ideas:", error.response?.data || error.message);
    ideas.value = [];
    originalIdeas.value = [];
    totalIdeas.value = 0;
  } finally {
    loading.value = false;
  }
};

const thumbUp = async (idea) => {
  const index = ideas.value.findIndex((i) => i.id === idea.id);
  const originalIndex = originalIdeas.value.findIndex((i) => i.id === idea.id);
  if (index === -1 || originalIndex === -1) return;

  const currentIdea = ideas.value[index];
  const newLikes = currentIdea.has_thumbs_up ? (currentIdea.likes || 0) - 1 : (currentIdea.likes || 0) + 1;
  const newUnlikes = currentIdea.has_thumbs_down ? (currentIdea.unlikes || 0) - 1 : currentIdea.unlikes || 0;
  ideas.value[index] = {
    ...currentIdea,
    likes: newLikes,
    unlikes: newUnlikes,
    has_thumbs_up: !currentIdea.has_thumbs_up,
    has_thumbs_down: false,
  };
  originalIdeas.value[originalIndex] = { ...ideas.value[index] };
  ideas.value = [...ideas.value];

  try {
    await Http.post(`reactions`, { user_id, idea_id: idea.id, type: true });
    const response = await Http.get(`ideas/${idea.id}`);
    const updatedIdea = response.data.data;
    ideas.value[index] = {
      ...updatedIdea,
      has_thumbs_up: updatedIdea.user_reaction === true,
      has_thumbs_down: updatedIdea.user_reaction === false,
    };
    originalIdeas.value[originalIndex] = { ...ideas.value[index] };
    ideas.value = [...ideas.value];
  } catch (error) {
    await fetchIdeas(currentPage.value);
    console.error("Error in thumbUp:", error.response?.data || error.message);
  }
};

const thumbDown = async (idea) => {
  const index = ideas.value.findIndex((i) => i.id === idea.id);
  const originalIndex = originalIdeas.value.findIndex((i) => i.id === idea.id);
  if (index === -1 || originalIndex === -1) return;

  const currentIdea = ideas.value[index];
  const newUnlikes = currentIdea.has_thumbs_down ? (currentIdea.unlikes || 0) - 1 : (currentIdea.unlikes || 0) + 1;
  const newLikes = currentIdea.has_thumbs_up ? (currentIdea.likes || 0) - 1 : currentIdea.likes || 0;
  ideas.value[index] = {
    ...currentIdea,
    likes: newLikes,
    unlikes: newUnlikes,
    has_thumbs_up: false,
    has_thumbs_down: !currentIdea.has_thumbs_down,
  };
  originalIdeas.value[originalIndex] = { ...ideas.value[index] };
  ideas.value = [...ideas.value];

  try {
    await Http.post(`reactions`, { user_id, idea_id: idea.id, type: false });
    const response = await Http.get(`ideas/${idea.id}`);
    const updatedIdea = response.data.data;
    ideas.value[index] = {
      ...updatedIdea,
      has_thumbs_up: updatedIdea.user_reaction === true,
      has_thumbs_down: updatedIdea.user_reaction === false,
    };
    originalIdeas.value[originalIndex] = { ...ideas.value[index] };
    ideas.value = [...ideas.value];
  } catch (error) {
    await fetchIdeas(currentPage.value);
    console.error("Error in thumbDown:", error.response?.data || error.message);
  }
};

const viewIdeaDetails = async (ideaId) => {
  try {
    // Increment view count
    await Http.post(`views`, { idea_id: ideaId });
    // Fetch updated idea to reflect new view count
    const response = await Http.get(`ideas/${ideaId}`);
    const updatedIdea = response.data.data;

    // Update the idea in the list
    const index = ideas.value.findIndex((i) => i.id === ideaId);
    if (index !== -1) {
      ideas.value[index] = {
        ...updatedIdea,
        likes: updatedIdea.likes || 0,
        unlikes: updatedIdea.unlikes || 0,
        has_thumbs_up: updatedIdea.has_reacted && updatedIdea.user_reaction === true,
        has_thumbs_down: updatedIdea.has_reacted && updatedIdea.user_reaction === false,
      };
      originalIdeas.value[index] = { ...ideas.value[index] };
      ideas.value = [...ideas.value];
    }

    // Navigate to details page
    router.push({ name: 'idea_details', params: { id: ideaId } });
  } catch (error) {
    console.error("Error in viewIdeaDetails:", error.response?.data || error.message);
    // Navigate even if view increment fails
    router.push({ name: 'idea_details', params: { id: ideaId } });
  }
};

onMounted(async () => {
  try { 
    await fetchUserDetails();
    await getDepartments();
    await getCategories();
    await fetchIdeas(1);
   
  } catch (error) {
    console.error("Failed to initialize:", error);
  }
});

const debouncedSearchIdeas = debounce(() => {
  currentPage.value = 1;
  fetchIdeas(currentPage.value);
}, 500);

const filterIdeas = () => {
  console.log("filterIdeas triggered with:", { category: selectedCategory.value, department: selectedDepartment.value, closure: selectedClosure.value });
  currentPage.value = 1;
  fetchIdeas(currentPage.value);
};

const sortIdeas = () => {
  currentPage.value = 1;
  fetchIdeas(currentPage.value);
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

const getDepartments = async () => {
  try {
    const res = await Http.get("get-all-departments");
    departments.value = res.data.data || [];
    console.log("Departments:", departments.value);
  } catch (error) {
    console.error("Failed to fetch departments:", error);
  }
};

const getCategories = async () => {
  try {
    const res = await Http.get("get-all-categories");
    categories.value = res.data.data || [];
    console.log("Categories:", categories.value);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
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

ul.list-group>li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

ul.list-group>li:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .d-flex.flex-wrap {
    flex-direction: column;
  }

  .d-flex.flex-wrap>div {
    margin: 0 0 10px 0 !important;
    width: 100%;
  }
}

.spinner-border {
  color: #5d1010;
}
.reaction-btn:disabled,
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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