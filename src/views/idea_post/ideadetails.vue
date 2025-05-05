<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h4>Detail Ideas</h4>

        <div
          class="px-4 py-3"
          style="
            box-shadow: 3px 6px 14px 1px rgba(0, 0, 0, 0.2);
            -webkit-box-shadow: 3px 6px 14px 1px rgba(0, 0, 0, 0.2);
            -moz-box-shadow: 3px 6px 14px 1px rgba(0, 0, 0, 0.2);
            margin-bottom: 20px;
          "
        >
          <div class="d-flex justify-content-between border-bottom mb-2">
            <div class="d-flex justify-content-start align-items-center mb-1">
              <img
                v-if="!ideas.is_anonymous"
                :src="
                  ideas.user.profile
                    ? ideas.user.profile
                    : '/images/users/anonymous.jpg'
                "
                class="rounded-circle object-fit-cover"
                style="width: 35px; height: 35px"
              />
              <img
                v-if="ideas.is_anonymous"
                :src="'/images/users/anonymous.jpg'"
                class="rounded-circle object-fit-cover"
                style="width: 35px; height: 35px"
              />
              <span style="font-weight: bold; margin-left: 10px">{{
                !ideas.is_anonymous ? ideas.user.name : "Anonymous Participant"
              }}</span>
            </div>
            <div class="d-flex justify-content-end">
              <span style="margin-right: 20px"
                >{{ ideas.views_count }} views</span
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
                    ideas.categories && ideas.categories.length
                      ? `Tagged Categories: ${ideas.categories
                          .map((cat) => cat.name)
                          .join(", ")}`
                      : "No categories"
                  }}
                </span>
                - -
                <span style="font-weight: bold">
                  {{
                    ideas.closurename
                      ? ` ${ideas.closurename}`
                      : "No closure ID"
                  }}
                </span>
              </p>
              <h5 style="font-weight: bold; font-size: 20px">
                {{ ideas.title }}
              </h5>
              <div style="font-size: 15px">
                <p style="text-align: justify">{{ ideas.content }}</p>
              </div>
            </div>
          </div>
          <hr />
          <div class="d-flex justify-content-between">
            <div class="d-flex justify-content-start w-50">
              <button class="btn btn-sm" @click="thumbsUp()">
                <i class="mdi mdi-thumb-up"></i>
                <span
                  class="ml-1"
                  style="
                    margin-left: 5px;
                    font-weight: bold;
                    padding-right: 5px;
                  "
                  >{{ ideas.likes }}</span
                >
                <span>{{ ideas.likes ? "Liked" : "Like" }}</span>
              </button>
              <button class="btn btn-sm" @click="thumbsDown()">
                <i class="mdi mdi-thumb-down"></i>
                <span
                  class="ml-1"
                  style="
                    margin-left: 5px;
                    font-weight: bold;
                    padding-right: 5px;
                  "
                  >{{ ideas.unlikes }}</span
                >
                <span>{{ ideas.has_thumbs_down ? "Disliked" : "Unlike" }}</span>
              </button>
              <button
                type="button"
                class="btn btn-sm position-relative"
                @click="focusCommentBox"
              >
                <i class="mdi mdi-comment"></i>
                <span
                  class="ml-1"
                  style="
                    margin-left: 5px;
                    font-weight: bold;
                    padding-right: 5px;
                  "
                  >{{ ideas.comments_count }}</span
                >
                <span>{{
                  ideas.comments_count ? "Commented" : "Comment"
                }}</span>
              </button>
              <button
                class="btn btn-sm"
                @click="
                  () =>
                    $router
                      .push({
                        name: 'idea_report',
                        params: { id: route.params.id },
                      })
                      .catch((err) => console.error(err))
                "
              >
                <i class="mdi mdi-message-alert"></i>
                <span class="ml-1" style="margin-left: 5px; padding-right: 5px"
                  >Report</span
                >
              </button>
            </div>
            <div class="d-flex justify-content-end align-items-center w-50">
              <button
                class="btn btn-primary me-md-2 ml-3"
                type="submit"
                style="background-color: #670e10"
                @click="showDocToggle()"
                :disabled="ideas.document.length === 0"
              >
                Documents
              </button>
            </div>
          </div>

          <hr />
          <div class="d-flex justify-content-center align-item-center">
            <div class="grid w-75" v-if="showDocument">
              <div
                id="carouselExampleControls"
                class="carousel slide"
                data-bs-ride="carousel"
              >
                <div class="carousel-inner">
                  <div
                    class="carousel-item"
                    v-for="(doc, index) in imageList"
                    :key="index"
                    :class="{ active: index === 0 }"
                  >
                    <img
                      class="d-block w-100"
                      :src="doc.file_path"
                      alt="Slide"
                    />
                  </div>
                </div>

                <!-- Default Bootstrap Controls -->
                <button
                  class="carousel-control-prev"
                  id="prevSlideBtn"
                  type="button"
                  data-bs-target="#carouselExampleControls"
                  data-bs-slide="prev"
                >
                  <span
                    class="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span class="visually-hidden">Previous</span>
                </button>
                <button
                  class="carousel-control-next"
                  id="nextSlideBtn"
                  type="button"
                  data-bs-target="#carouselExampleControls"
                  data-bs-slide="next"
                >
                  <span
                    class="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span class="visually-hidden">Next</span>
                </button>
              </div>

              <div
                v-for="doc in ideas.document"
                :key="doc.id"
                class="g-col-6 g-col-md-4 mb-3 d-flex justify-content-center align-items-center"
              >
                <iframe
                  v-if="isPDF(doc.file_path)"
                  :src="doc.file_path"
                  class="w-100 shadow-lg p-3 bg-body-tertiary rounded"
                  style="height: 50vw"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div class="mb-3" ref="commentBox">
          <form @submit.prevent="sendComment()">
            <div class="form-floating mb-2">
              <textarea
                class="form-control"
                placeholder="Leave a comment here"
                id="floatingTextarea"
                v-model="comment.content"
                @focus="toggleBtn"
              ></textarea>
              <label for="floatingTextarea">Comments</label>
            </div>
            <div v-if="loading" class="text-center my-5">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p>Loading comments...</p>
            </div>
            <div class="d-flex justify-content-between" v-if="showBtn">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="anonymousComment"
                  v-model="comment.is_anonymous"
                />
                <label class="form-check-label" for="anonymousComment"
                  >Comment Anonymously</label
                >
              </div>

              <div class="d-grid gap-2 d-md-flex justify-content-md-end" v-if="showBtn">
  <button
    class="btn btn-primary me-md-2"
    type="submit"
    style="background-color: #670e10"
    :disabled="!isCommentAllowed"
    :title="!isCommentAllowed ? 'Commenting is currently disabled' : ''"
  >
    Send
  </button>
  <button
    class="btn btn-primary"
    type="button"
    style="background-color: #670e10"
    @click="cancelComment"
  >
    Cancel
  </button>
</div>

            </div>
          </form>
        </div>
        <hr />
        <ul class="list-group">
          <li>
            <div class="filter-last float-md-end w-15">
              <select
                class="form-control form-select"
                v-model="sortOption"
                @change="sortComments"
              >
                <option value="newest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </li>
          <li
            class="list-group-item list-group-item-action"
            aria-current="true"
            v-for="com in sortedComments"
            :key="com.id"
          >
            <div
              class="d-flex w-100 justify-content-between border-bottom"
              style="align-items: center"
            >
              <div
                class="d-flex"
                style="justify-content: center; align-items: center"
              >
                <img
                  v-if="!com.is_anonymous"
                  :src="
                    com.user.profile
                      ? com.user.profile
                      : '/images/users/anonymous.jpg'
                  "
                  class="rounded-circle object-fit-cover"
                  style="width: 35px; height: 35px"
                />
                <img
                  v-else-if="com.is_anonymous"
                  :src="'/images/users/anonymous.jpg'"
                  class="rounded-circle object-fit-cover"
                  style="width: 35px; height: 35px"
                />
                <h5 style="margin-left: 10px">
                  {{
                    !com.is_anonymous
                      ? com.user.full_name
                      : "Anonymous Participant"
                  }}
                </h5>
              </div>
              <small>{{ timeAgo(com.created_at) }}</small>
            </div>
            <p class="mb-1 mt-1">
              {{ com.content }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from "vue";
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
// Ensure Bootstrap is loaded
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const isCommentAllowed = ref(true);



const loading = ref(false);
const authStore = useAuthStore();
const getUserID = authStore.getUserId; // No need for computed here
const router = useRouter();
const route = useRoute();
const closures = ref([]);
const ideas = reactive({
  content: "",
  title: "",
  closurename: "",
  closurefinal: "",
  closure: "",
  categories: "",
  document: [],
  comments: [],
  comments_count: 0,
  user_reaction: "",
  likes: 0,
  unlikes: 0,
  views_count: 0,
  has_thumbs_up: false,
  has_thumbs_down: false,
  user: {},
  is_anonymous: false,
});

let imageList = reactive([]);

const sortOption = ref("newest"); // Default sort option

// Computed property to sort comments locally
const sortedComments = computed(() => {
  const comments = [...ideas.comments]; // Create a copy to avoid mutating original
  return comments.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortOption.value === "newest" ? dateB - dateA : dateA - dateB;
  });
});

// Fetch idea details including comments (no sort parameter sent to backend)
const fetchComments = async () => {
  loading.value = true;
  try {
    const url = `ideas/${route.params.id}`;
    console.log("Fetching comments with URL:", url);
    const { data } = await Http.get(url);
    console.log("API response:", data);

    // Update only comments and comments_count
    ideas.comments = data.data.comments || [];
    ideas.comments_count = data.data.comments_count || 0;
  } catch (error) {
    console.error(
      "Failed to load comments:",
      error.response?.data || error.message
    );
    ideas.comments = [];
    ideas.comments_count = 0;
  } finally {
    loading.value = false;
  }
};

const fetchClosurePostStatus = async () => {
  try {
    const response = await Http.get("/admin/get-closure-post-status");
    isCommentAllowed.value = response.data.data.comment; // Set isCommentAllowed based on API response
  } catch (error) {
    console.error("Failed to fetch closure post status:", error);
    createToast(
      {
        title: "Error",
        description: "Could not fetch comment status. Commenting may be disabled.",
      },
      {
        type: "danger",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
    isCommentAllowed.value = false; // Default to disabled if API call fails
  }
};



const getIdeaDetail = async () => {
  loading.value = true;
  try {
    const response = await Http.get(`ideas/${route.params.id}`);
    console.log("Idea detail response:", response);
    const data = response.data.data;
    ideas.content = data.content;
    ideas.title = data.title;
    ideas.categories = data.categories;
    ideas.closurename = data.closure.name;
    ideas.closure = data.closure;
    ideas.closurefinal = data.closure.final_date;
    ideas.document = data.documents;
    ideas.comments = data.comments;
    ideas.comments_count = data.comments_count;
    ideas.user_reaction = data.user_reaction;
    ideas.likes = data.likes;
    ideas.unlikes = data.unlikes;
    ideas.views_count = data.views_count;
    ideas.has_thumbs_up = data.user_reaction === true;
    ideas.has_thumbs_down = data.user_reaction === false;
    ideas.user = data.user;
    ideas.is_anonymous = data.is_anonymous;

    imageList = ideas.document.filter((d) => isImage(d.file_path));
    console.log(imageList);
  } catch (err) {
    if (err.response?.status === 404) {
      router.push({ name: "page-not-found" });
    }
  } finally {
    loading.value = false;
  }
};

// Reaction
const updatedIdea = reactive({
  content: "",
  title: "",
  closurename: "",
  categories: "",
  document: [],
  comments: [],
  comments_count: 0,
  user_reaction: "",
  likes: 0,
  unlikes: 0,
  views_count: 0,
});

const thumbsUp = async () => {
  const newLikes = ideas.has_thumbs_up ? ideas.likes - 1 : ideas.likes + 1;
  const newUnlikes = ideas.has_thumbs_down ? ideas.unlikes - 1 : ideas.unlikes;

  ideas.likes = newLikes;
  ideas.unlikes = newUnlikes;
  ideas.has_thumbs_up = !ideas.has_thumbs_up;
  ideas.has_thumbs_down = false;

  try {
    await Http.post(`reactions`, {
      idea_id: route.params.id,
      type: true,
    });
    const response = await Http.get(`ideas/${route.params.id}`);
    updatedIdea.user_reaction = response.data.data.user_reaction;
    ideas.has_thumbs_up = updatedIdea.user_reaction === true;
    ideas.has_thumbs_down = updatedIdea.user_reaction === false;
    ideas.likes = response.data.data.likes;
    ideas.unlikes = response.data.data.unlikes;
  } catch (error) {
    console.error("Error in thumbUp:", error.response?.data || error.message);
  }
};

const thumbsDown = async () => {
  const newUnlikes = ideas.has_thumbs_down
    ? ideas.unlikes - 1
    : ideas.unlikes + 1;
  const newLikes = ideas.has_thumbs_up ? ideas.likes - 1 : ideas.likes;

  ideas.likes = newLikes;
  ideas.unlikes = newUnlikes;
  ideas.has_thumbs_up = false;
  ideas.has_thumbs_down = !ideas.has_thumbs_down;

  try {
    await Http.post(`reactions`, {
      idea_id: route.params.id,
      type: false,
    });
    const response = await Http.get(`ideas/${route.params.id}`);
    updatedIdea.user_reaction = response.data.data.user_reaction;
    ideas.has_thumbs_up = updatedIdea.user_reaction === true;
    ideas.has_thumbs_down = updatedIdea.user_reaction === false;
    ideas.likes = response.data.data.likes;
    ideas.unlikes = response.data.data.unlikes;
  } catch (error) {
    console.error("Error in thumbDown:", error.response?.data || error.message);
  }
};

const showBtn = ref(false);
const showDocument = ref(false);

const toggleBtn = () => {
  showBtn.value = !showBtn.value;
};

const showDocToggle = () => {
  showDocument.value = !showDocument.value;
};

const isImage = (filePath) => {
  return filePath && /\.(jpg|jpeg|png)$/i.test(filePath);
};

const isPDF = (filePath) => {
  return filePath && /\.pdf$/i.test(filePath);
};

const focusCommentBox = () => {
  const textarea = document.querySelector("#floatingTextarea");
  if (textarea) {
    textarea.focus();
  }
};

const cancelComment = () => {
  comment.content = "";
  showBtn.value = false;
};

const comment = reactive({
  content: "",
  idea_id: route.params.id,
  user_id: getUserID,
  is_anonymous: false,
});

const timeAgo = (timestamp) => {
  const currentDate = new Date();
  const postDate = new Date(timestamp);
  const diffMs = currentDate - postDate;
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days < 0) return "In the future";
  if (days > 1) return `${days} days ago`;
  if (days === 1) return "Yesterday";
  if (hours > 0) return `${hours} hours ago`;
  if (minutes > 0) return `${minutes} minutes ago`;
  return "Just now";
};

// Function to trigger sorting (just updates UI since sorting is handled by computed)
const sortComments = () => {
  // No need to fetch again; sortedComments will update automatically
};

const getClosure = async () => {
  try {
    const response = await Http.get("closures");
    console.log(response);
    closures.value = response.data.data.data;
    console.log("closure", closures.value);
  } catch (error) {
    console.error("Failed to fetch closures", error);
  }
};

const v$ = useVuelidate(comment);
// Function to convert UTC to local timezone
const formatToLocalTime = (utcDate) => {
  if (!utcDate) return ""; // Handle null/undefined
  const date = new Date(utcDate); // Parse UTC date string
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }); // e.g., "Mar 04, 2024, 10:00:00 AM"
};



onMounted(async () => {
  await Promise.all([
    getIdeaDetail(),
    fetchComments(),
    getClosure(),
    fetchClosurePostStatus(), 
  ]);

  const carouselElement = document.querySelector("#carouselExampleControls");
  if (carouselElement) {
    const carousel = new bootstrap.Carousel(carouselElement, {
      interval: 5000,
      wrap: true,
    });

    document.querySelector("#nextSlideBtn").addEventListener("click", () => {
      carousel.next();
    });

    document.querySelector("#prevSlideBtn").addEventListener("click", () => {
      carousel.prev();
    });
  }
});
const sendComment = async () => {
  if (!isCommentAllowed.value) {
    createToast(
      {
        title: "Error",
        description: "Commenting is currently disabled.",
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


const sendComment = async () => {
>>>>>>> develop
  let isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  loading.value = true;

  resetServerErrors();

  const currentDate = new Date();

  if (ideas.closurefinal < formatToLocalTime(currentDate)) {
    const fd = new FormData();
    fd.append("content", comment.content);
    fd.append("user_id", comment.user_id);
    fd.append("idea_id", comment.idea_id);
    fd.append("is_anonymous", comment.is_anonymous ? 1 : 0);

    await Http.post("comments", fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then(() => {

        fetchComments();

        createToast(
          {
            title: "Success",
            description: "Successfully Sent Comment!",
          },
          {
            type: "success",
            transition: "bounce",
            position: "top-right",
            showIcon: true,
          }
        );
      })
      .catch((error) => {
        console.log("Error Response:", error.response);
        serverErrors(error.response?.data.errors);
      })
      .finally(() => {
        loading.value = false;
        comment.content = "";
        showBtn.value = false;
      });
  } else {
    createToast(
      {
        title: "Error",
        description: "Comment Session is Ended for this closure",
      },
      {
        type: "danger",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
    loading.value = false;
  }
};

</script>

<style scoped>
.loading-container {
  height: 50vh;
}
</style>
