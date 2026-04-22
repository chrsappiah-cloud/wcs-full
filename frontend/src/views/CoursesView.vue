<script setup>
import { onMounted, ref } from "vue";
import { api } from "../services/api.js";

const courses = ref([]);
const error = ref(null);

onMounted(async () => {
  error.value = null;
  try { courses.value = await api.getCourses(); } catch (e) { error.value = e; }
});
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Training catalogue</span>
        <h1>Courses</h1>
        <p>Micro-credentials, workshops, and learning products for care and community sectors.</p>
      </div>
      <p v-if="error" class="alert">Could not load courses.</p>
      <div v-else class="grid-3">
        <article v-for="c in courses" :key="c.slug" class="card feature">
          <span class="tag">{{ c.level }}</span>
          <h3>{{ c.title }}</h3>
          <p>{{ c.summary }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
