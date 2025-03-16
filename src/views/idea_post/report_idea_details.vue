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
                <button
                class="btn btn-danger btn-sm"
                @click="changeIdeaStatus"
                :disabled="isProcessing"
              >
                {{ isProcessing ? "Processing..." : (ideas.is_active ? "Delete" : "Restore") }}
              </button>
              </div>
            </div>
            <hr />
            <div class="d-flex justify-content-between">
              <div class="d-flex justify-content-start w-50">
                <span class="me-3">
                  <i class="mdi mdi-thumb-up"></i>
                  <span style="font-weight: bold; margin-left: 5px">{{ ideas.likes }}</span>
                  Likes
                </span>
                <span class="me-3">
                  <i class="mdi mdi-thumb-down"></i>
                  <span style="font-weight: bold; margin-left: 5px">{{ ideas.unlikes }}</span>
                  Unlikes
                </span>
                <span>
                  <i class="mdi mdi-comment"></i>
                  <span style="font-weight: bold; margin-left: 5px">{{ ideas.comments_count }}</span>
                  Comments
                </span>
              </div>
              <div class="d-flex justify-content-end align-items-center w-50">
                <span style="margin-right: 20px">{{ ideas.views_count }} views</span>
              </div>
            </div>
            <hr />
            <!-- Comments Section -->
            <h5>Comments</h5>
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
                <p class="mb-1">{{ com.content }}</p>
                <small>And some small print.</small>
              </li>
            </ul>
            <hr />
            <!-- Reports Section -->
            <h5>Reports for this Idea</h5>
            <div v-if="!ideas.reports || ideas.reports.length === 0" class="text-muted">
              <p>No reports available for this idea.</p>
            </div>
            <ul class="list-group" v-else>
              <li
                class="list-group-item list-group-item-action"
                v-for="report in ideas.reports"
                :key="report.id"
              >
                <div class="d-flex w-100 justify-content-between border-bottom">
                  <div>
                    <p><strong>Reason:</strong> {{ report.reason }}</p>
                    <p><strong>Report Type:</strong> {{ report.report_type?.name || "Unknown" }}</p>
                  <p>
                    <strong>Reported by:</strong> {{ report.user?.full_name || "Unknown" }}
                    ({{ report.user?.email || "No email" }})
                  </p>
                    <p>
                      <strong>Status:</strong>
                      <span :class="report.is_active ? 'text-success' : 'text-danger'">
                        {{ report.is_active ? "Active" : "Inactive" }}
                      </span>
                    </p>
                  </div>
                </div>
              </li>
            </ul>
        
        </div>
        </div>
      </div>
     
    </div>
  </template>
<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Http } from "@/services/http-common";
import { createToast } from "mosha-vue-toastify"; // Add this for notifications

const route = useRoute();
const isProcessing = ref(false); // Track button state

const ideas = reactive({
  content: "",
  title: "",
  closurename: "",
  categories: "",
  comments: "",
  comments_count: "",
  likes: "",
  unlikes: "",
  views_count: "",
  reports: [],
  is_active: "", // Add is_active to track status
});

const getIdeaDetail = async () => {
  try {
    const res = await Http.get(`ideas/${route.params.id}`);
    console.log("Idea response:", res);
    ideas.content = res.data.data.content;
    ideas.title = res.data.data.title;
    ideas.categories = res.data.data.categories;
    ideas.closurename = res.data.data.closure.name;
    ideas.comments = res.data.data.comments;
    ideas.comments_count = res.data.data.comments_count;
    ideas.likes = res.data.data.likes;
    ideas.unlikes = res.data.data.unlikes;
    ideas.views_count = res.data.data.views_count;
    ideas.reports = res.data.data.reports || [];
    ideas.is_active = res.data.data.is_active; // Assign initial status
  } catch (err) {
    console.error("Error fetching idea:", err);
    if (err.response?.status === 404) {
      router.push({ name: "page-not-found" });
    }
  }
};

// Toggle idea status
const changeIdeaStatus = async () => {
  isProcessing.value = true;
  try {
    const response = await Http.get(`ideas/change-status/${route.params.id}`);
    ideas.is_active = response.data.data.is_active; // Update status reactively
    createToast(
      {
        title: "Success",
        description: `Idea ${ideas.is_active ? "restored" : "deleted"} successfully!`,
      },
      {
        type: "success",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
  } catch (error) {
    console.error("Error changing idea status:", error);
    createToast(
      {
        title: "Error",
        description: "Failed to change idea status.",
      },
      {
        type: "danger",
        transition: "bounce",
        position: "top-right",
        showIcon: true,
      }
    );
  } finally {
    isProcessing.value = false;
  }
};

onMounted(() => {
  getIdeaDetail();
});
</script>