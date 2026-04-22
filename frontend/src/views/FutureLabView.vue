<script setup>
import { onMounted, ref } from "vue";
import { api } from "../services/api.js";

const labs = ref([]);
const error = ref(null);

onMounted(async () => {
  error.value = null;
  try { labs.value = await api.getLabs(); } catch (e) { error.value = e; }
});
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">R&amp;D &amp; Prototypes</span>
        <h1>Future Lab</h1>
        <p>Experimental curricula, ethical AI tools, accessible design kits, and research-backed social impact pilots.</p>
      </div>
      <p v-if="error" class="alert">Could not load labs.</p>
      <div v-else class="grid-3">
        <article v-for="lab in labs" :key="lab.slug" class="card feature">
          <span class="tag">{{ lab.stage }}</span>
          <h3>{{ lab.title }}</h3>
          <p>{{ lab.summary }}</p>
        </article>
      </div>
    </div>
  </section>
</template>
