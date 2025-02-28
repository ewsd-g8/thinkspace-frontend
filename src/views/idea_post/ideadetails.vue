<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h4>Detail Ideas</h4>
        <div
          style="
            box-shadow: 3px 6px 14px 1px rgba(0, 0, 0, 0.49);
            -webkit-box-shadow: 3px 6px 14px 1px rgba(0, 0, 0, 0.49);
            -moz-box-shadow: 3px 6px 14px 1px rgba(0, 0, 0, 0.49);
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
                <p>{{ ideas.content }}</p>
              </div>
              <div>
                <img src="" alt="" />
                <iframe src="" frameborder="0"></iframe>
              </div>
            </div>
          </div>
          <hr />
          <div
            class="d-flex justify-content-center"
            style="background-color: red"
          >
            <div class="-md-10">
              <textarea
                name="comment"
                class="form-control mb-1"
                id=""
                rows="2"
              ></textarea>
              <button class="btn btn-success float-right">Cancle</button>
              <button class="btn btn-success float-right">
                Submit Comment
              </button>
            </div>
          </div>
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
import {
  serverErrors,
  errorFor,
  resetServerErrors,
} from "@/composables/validationErrors";

const loading = ref(false);
const router = useRouter();
const route = useRoute();

const ideas = reactive({
  content: "",
  title: "",
  closurename: "",
  categories: "",
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
