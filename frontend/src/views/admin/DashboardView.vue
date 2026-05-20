<script setup>
import { onMounted, ref } from "vue";
import { api } from "../../services/api.js";

const stats = ref(null);
const error = ref(null);

onMounted(async () => {
  try {
    stats.value = await api.getAnalyticsDashboard();
  } catch (e) {
    error.value = e?.response?.data?.error ?? "Could not load analytics.";
  }
});
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Admin</span>
        <h1>Dashboard</h1>
        <p>Quick overview — open Analytics for traffic map, sessions, and subscription attempts.</p>
      </div>

      <p v-if="error" class="alert">{{ error }}</p>

      <template v-if="stats">
        <div class="kpis" style="grid-template-columns:repeat(auto-fit, minmax(140px, 1fr))">
          <div class="card kpi"><strong>{{ stats.counts.users }}</strong><span class="small">users</span></div>
          <div class="card kpi"><strong>{{ stats.uniqueSessions }}</strong><span class="small">sessions</span></div>
          <div class="card kpi"><strong>{{ stats.pageViews }}</strong><span class="small">page views</span></div>
          <div class="card kpi"><strong>{{ stats.subscriptionAttempts }}</strong><span class="small">sub attempts</span></div>
        </div>

        <div class="card" style="margin-top:24px;display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between">
          <div>
            <span class="tag">Analytics</span>
            <h3 style="margin:8px 0 4px">Full user analytics</h3>
            <p class="small muted">World map, traffic chart, pages visited, and live event feed.</p>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px">
            <RouterLink class="btn primary" to="/admin/analytics">Analytics</RouterLink>
            <RouterLink class="btn" to="/admin/enquiries">Enquiries</RouterLink>
            <RouterLink class="btn" to="/admin/payments">Payments</RouterLink>
            <RouterLink class="btn" to="/admin/system">System</RouterLink>
          </div>
        </div>

        <div class="grid-2" style="margin-top:24px">
          <div class="card">
            <span class="tag">Top pages</span>
            <div class="list" style="margin-top:12px">
              <div v-for="p in stats.topPages.slice(0, 5)" :key="p._id" class="result">
                <div><strong>{{ p._id || "/" }}</strong></div>
                <span class="pill">{{ p.count }}</span>
              </div>
            </div>
          </div>
          <div class="card">
            <span class="tag">Recent</span>
            <div class="list" style="margin-top:12px">
              <div v-for="ev in stats.recentEvents.slice(0, 5)" :key="ev._id || ev.ts" class="result">
                <div><strong>{{ ev.event }}</strong><span class="small"> {{ ev.path }}</span></div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
