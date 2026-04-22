<script setup>
import { onMounted, ref } from "vue";
import { adminApi } from "../services/api.js";

const data    = ref(null);
const error   = ref(null);
const loading = ref(true);

async function load() {
  loading.value = true;
  error.value = null;
  try { data.value = await adminApi.getApiStatus(); }
  catch (e) { error.value = "Could not reach API status endpoint."; }
  finally { loading.value = false; }
}

onMounted(load);
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Live APIs</span>
        <h1>API status</h1>
        <p>Real-time status of every backend endpoint and its backing MongoDB collection.</p>
      </div>

      <p v-if="error" class="alert">{{ error }}</p>
      <p v-if="loading" class="muted">Checking endpoints…</p>

      <template v-if="data">
        <div class="kpis" style="grid-template-columns:repeat(2,1fr);margin-bottom:24px">
          <div class="card kpi">
            <strong style="color:var(--accent)">{{ Math.round(data.uptime) }}s</strong>
            <span class="small">server uptime</span>
          </div>
          <div class="card kpi">
            <strong style="color:#4ade80">{{ data.status.filter(e => e.status === 'live').length }} / {{ data.status.length }}</strong>
            <span class="small">endpoints live</span>
          </div>
        </div>

        <div class="list">
          <div v-for="ep in data.status" :key="ep.path" class="result">
            <div>
              <strong>{{ ep.path }}</strong>
              <p class="small">Collection: <code>{{ ep.collection }}</code> · {{ ep.count }} documents</p>
            </div>
            <span
              class="pill"
              :style="{ background: ep.status === 'live' ? 'rgba(74,222,128,.15)' : 'rgba(248,113,113,.12)', color: ep.status === 'live' ? '#4ade80' : '#f87171' }"
            >
              {{ ep.status }}
            </span>
          </div>
        </div>

        <div class="card" style="margin-top:24px">
          <span class="tag">Auth endpoints</span>
          <h3>Auth &amp; enrollment routes</h3>
          <div class="list" style="margin-top:12px">
            <div class="result"><div><strong>POST /api/v1/auth/login</strong><p class="small">Returns JWT token</p></div><span class="pill">Auth</span></div>
            <div class="result"><div><strong>POST /api/v1/auth/register</strong><p class="small">Creates user and returns JWT</p></div><span class="pill">Auth</span></div>
            <div class="result"><div><strong>GET /api/v1/auth/me</strong><p class="small">Returns current user (requires Bearer token)</p></div><span class="pill">Auth</span></div>
            <div class="result"><div><strong>POST /api/v1/enrollments</strong><p class="small">Enrol in a course (requires auth)</p></div><span class="pill">Courses</span></div>
            <div class="result"><div><strong>GET /api/v1/enrollments/mine</strong><p class="small">Your enrolments and progress</p></div><span class="pill">Courses</span></div>
            <div class="result"><div><strong>POST /api/v1/analytics/track</strong><p class="small">Log a platform event</p></div><span class="pill">Analytics</span></div>
            <div class="result"><div><strong>GET /api/admin/analytics</strong><p class="small">Aggregated stats (admin only)</p></div><span class="pill">Admin</span></div>
          </div>
        </div>

        <div style="text-align:right;margin-top:16px">
          <button class="btn" @click="load">Refresh</button>
        </div>
      </template>
    </div>
  </section>
</template>
