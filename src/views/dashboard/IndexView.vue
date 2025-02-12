<template>
  <div>
    <div class="card">
      <div class="card-body">
        <h1>Dashboard Page</h1>

     
   <table class="table">
          <thead>
            <tr>
              <th>Department</th>
              <th>Idea</th>
              <th>Category</th>
              <th>Submitted By</th>
              <th>Date Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <!-- <tbody>
            <tr v-for="idea in ideas" :key="idea.id">
              <td>{{ idea.id }}</td>
              <td>{{ idea.title }}</td>
              <td>{{ idea.category }}</td>
              <td>{{ idea.submittedBy }}</td>
              <td>{{ idea.dateSubmitted }}</td>
            </tr>
          </tbody> -->

          <!-- test idea table -->
          <tbody>
<td>Finance</td>
<td>Testing page</td>
<td>Fun</td>
<td>Tester</td>
<td>21.2.2025</td>
<td><a href="">Delete</a>  |  <a href="">Details</a></td>
          </tbody>
          <tbody>
<td>Finance</td>
<td>Testing page</td>
<td>Fun</td>
<td>Tester</td>
<td>21.2.2025</td>
<td><a href="">Delete</a>  |  <a href="">Details</a></td>
          </tbody>
          <tbody>
<td>Finance</td>
<td>Testing page</td>
<td>Fun</td>
<td>Tester</td>
<td>21.2.2025</td>
<td><a href="">Delete</a>  |  <a href="">Details</a></td>
          </tbody>
          <tbody>
<td>Finance</td>
<td>Testing page</td>
<td>Fun</td>
<td>Tester</td>
<td>21.2.2025</td>
<td><a href="">Delete</a>  |   <a href="">Details</a></td>
          </tbody>
          <tbody>
<td>Finance</td>
<td>Testing page</td>
<td>Fun</td>
<td>Tester</td>
<td>21.2.2025</td>
<td><a href="">Delete</a>  |  <a href="">Details</a></td>
          </tbody>
        </table>
        <!-- <div class="mt-3">
          <h3>Add Category</h3>
          <input type="text" v-model="newCategory" placeholder="Enter category" />
          <button @click="addCategory" class="btn btn-success mt-2">Add Category</button>
        </div> -->

        <!-- cataegory lisat -->
       <table class="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Submitted By</th>
              <th>Applied Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <!-- <tbody>
            <tr v-for="idea in ideas" :key="idea.id">
              <td>{{ idea.id }}</td>
              <td>{{ idea.title }}</td>
              <td>{{ idea.category }}</td>
              <td>{{ idea.submittedBy }}</td>
              <td>{{ idea.dateSubmitted }}</td>
            </tr>
          </tbody> -->

          <!-- test idea table -->
          <tbody>
<td>Fun</td>
<td>21.2.2025</td>
<td>21.3.2025</td>
<td>QA Manager</td>
<td>13</td>

<td><a href="">Delete</a>  |  <a href="">Details</a></td>
          </tbody>
          <tbody>
            <td>Fun</td>
<td>21.2.2025</td>
<td>21.3.2025</td>
<td>QA Manager</td>
<td>13</td>

<td><a href="">Delete</a>  |  <a href="">Details</a></td>
          </tbody>
          <tbody>
            <td>Fun</td>
<td>21.2.2025</td>
<td>21.3.2025</td>
<td>QA Manager</td>
<td>13</td>

<td><a href="">Delete</a>  |  <a href="">Details</a></td>
          </tbody>
          <tbody>
            <td>Fun</td>
<td>21.2.2025</td>
<td>21.3.2025</td>
<td>QA Manager</td>
<td>13</td>

<td><a href="">Delete</a>  |  <a href="">Details</a></td>
          </tbody>
          <tbody>
            <td>Fun</td>
<td>21.2.2025</td>
<td>21.3.2025</td>
<td>QA Manager</td>
<td>13</td>

<td><a href="">Delete</a>  |  <a href="">Details</a></td>
          </tbody>
        </table> 
<!-- 
<script setup>
import { ref, onMounted } from 'vue';
import { Http } from '@/services/http-common';

const ideas = ref([]);
const newCategory = ref('');

onMounted(async () => {
  const response = await Http.get('/api/ideas');
  ideas.value = response.data;
});

const addCategory = async () => {
  if (newCategory.value.trim() === '') return;

  await Http.post('/api/categories', { name: newCategory.value });
  newCategory.value = '';
  // Optionally, fetch ideas again if they depend on categories
};
</script> -->

      </div>
    </div>
  </div>
</template>
