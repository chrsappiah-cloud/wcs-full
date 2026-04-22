<script setup>
import { onMounted, ref } from "vue";
import { adminApi } from "../../services/api.js";

const resources = ref([]);
const error     = ref(null);
const toggling  = ref(null);

async function load() {
  error.value = null;
  try { resources.value = await adminApi.getResources(); }
  catch (e) { error.value = e?.response?.data?.error ?? "Load failed."; }
}

async function toggle(item) {
  toggling.value = item._id;
  try {
    const updated = await adminApi.togglePublish(item._id);
    const idx = resources.value.findIndex(r => r._id === item._id);
    if (idx !== -1) resources.value[idx] = updated;
  } catch (e) { error.value = e?.response?.data?.error ?? "Toggle failed."; }
  finally { toggling.value = null; }
}

onMounted(load);
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Admin</span>
        <h1>Publishing</h1>
        <p>Toggle the published status of resources. Published resources are visible to the public.</p>
      </div>

      <p v-if="error" class="alert">{{ error }}</p>

      <div class="list">
        <div v-for="item in resources" :key="item._id" class="result">
          <div>
            <strong>{{ item.title }}</strong>
            <p class="small">{{ item.slug }} · {{ item.category }}</p>
          </div>
          <div style="display:flex;align-items:center;gap:12px;flex-shrink:0">
            <span class="pill" :style="{ background: item.published ? 'rgba(74,222,128,.15)' : 'rgba(248,113,113,.12)', color: item.published ? '#4ade80' : '#f87171' }">
              {{ item.published ? 'Published' : 'Draft' }}
            </span>
            <button
              class="btn"
              style="min-height:36px;padding:0 14px"
              :disabled="toggling === item._id"
              @click="toggle(item)"
            >
              {{ toggling === item._id ? '…' : item.published ? 'Unpublish' : 'Publish' }}
            </button>
          </div>
        </div>
        <p v-if="!resources.length && !error" class="muted small">No resources found.</p>
      </div>
    </div>
  </section>
</template>
