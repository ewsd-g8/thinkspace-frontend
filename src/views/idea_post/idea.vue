
<!-- <template>
    <div>
      
      <div class="card">
        <div class="card-body">
          <h4> Ideas</h4>
          <ul class="list-group">
            <li
              class="list-group-item"
              v-for="idea in ideas"
              :key="idea.id"
            >
              <div class="d-flex justify-content-between">
                <div>
                  <h5>{{ idea.idea }}</h5>
                  <p class="text-muted">
                    {{ idea.category.name }} - {{ idea.created_at }}
                  </p>
                </div>
                <div>
                  <button
                    class="btn btn-sm"
                    @click="thumbUp(idea)"
                    :disabled="idea.has_thumbs_up"
                  >
                    <i class="mdi mdi-thumb-up"></i>
                  </button>
                  <button
                    class="btn btn-sm"
                    @click="thumbDown(idea)"
                    :disabled="idea.has_thumbs_down"
                  >
                    <i class="mdi mdi-thumb-down"></i>
                  </button>
                  <button
                    class="btn btn-sm"
                    @click="openComments(idea)"
                  >
                    <i class="mdi mdi-comment"></i>
                  </button>
                </div>
              </div>
              <div v-if="idea.file">
                <a :href="`/uploads/${idea.file}`" target="_blank">
                  {{ idea.file }}
                </a>
              </div>
              <hr />
              <div v-if="idea.showComments">
                <ul class="list-group">
                  <li
                    class="list-group-item"
                    v-for="comment in idea.comments"
                    :key="comment.id"
                  >
                    <div class="d-flex justify-content-between">
                      <div>
                        <p>{{ comment.comment }}</p>
                      </div>
                      <div>
                        <p class="text-muted">
                          {{ comment.created_at }}
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
                <form @submit.prevent="postComment(idea)">
                  <div class="mb-3">
                    <label for="comment" class="form-label">Comment</label>
                    <textarea
                      class="form-control"
                      id="comment"
                      rows="3"
                      v-model="form.comment"
                    ></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary">
                    Post
                  </button>
                </form>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template> -->
  <template>
    <div>
      <div class="card">
        <div class="card-body">
          <h4> Ideas</h4>
          <ul class="list-group">
            <li class="list-group-item">
              <div class="d-flex justify-content-between">
                <div>
                  <h5>Sample Idea</h5>
                  <p class="text-muted">
                    Sample Category ( Fun)
                  </p>
                </div>
                <div>
                  <button class="btn btn-sm" >
                    <i class="mdi mdi-thumb-up"></i>
                  </button>
                  <button class="btn btn-sm" >
                    <i class="mdi mdi-thumb-down"></i>
                  </button>
                  <button class="btn btn-sm" >
                    <i class="mdi mdi-comment"></i>
                  </button>
                </div>
              </div>
              <div>
                <a href="#" target="_blank">
                  sample-file.pdf
                </a>
              </div>
              <hr />
              <div>
                <ul class="list-group">
                  <li class="list-group-item">
                    <div class="d-flex justify-content-between">
                      <div>
                        <p>Sample Comment</p>
                      </div>
                      <div>
                        <p class="text-muted">
                          2023-10-01
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
                <form>
                  <div class="mb-3">
                    <label for="comment" class="form-label">Comment</label>
                    <textarea
                      class="form-control"
                      id="comment"
                      rows="3"
                      
                    ></textarea>
                  </div>
                  <button type="submit" class="btn btn-primary" >
                    Post
                  </button>
                </form>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { ref, onMounted } from "vue";
  import { Http } from "@/services/http-common";
  
  const ideas = ref([]);
  const categories = ref([]);
  const form = ref({
    idea: "",
    category_id: "",
    file: null,
    comment: "",
  });
  
  onMounted(async () => {
    const response = await Http.get("/api/ideas");
    ideas.value = response.data;
    const responseCat = await Http.get("/api/categories");
    categories.value = responseCat.data;
  });
  
  const postIdea = async () => {
    const formData = new FormData();
    formData.append("idea", form.value.idea);
    formData.append("category_id", form.value.category_id);
    if (form.value.file) formData.append("file", form.value.file);
    const response = await Http.post("/api/ideas", formData);
    ideas.value.push(response.data);
    form.value.idea = "";
    form.value.category_id = "";
    form.value.file = null;
  };
  
  const handleFileChange = (e) => {
    form.value.file = e.target.files[0];
  };
  
  const thumbUp = async (idea) => {
    const response = await Http.post(`/api/ideas/${idea.id}/thumb-up`);
    idea.has_thumbs_up = true;
    idea.thumbs_up_count = response.data.thumbs_up_count;
  };
  
  const thumbDown = async (idea) => {
    const response = await Http.post(`/api/ideas/${idea.id}/thumb-down`);
    idea.has_thumbs_down = true;
    idea.thumbs_down_count = response.data.thumbs_down_count;
  };
  
  const openComments = (idea) => {
    idea.showComments = !idea.showComments;
  };
  
  const postComment = async (idea) => {
    const response = await Http.post(
      `/api/ideas/${idea.id}/comments`,
      idea.comments
    );
    idea.comments.push(response.data);
    form.value.comment = "";
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