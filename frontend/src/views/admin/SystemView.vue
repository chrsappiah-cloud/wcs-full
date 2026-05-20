<script setup>
import { onMounted, ref } from "vue";
import { api } from "../../services/api.js";

const status = ref(null);
const error = ref(null);
const message = ref(null);
const busy = ref(false);

onMounted(load);

async function load() {
  error.value = null;
  try {
    status.value = await api.getAdminSystem();
  } catch (e) {
    error.value = e?.response?.data?.error ?? "Could not load system status.";
  }
}

async function run(fn, label) {
  busy.value = true;
  message.value = null;
  error.value = null;
  try {
    const res = await fn();
    message.value = `${label}: ${res.ok !== false ? "OK" : res.error || "Failed"}`;
    await load();
  } catch (e) {
    error.value = e?.response?.data?.error ?? `${label} failed.`;
  } finally {
    busy.value = false;
  }
}
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Admin</span>
        <h1>System configuration</h1>
        <p>Activate JWT, email, MongoDB, and payment integrations. Add API keys via <code>backend/.env.production</code> then <code>npm run sync:vercel</code>.</p>
      </div>

      <p v-if="error" class="alert">{{ error }}</p>
      <p v-if="message" class="hint-box">{{ message }}</p>

      <div class="card" style="margin-bottom:24px">
        <span class="tag">Activate</span>
        <h3>Run service checks</h3>
        <p class="small muted">Tests email (if RESEND/SMTP configured), database ping, and commerce integrations.</p>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">
          <button class="btn primary" :disabled="busy" @click="run(() => api.activateAdminServices(), 'Activate all')">
            Activate all services
          </button>
          <button class="btn" :disabled="busy" @click="run(() => api.testAdminEmail(), 'Test email')">
            Test email
          </button>
          <button class="btn" :disabled="busy" @click="run(() => api.testAdminDatabase(), 'Database')">
            Test database
          </button>
        </div>
      </div>

      <template v-if="status">
        <div class="grid-2">
          <div class="card">
            <span class="tag">Authentication</span>
            <h3>JWT</h3>
            <p class="small">
              <span class="pill">{{ status.jwt.configured ? "Active" : "Missing" }}</span>
              Expires: {{ status.jwt.expiresIn }}
            </p>
          </div>

          <div class="card">
            <span class="tag">Database</span>
            <h3>MongoDB</h3>
            <p class="small">
              <span class="pill">{{ status.database.configured ? "URI set" : "Fallback mode" }}</span>
              Runtime: {{ status.database.mode }}
            </p>
            <p v-if="!status.database.configured" class="hint-box small" style="margin-top:12px">
              Add <code>MONGODB_URI</code> (Atlas) to Vercel — see <code>backend/.env.production.example</code>.
            </p>
          </div>

          <div class="card">
            <span class="tag">Email</span>
            <h3>Outbound mail</h3>
            <p class="small">
              <span class="pill">{{ status.email.enabled ? "Active" : "Inactive" }}</span>
              Provider: {{ status.email.provider }}
            </p>
            <ul class="small" style="margin-top:8px;padding-left:18px">
              <li>From: {{ status.email.from }}</li>
              <li>Notify: {{ status.email.notifyEmail }}</li>
            </ul>
            <p v-if="!status.email.enabled" class="hint-box small" style="margin-top:12px">
              Add <code>RESEND_API_KEY</code> from resend.com to Vercel, then redeploy and click <strong>Test email</strong>.
            </p>
          </div>

          <div class="card">
            <span class="tag">Commerce</span>
            <h3>Apple / payments</h3>
            <p class="small">
              <span class="pill">{{ status.commerce.configured ? "Connected" : "Simulation" }}</span>
            </p>
            <RouterLink class="btn" to="/admin/payments" style="margin-top:12px;display:inline-block">
              Payments console
            </RouterLink>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
