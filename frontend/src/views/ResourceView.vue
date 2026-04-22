<script setup>
import { onMounted, ref, watch } from "vue";
import { api } from "../services/api.js";

const props = defineProps({ slug: { type: String, required: true } });

const doc = ref(null);
const error = ref(null);

async function load() {
  error.value = null;
  doc.value = null;
  try { doc.value = await api.getResource(props.slug); } catch (e) { error.value = e; }
}

onMounted(load);
watch(() => props.slug, load);
</script>

<template>
  <section class="section">
    <div class="container narrow">
      <p v-if="error" class="alert">Resource not found or API unavailable.</p>

      <template v-else-if="doc">
        <span class="eyebrow">{{ doc.category || 'Resource' }}</span>
        <h1>{{ doc.title }}</h1>
        <p class="lede" style="font-size:1.1rem;color:var(--muted);">{{ doc.summary }}</p>
        <div class="card" style="margin-top:24px;">
          <p style="white-space:pre-line;">{{ doc.body }}</p>
        </div>
      </template>

      <p v-else class="muted">Loading…</p>
    </div>
  </section>
</template>
