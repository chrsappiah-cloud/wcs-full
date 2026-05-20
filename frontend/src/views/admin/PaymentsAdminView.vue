<script setup>
import { onMounted, ref } from "vue";
import { api } from "../../services/api.js";

const dash = ref(null);
const error = ref(null);
const loading = ref(true);
const activating = ref(false);
const recording = ref(false);

const recordForm = ref({
  userId: "",
  provider: "bank_transfer",
  productId: "wcs_premium_monthly",
  status: "paid",
  amount: "",
  note: "",
});

onMounted(load);

async function load() {
  loading.value = true;
  error.value = null;
  try {
    dash.value = await api.getPaymentsDashboard();
    if (dash.value.accessRecords?.[0] && !recordForm.value.userId) {
      recordForm.value.userId = String(dash.value.accessRecords[0].userId);
    }
  } catch (e) {
    error.value = e?.response?.data?.error ?? "Could not load payments dashboard.";
  } finally {
    loading.value = false;
  }
}

async function activateAll() {
  activating.value = true;
  error.value = null;
  try {
    await api.activatePaymentIntegrations();
    await load();
  } catch (e) {
    error.value = e?.response?.data?.error ?? "Activation failed.";
  } finally {
    activating.value = false;
  }
}

async function recordPayment() {
  if (!recordForm.value.userId) return;
  recording.value = true;
  try {
    await api.recordPaymentEvent({
      ...recordForm.value,
      amount: recordForm.value.amount ? Number(recordForm.value.amount) : null,
    });
    await load();
    recordForm.value.note = "";
  } catch (e) {
    error.value = e?.response?.data?.error ?? "Could not record payment.";
  } finally {
    recording.value = false;
  }
}

function integrationState(service) {
  const i = dash.value?.integrations?.find((x) => x.service === service);
  return i?.state ?? "unknown";
}
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Admin</span>
        <h1>Payments & financial systems</h1>
        <p>
          Apple In-App Purchase / Apple Pay (via WCS commerce), manual bank transfers, and future card billing.
          Mode: <span class="pill">{{ dash?.commerceMode ?? "…" }}</span>
        </p>
      </div>

      <p v-if="error" class="alert">{{ error }}</p>
      <p v-else-if="loading" class="muted">Loading…</p>

      <template v-else-if="dash">
        <div class="card" style="margin-bottom:24px">
          <span class="tag">Integrations</span>
          <h3>Activate payment rails</h3>
          <p class="small muted">
            Connects Apple Server API, database, and middleware on the commerce backend
            <span v-if="dash.commerceBaseUrl"> ({{ dash.commerceBaseUrl }})</span>.
          </p>
          <button
            class="btn primary"
            style="margin-top:12px"
            :disabled="activating || !dash.commerceBaseUrl"
            @click="activateAll"
          >
            {{ activating ? "Activating…" : "Activate all integrations" }}
          </button>
          <p v-if="!dash.commerceBaseUrl" class="hint-box small" style="margin-top:12px">
            Set <code>WCS_COMMERCE_BASE_URL</code> on Vercel to enable live Apple commerce control.
          </p>
        </div>

        <div class="grid-2" style="margin-bottom:24px">
          <div v-for="p in dash.providers" :key="p.id" class="card">
            <span class="tag">{{ p.type }}</span>
            <h4>{{ p.name }}</h4>
            <p class="small">{{ p.description }}</p>
            <span v-if="p.statusField" class="pill" style="margin-top:8px">
              {{ p.statusField }}: {{ integrationState(p.statusField) }}
            </span>
            <span v-if="p.id === 'card_stripe'" class="pill" style="margin-top:8px">
              {{ p.configured ? "Stripe configured" : "Stripe not configured" }}
            </span>
          </div>
        </div>

        <div class="grid-2" style="margin-bottom:24px">
          <div class="card">
            <span class="tag">Apple transactions</span>
            <h3>Recent StoreKit / commerce events</h3>
            <div class="list" style="margin-top:12px">
              <div v-for="tx in dash.transactions.slice(0, 10)" :key="tx.id" class="result">
                <div>
                  <strong>{{ tx.id?.slice(0, 8) }}…</strong>
                  <p class="small">{{ tx.source }} · {{ tx.ingested_at }}</p>
                </div>
              </div>
              <p v-if="!dash.transactions.length" class="muted small">No transactions from commerce API yet.</p>
            </div>
          </div>

          <div class="card">
            <span class="tag">Manual payment</span>
            <h3>Record bank / invoice payment</h3>
            <form style="margin-top:12px;display:flex;flex-direction:column;gap:12px" @submit.prevent="recordPayment">
              <input v-model="recordForm.userId" class="input" placeholder="User ID" required />
              <select v-model="recordForm.provider" class="input">
                <option value="bank_transfer">Bank transfer</option>
                <option value="apple_iap">Apple IAP (manual reconcile)</option>
                <option value="card_stripe">Card / Stripe</option>
              </select>
              <select v-model="recordForm.productId" class="input">
                <option v-for="pr in dash.products" :key="pr.productId" :value="pr.productId">
                  {{ pr.name }}
                </option>
              </select>
              <select v-model="recordForm.status" class="input">
                <option v-for="s in dash.paymentStatuses" :key="s" :value="s">{{ s }}</option>
              </select>
              <input v-model="recordForm.amount" class="input" type="number" step="0.01" placeholder="Amount (AUD)" />
              <input v-model="recordForm.note" class="input" placeholder="Invoice / reference note" />
              <button class="btn primary" type="submit" :disabled="recording">
                {{ recording ? "Saving…" : "Record & sync access" }}
              </button>
            </form>
          </div>
        </div>

        <div class="card">
          <span class="tag">Member billing</span>
          <h3>Access records (payment status)</h3>
          <p class="small muted">
            Full grant/revoke controls on
            <RouterLink to="/admin/access">Access & payments</RouterLink>.
          </p>
          <div class="list" style="margin-top:12px">
            <div v-for="r in dash.accessRecords" :key="r.userId" class="result">
              <div>
                <strong>{{ r.email }}</strong>
                <p class="small">Payment: {{ r.paymentStatus }} · {{ r.subscriptions?.length ?? 0 }} subs</p>
              </div>
              <span class="pill">{{ r.paymentStatus }}</span>
            </div>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
