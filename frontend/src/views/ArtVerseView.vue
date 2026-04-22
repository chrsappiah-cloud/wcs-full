<script setup>
import { onMounted, ref } from "vue";
import { api } from "../services/api.js";

const collections = ref([]);
const error = ref(null);

onMounted(async () => {
  error.value = null;
  try { collections.value = await api.getArtVerse(); } catch (e) { error.value = e; }
});
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Creative scholarship</span>
        <h1>Art Verse</h1>
        <p>Digital gallery, healing media, student showcases, and therapeutic pathways connecting culture with care and education.</p>
      </div>
      <p v-if="error" class="alert">Could not load collections.</p>
      <div v-else class="grid-3">
        <article v-for="a in collections" :key="a.slug" class="card feature">
          <span class="tag">{{ a.type }}</span>
          <h3>{{ a.title }}</h3>
          <p>{{ a.summary }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
