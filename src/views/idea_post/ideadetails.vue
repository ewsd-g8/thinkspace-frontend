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
              <div style="font-size: 15px" class="border-bottom">
                <p style="text-align: justify">{{ ideas.content }}</p>
              </div>
              <!-- <div class="d-flex justify-content-between">
                <div>
                  <img
                    v-if="isImage(doc.file_path)"
                    :src="doc.file_path"
                    class="w-50"
                    alt="Document Image"
                  />
                  <iframe
                    v-else-if="isPDF(doc.file_path)"
                    :src="doc.file_path"
                    class="w-50"
                  ></iframe>
                </div>
              </div> -->
            </div>
          </div>
          <div
            id="carouselExampleIndicators"
            class="carousel slide"
            style="background-color: red"
          >
            <div class="carousel-indicators">
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="0"
                class="active"
                aria-current="true"
                aria-label="Slide 1"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="1"
                aria-label="Slide 2"
              ></button>
              <button
                type="button"
                data-bs-target="#carouselExampleIndicators"
                data-bs-slide-to="2"
                aria-label="Slide 3"
              ></button>
            </div>
            <div class="carousel-inner" style="background-color: yellow">
              <div
                class="carousel-item active"
                v-for="doc in ideas.document"
                :key="doc.id"
              >
                <img
                  v-if="isImage(doc.file_path)"
                  :src="doc.file_path"
                  class="d-block w-100"
                  alt="..."
                />
                <iframe
                  v-else-if="isPDF(doc.file_path)"
                  :src="doc.file_path"
                  class="d-block w-100"
                ></iframe>
              </div>
            </div>
            <button
              class="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleIndicators"
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
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next"
            >
              <span
                class="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
          <hr />
          <div class="mb-3">
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
                >
                  Send
                </button>
                <button class="btn btn-primary" type="button" v-if="showBtn">
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
              <p class="mb-1">{{ comments.content }}</p>
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

// // Comment Showing

const comments = reactive({
  content: "",
});

const getComment = async () => {
  loading.value = true;
  await Http.get(`comments`)
    .then((res) => {
      console.log("res", res);
      console.log(res.data.data.data.id);
      comments.content = res.data.data.data.content;
      loading.value = false;
    })
    .catch((err) => {
      if (err.response.status == 404) {
        router.push({ name: "page-not-found" });
      }
    });
};

onMounted(async () => {
  getIdeaDetail();
  getComment();
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
