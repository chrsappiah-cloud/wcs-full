<script setup>
import { computed, onMounted, ref } from "vue";
import { api } from "../../services/api.js";
import WorldMapChart from "../../components/WorldMapChart.vue";

const data = ref(null);
const error = ref(null);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    data.value = await api.getAnalyticsDashboard();
  } catch (e) {
    error.value = e?.response?.data?.error ?? "Could not load analytics dashboard.";
  } finally {
    loading.value = false;
  }
});

const maxTraffic = computed(() =>
  Math.max(1, ...(data.value?.trafficSeries?.map((d) => d.count) ?? [1]))
);

function formatEvent(ev) {
  const parts = [ev.event, ev.path];
  if (ev.meta?.productId) parts.push(ev.meta.productId);
  if (ev.meta?.q) parts.push(`"${ev.meta.q}"`);
  return parts.filter(Boolean).join(" · ");
}

function eventLabel(id) {
  const labels = {
    page_view: "Page views",
    search: "Searches",
    subscription_attempt: "Subscription attempts",
    login: "Sign-ins",
    enroll: "Enrolments",
    click: "Clicks",
  };
  return labels[id] ?? id;
}
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Admin</span>
        <h1>User analytics</h1>
        <p>
          Traffic, sessions, page visits, subscription attempts, and visitor locations.
          <span v-if="data?.mode === 'fallback'" class="pill" style="margin-left:8px">Demo data</span>
          <span v-else-if="data?.mode === 'live'" class="pill" style="margin-left:8px">Live</span>
        </p>
      </div>

      <p v-if="error" class="alert">{{ error }}</p>
      <p v-else-if="loading" class="muted">Loading analytics…</p>

      <template v-else-if="data">
        <div class="kpis" style="grid-template-columns:repeat(auto-fit, minmax(140px, 1fr))">
          <div class="card kpi">
            <strong>{{ data.counts.users }}</strong>
            <span class="small">registered users</span>
          </div>
          <div class="card kpi">
            <strong>{{ data.uniqueSessions }}</strong>
            <span class="small">unique sessions</span>
          </div>
          <div class="card kpi">
            <strong>{{ data.pageViews }}</strong>
            <span class="small">page views</span>
          </div>
          <div class="card kpi">
            <strong>{{ data.subscriptionAttempts }}</strong>
            <span class="small">subscription attempts</span>
          </div>
          <div class="card kpi">
            <strong>{{ data.totalEvents }}</strong>
            <span class="small">total events</span>
          </div>
          <div class="card kpi">
            <strong>{{ data.counts.enrollments }}</strong>
            <span class="small">enrolments</span>
          </div>
        </div>

        <div class="card" style="margin-top:24px">
          <span class="tag">Geography</span>
          <h3>Visitors on the world map</h3>
          <p class="small muted">Marker size reflects event volume per country (from edge IP geolocation).</p>
          <WorldMapChart :markers="data.mapMarkers" />
        </div>

        <div class="grid-2" style="margin-top:24px">
          <div class="card">
            <span class="tag">Traffic</span>
            <h3>Events by day</h3>
            <div class="traffic-chart" style="margin-top:16px">
              <div
                v-for="day in data.trafficSeries"
                :key="day._id"
                class="traffic-bar-col"
                :title="`${day._id}: ${day.count} events`"
              >
                <div
                  class="traffic-bar"
                  :style="{ height: `${(day.count / maxTraffic) * 100}%` }"
                />
                <span class="traffic-label">{{ day._id.slice(5) }}</span>
              </div>
            </div>
            <p v-if="!data.trafficSeries.length" class="muted small">No traffic data yet.</p>
          </div>

          <div class="card">
            <span class="tag">Actions</span>
            <h3>Event breakdown</h3>
            <div class="list" style="margin-top:12px">
              <div v-for="e in data.eventBreakdown" :key="e._id" class="result">
                <div><strong>{{ eventLabel(e._id) }}</strong></div>
                <span class="pill">{{ e.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="grid-2" style="margin-top:24px">
          <div class="card">
            <span class="tag">Pages</span>
            <h3>Top pages visited</h3>
            <div class="list" style="margin-top:12px">
              <div v-for="p in data.topPages" :key="p._id" class="result">
                <div><strong>{{ p._id || "/" }}</strong></div>
                <span class="pill">{{ p.count }} views</span>
              </div>
              <p v-if="!data.topPages.length" class="muted small">No page views recorded.</p>
            </div>
          </div>

          <div class="card">
            <span class="tag">Subscriptions</span>
            <h3>Subscription attempts</h3>
            <div class="list" style="margin-top:12px">
              <div
                v-for="(s, i) in data.subscriptionAttemptsList"
                :key="i"
                class="result"
              >
                <div>
                  <strong>{{ s.productId || "Unknown product" }}</strong>
                  <p class="small">{{ s.path }} · {{ s.country || "—" }}</p>
                </div>
                <span class="pill">{{ new Date(s.ts).toLocaleDateString() }}</span>
              </div>
              <p v-if="!data.subscriptionAttemptsList?.length" class="muted small">No attempts yet.</p>
            </div>
          </div>
        </div>

        <div class="grid-2" style="margin-top:24px">
          <div class="card">
            <span class="tag">Search</span>
            <h3>Top library searches</h3>
            <div class="list" style="margin-top:12px">
              <div v-for="q in data.topSearches" :key="q._id" class="result">
                <div><strong>"{{ q._id }}"</strong></div>
                <span class="pill">{{ q.count }}×</span>
              </div>
              <p v-if="!data.topSearches?.length" class="muted small">No searches yet.</p>
            </div>
          </div>

          <div class="card">
            <span class="tag">User actions</span>
            <h3>Recent sign-ins, enrolments & attempts</h3>
            <div class="list" style="margin-top:12px">
              <div v-for="(a, i) in data.recentActions" :key="i" class="result">
                <div>
                  <strong>{{ a.event }}</strong>
                  <p class="small">{{ a.path }} · {{ a.country || "—" }}</p>
                </div>
                <span class="pill">{{ new Date(a.ts).toLocaleDateString() }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card" style="margin-top:24px">
          <span class="tag">Live feed</span>
          <h3>Recent events</h3>
          <div class="list" style="margin-top:12px">
            <div v-for="ev in data.recentEvents" :key="ev._id || ev.ts" class="result">
              <div>
                <strong>{{ formatEvent(ev) }}</strong>
                <p v-if="ev.geo?.country" class="small">{{ ev.geo.country }}{{ ev.geo.city ? ` · ${ev.geo.city}` : "" }}</p>
              </div>
              <span class="pill">{{ new Date(ev.ts).toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
