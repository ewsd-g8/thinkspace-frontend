<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h4>Ideas</h4>

        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="Search by title"
            v-model="searchQuery"
            @input="filterIdeas"
          />
        </div>
        
        <div class="mb-3">
          <select class="form-control" v-model="selectedCategory"  @change="filterIdeas">
            <option value="">All Categories</option>
            <option v-for="category in uniqueCategories" :key="category"multiple>{{ category }}</option>
          </select>
         
        </div>
        <ul class="list-group">
          <li
            class="list-group-item"
            v-for="idea in filteredIdeas"
            :key="idea.id"
            style="box-shadow: 3px 6px 14px 1px rgba(0, 0, 0, 0.49); -webkit-box-shadow: 3px 6px 14px 1px rgba(0, 0, 0, 0.49); -moz-box-shadow: 3px 6px 14px 1px rgba(0, 0, 0, 0.49); margin-bottom: 20px;"
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
                <span style="font-weight: bold; margin-left: 5px">Anonymous Participant</span>
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
                        ? `Tagged Categories: ${idea.categories.map((cat) => cat.name).join(", ")}`
                        : "No categories"
                    }}
                  </span>
                  - -
                  <span style="font-weight: bold">{{ idea.closure_id ? ` ${idea.closure.name}` : "No closure ID" }}</span>
                </p>
                <h5 style="font-weight: bold; font-size: 20px">{{ idea.title }}</h5>
                <div style="font-size: 15px">
                  <p>{{ idea.content }}</p>
                </div>
              </div>
            </div>
           
            <hr />

            <div>

              <button
                class="btn btn-sm"
                  @click="thumbUp(idea); window.location.reload()"
                :disabled="idea.has_thumbs_up"
              > <i class="mdi mdi-thumb-up"></i> <span class="ml-1" style="font-weight: bold ;padding-right: 5px" >{{ idea.thumbs_up_count.likes}}</span>
                <span v-if="!idea.has_thumbs_up">Like</span>
                <span v-if="idea.has_thumbs_up">Liked</span>
               
               
              </button>
              <button class="btn btn-sm" @click="thumbDown(idea)" :disabled="idea.has_thumbs_down">
                <i class="mdi mdi-thumb-down"></i> <span class="ml-1" style="font-weight: bold ;padding-right: 5px" >{{ idea.thumbs_up_count.unlikes}}</span>
                <span v-if="idea.has_thumbs_down">Dislike</span>
                <span v-if="!idea.has_thumbs_down">Unlike</span>
               
             
                
              </button>
              <!-- <button class="btn btn-sm" @click="thumbDown(idea)" :disabled="idea.has_thumbs_down">
                <span v-if="idea.has_thumbs_down">Disliked</span>
                <span v-if="idea.has_thumbs_down">{{ idea.thumbs_down_count || 0 }}</span>
                <i class="mdi mdi-thumb-down"></i>
              </button> -->

              <button
                class="btn btn-sm"
                @click="() => $router.push({ name: 'idea_details', params: { id: idea.id } }).catch(err => console.error(err))"
              >
                <i class="mdi mdi-comment"></i>
              </button>
            </div>
          </li>
        </ul>
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
const store = useAuthStore();
const user_id = store.getAuthUser.id;
const router = useRouter();

const uniqueCategories = computed(() => {
  const categories = ideas.value.map(idea =>
    idea.categories ? idea.categories.map(cat => cat.name) : []
  ).flat();
  return [...new Set(categories)];
});

const filteredIdeas = computed(() => {
  return ideas.value.filter(idea => {
    const matchesTitle = idea.title.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesCategory =
      selectedCategory.value === "" ||
      (idea.categories && idea.categories.some(cat => cat.name === selectedCategory.value));
    return matchesTitle && matchesCategory;
  });
});

const getIdeaById = async (id) => {
  try {
    const response = await Http.get(`ideas/${id}`);
    const idea = response.data.data;
    console.log(idea.id);
    return idea;
  } catch (error) {
    console.error("Failed to fetch idea by ID", error);
  }
};

onMounted(async () => {
  const { data } = await Http.get("ideas");
  console.log(data);
  ideas.value = data.data.data;
  
  for (const idea of ideas.value) {
    await Promise.all([
      getUserReactionForIdea(idea),
      getIdeaReactionCount(idea),
    ]);
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
      const index = ideas.value.findIndex(i => i.id === idea.id);
      if (index !== -1) {
        ideas.value[index].has_thumbs_up = true;
      }
    }
  } catch (error) {
    console.error("Error in thumbUp", error);
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
      const index = ideas.value.findIndex(i => i.id === idea.id);
      if (index !== -1) {
        ideas.value[index].has_thumbs_down = true;
      }
    }
  } catch (error) {
    console.error("Error in thumbDown", error);
  }
};

const getUserReactionForIdea = async (idea) => {
  try {
    console.log(`Fetching reaction for idea ID: ${idea.id}`);
    const response = await Http.get(`ideas/${idea.id}/reactions/me`);
    console.log('API Response:', response);
    const { data } = response;
    console.log('Data:', data);
    if (data.message === 'Success!') {
      console.log('Message value:', data.message);
      const userReactions = data.data;
      idea.reactions = userReactions;
      console.log('Reactions:', idea.reactions);

      
      idea.has_thumbs_up = userReactions.type === '1'; // '1' for thumbs up
      idea.has_thumbs_down = userReactions.type === '0'; // Assuming '0' for thumbs down
      console.log('Thumbs up:', idea.has_thumbs_up, 'Thumbs down:', idea.has_thumbs_down);
    } else {
      console.log('Unexpected message:', data.message);
    }
  } catch (error) {
    console.error("Failed to get user reaction for idea", error);
  }
};
const getIdeaReactionCount = async (idea) => {
  try {
    const response = await Http.get(`ideas/${idea.id}/count-reactions`);
    const { data } = response;
    if (data.message === 'Success!') {
      idea.thumbs_up_count = data.data; // Assumes data is a number (total thumbs-up count)
    }
  } catch (error) {
    console.error("Failed to get reaction count for idea", error);
    idea.thumbs_up_count = 0; // Fallback
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

