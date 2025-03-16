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
                    : '/images/users/user-1.png'
                "
                class="rounded-circle object-fit-cover"
                style="width: 35px; height: 35px"
              />
              <img
                v-if="ideas.is_anonymous"
                :src="'/images/users/user-1.png'"
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
          <div class="grid w-100" v-if="showDocument">
            <div
              v-for="doc in ideas.document"
              :key="doc.id"
              class="g-col-6 g-col-md-4 mb-3 d-flex justify-content-center align-items-center"
            >
              <img
                v-if="isImage(doc.file_path)"
                :src="doc.file_path"
                class="img-fluid w-50 h-50 shadow-lg p-3bg-body-tertiary"
                alt="..."
              />

              <iframe
                v-else-if="isPDF(doc.file_path)"
                :src="doc.file_path"
                class="w-100 shadow-lg p-3 bg-body-tertiary rounded"
                style="height: 600px"
              ></iframe>
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
                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button
                    class="btn btn-primary me-md-2"
                    type="submit"
                    style="background-color: #670e10"
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
            <li
              class="list-group-item list-group-item-action"
              aria-current="true"
              v-for="com in ideas.comments"
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
                        : '/images/users/user-1.png'
                    "
                    class="rounded-circle object-fit-cover"
                    style="width: 35px; height: 35px"
                  />
                  <img
                    v-else-if="com.is_anonymous"
                    :src="'/images/users/user-1.png'"
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
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { useRouter, useRoute } from "vue-router";
import { createToast } from "mosha-vue-toastify";
import Skeleton from "@/components/shared/Skeleton.vue";
import { required, email, helpers } from "@vuelidate/validators";
import { Http } from "@/services/http-common";
import { getAuthUser } from "@/composables/getAuthUser";
import { useAuthStore } from "@/stores/auth";
import {
  serverErrors,
  errorFor,
  resetServerErrors,
} from "@/composables/validationErrors";

const loading = ref(false);
const authStore = useAuthStore();
const getUserID = computed(() => authStore.getUserId);
const router = useRouter();
const route = useRoute();

console.log(getUserID);
console.log(route.params.id);

const ideas = reactive({
  content: "",
  title: "",
  closurename: "",
  categories: "",
  document: "",
  comments: "",
  comments_count: "",
  user_reaction: "",
  likes: "",
  unlikes: "",
  views_count: "",
  has_thumbs_up: "",
  has_thumbs_down: "",
  user: "",
  is_anonymous: "",
});

const getIdeaDetail = async () => {
  loading.value = true;
  await Http.get(`ideas/${route.params.id}`)
    .then((res) => {
      console.log("res", res);
      ideas.content = res.data.data.content;
      ideas.title = res.data.data.title;
      ideas.categories = res.data.data.categories;
      ideas.closurename = res.data.data.closure.name;
      ideas.document = res.data.data.documents;
      ideas.comments = res.data.data.comments;
      ideas.comments_count = res.data.data.comments_count;
      ideas.user_reaction = res.data.data.user_reaction;
      ideas.likes = res.data.data.likes;
      ideas.unlikes = res.data.data.unlikes;
      ideas.views_count = res.data.data.views_count;
      ideas.has_thumbs_up = ideas.user_reaction === true;
      ideas.has_thumbs_down = ideas.user_reaction === false;
      ideas.user = res.data.data.user;
      ideas.is_anonymous = res.data.data.is_anonymous;
      loading.value = false;
    })
    .catch((err) => {
      if (err.response.status == 404) {
        router.push({ name: "page-not-found" });
      }
    });
};

// Reaction
const updatedIdea = reactive({
  content: "",
  title: "",
  closurename: "",
  categories: "",
  document: "",
  comments: "",
  comments_count: "",
  user_reaction: "",
  likes: "",
  unlikes: "",
  views_count: "",
});

const thumbsUp = async () => {
  const newLikes = ideas.has_thumbs_up
    ? (ideas.likes || 0) - 1
    : (ideas.likes || 0) + 1;
  const newUnlikes = ideas.has_thumbs_down
    ? (ideas.unlikes || 0) - 1
    : ideas.unlikes || 0;

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
    console.log(response);
    updatedIdea.user_reaction = response.data.data.user_reaction;
    console.log(updatedIdea.user_reaction);
    ideas.has_thumbs_up = updatedIdea.user_reaction === true;
    ideas.has_thumbs_down = updatedIdea.user_reaction === false;
  } catch (error) {
    console.error("Error in thumbUp:", error.response?.data || error.message);
  }
};

const thumbsDown = async () => {
  const newUnlikes = ideas.has_thumbs_down
    ? (ideas.unlikes || 0) - 1
    : (ideas.unlikes || 0) + 1;
  const newLikes = ideas.has_thumbs_up
    ? (ideas.likes || 0) - 1
    : ideas.likes || 0;

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
    console.log(response);
    updatedIdea.user_reaction = response.data.data.user_reaction;
    console.log(updatedIdea.user_reaction);
    ideas.has_thumbs_up = updatedIdea.user_reaction === true;
    ideas.has_thumbs_down = updatedIdea.user_reaction === false;
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
//>>>>> Comment Posting
const focusCommentBox = () => {
  const textarea = document.querySelector("#floatingTextarea");
  if (textarea) {
    textarea.focus(); // Focus the textarea, which also triggers toggleBtn
  }
};

// Cancel Comment
const cancelComment = () => {
  comment.content = ""; // Clear input
  showBtn.value = false; // Hide buttons
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

console.log(comment.is_anonymous);

const v$ = useVuelidate(comment);

const sendComment = async () => {
  let isFormCorrect = await v$.value.$validate();
  if (!isFormCorrect) return;
  loading.value = true;

  resetServerErrors();

  const fd = new FormData();
  fd.append("content", comment.content);
  fd.append("user_id", comment.user_id);
  fd.append("idea_id", comment.idea_id);
  fd.append("is_anonymous", comment.is_anonymous ? 1 : 0);

  const commentDetail = async () => {
    const ideares = await Http.get(`ideas/${route.params.id}`);
    console.log(ideares);
    updatedIdea.comments = ideares.data.data.comments;
    updatedIdea.comments_count = ideares.data.data.comments_count;
    ideas.comments = updatedIdea.comments;
    ideas.comments_count = updatedIdea.comments_count;
    console.log(ideas.comments.is_anonymous);
  };

  await Http.post("comments", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then(() => {
      commentDetail();
      createToast(
        {
          title: "Success",
          description: "Successfully Send Comment!",
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
      console.log("Error Response:", error.response); // Log status, data, headers
      serverErrors(error.response?.data.errors);
    })
    .finally(() => {
      loading.value = false;
      comment.content = ""; // Clear input
      showBtn.value = false; // Hide buttons
    });
};

onMounted(async () => {
  getIdeaDetail();
});
</script>

<!-- <style scoped>
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
</style> -->
