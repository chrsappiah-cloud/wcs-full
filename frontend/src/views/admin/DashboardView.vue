<script setup>
import { onMounted, ref } from "vue";
import { adminApi } from "../../services/api.js";

const stats = ref(null);
const error = ref(null);

onMounted(async () => {
  try { stats.value = await adminApi.getStats(); }
  catch (e) { error.value = e?.response?.data?.error ?? "Could not load analytics."; }
});
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Admin</span>
        <h1>Dashboard</h1>
        <p>Platform analytics and content counts from MongoDB.</p>
      </div>

      <p v-if="error" class="alert">{{ error }}</p>

      <template v-if="stats">
        <!-- Counts -->
        <div class="kpis" style="grid-template-columns:repeat(4,1fr)">
          <div class="card kpi"><strong>{{ stats.counts.users }}</strong><span class="small">registered users</span></div>
          <div class="card kpi"><strong>{{ stats.counts.courses }}</strong><span class="small">courses</span></div>
          <div class="card kpi"><strong>{{ stats.counts.resources }}</strong><span class="small">resources</span></div>
          <div class="card kpi"><strong>{{ stats.counts.enrollments }}</strong><span class="small">enrollments</span></div>
        </div>

        <div class="grid-2" style="margin-top:24px">
          <!-- Top pages -->
          <div class="card">
            <span class="tag">Analytics</span>
            <h3>Top pages</h3>
            <div class="list" style="margin-top:12px">
              <div v-for="p in stats.topPages" :key="p._id" class="result">
                <div><strong>{{ p._id || '/' }}</strong></div>
                <span class="pill">{{ p.count }} views</span>
              </div>
              <p v-if="!stats.topPages.length" class="muted small">No page view events yet.</p>
            </div>
          </div>

          <!-- Top searches -->
          <div class="card">
            <span class="tag">Analytics</span>
            <h3>Top search queries</h3>
            <div class="list" style="margin-top:12px">
              <div v-for="q in stats.searchQueries" :key="q._id" class="result">
                <div><strong>"{{ q._id }}"</strong></div>
                <span class="pill">{{ q.count }}×</span>
              </div>
              <p v-if="!stats.searchQueries.length" class="muted small">No search events yet.</p>
            </div>
          </div>
        </div>

        <!-- Recent events -->
        <div class="card" style="margin-top:24px">
          <span class="tag">Live feed</span>
          <h3>Recent events</h3>
          <div class="list" style="margin-top:12px">
            <div v-for="ev in stats.recentEvents" :key="ev._id" class="result">
              <div>
                <strong>{{ ev.event }}</strong>
                <span class="small"> — {{ ev.path }}</span>
                <span v-if="ev.meta?.q" class="small"> "{{ ev.meta.q }}"</span>
              </div>
              <span class="pill">{{ new Date(ev.ts).toLocaleDateString() }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
