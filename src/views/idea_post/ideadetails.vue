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
          <hr />
          <div>
            <!-- <button
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
              <span>{{ idea.has_thumbs_up ? "Liked" : "Like" }}</span>
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
              <span>{{ idea.has_thumbs_down ? "Disliked" : "Unlike" }}</span>
            </button> -->

            <button class="btn btn-sm" @click="focusCommentBox">
              <i class="mdi mdi-comment"></i>
              <span
                class="ml-1"
                style="font-weight: bold; padding-right: 5px"
                >{{ ideas.comments_count }}</span
              >
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
            </button>
          </div>
          <hr />
          <div class="grid w-100">
            <div
              v-for="doc in ideas.document"
              :key="doc.id"
              class="g-col-6 g-col-md-4 d-flex justify-content-center align-items-center mb-3"
            >
              <img
                v-if="isImage(doc.file_path)"
                :src="doc.file_path"
                class="img-fluid w-50 h-50 shadow-lg p-3bg-body-tertiary rounded"
                alt="..."
              />
              <iframe
                v-else-if="isPDF(doc.file_path)"
                :src="doc.file_path"
                class="w-50 shadow-lg p-3 bg-body-tertiary rounded"
                style="height: 500px"
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
              <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                <button
                  class="btn btn-primary me-md-2"
                  type="submit"
                  v-if="showBtn"
                  style="color: #670e10; text-transform: uppercase"
                >
                  Send
                </button>
                <button
                  class="btn btn-primary"
                  type="button"
                  v-if="showBtn"
                  style="color: #670e10; text-transform: uppercase"
                  @click="cancelComment"
                >
                  Cancel
                </button>
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
                  <i
                    class="mdi mdi-account-circle rounded-circle"
                    style="font-size: 40px"
                  ></i>
                  <h5 style="padding-left: 10px">Anonymous User</h5>
                </div>
                <small>3 days ago</small>
              </div>
              <p class="mb-1">
                {{ com.content }}
              </p>
              <small>And some small print.</small>
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

const ideas = reactive({
  content: "",
  title: "",
  closurename: "",
  categories: "",
  document: "",
  comments: "",
  comments_count: "",
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
      console.log(res.data.data.documents);
      loading.value = false;
    })
    .catch((err) => {
      if (err.response.status == 404) {
        router.push({ name: "page-not-found" });
      }
    });
};

const showBtn = ref(false);

const toggleBtn = () => {
  showBtn.value = !showBtn.value;
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
});

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

  await Http.post("comments", fd, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
    .then(() => {
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
    });
};

// Reaction
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
