<script setup>
import { onMounted, ref, watch } from "vue";
import { api } from "../../services/api.js";

const users = ref([]);
const records = ref([]);
const catalog = ref(null);
const selectedUserId = ref(null);
const selectedAccess = ref(null);
const error = ref(null);
const loading = ref(true);
const saving = ref(false);

const paymentStatus = ref("none");
const paymentNote = ref("");
const grantProductId = ref("wcs_premium_monthly");

async function loadOverview() {
  loading.value = true;
  error.value = null;
  try {
    const [overview, cat] = await Promise.all([
      api.adminListAccess(),
      api.getAccessCatalog(),
    ]);
    users.value = overview.users ?? [];
    records.value = overview.records ?? [];
    catalog.value = cat;
    if (!selectedUserId.value && users.value.length) {
      selectedUserId.value = String(users.value[0]._id);
    }
  } catch (e) {
    error.value = e?.response?.data?.error ?? "Could not load access records.";
  } finally {
    loading.value = false;
  }
}

async function loadUser(userId) {
  if (!userId) return;
  error.value = null;
  try {
    const data = await api.adminGetUserAccess(userId);
    selectedAccess.value = data.access;
    paymentStatus.value = data.access?.paymentStatus ?? "none";
    paymentNote.value = data.access?.paymentNote ?? "";
  } catch (e) {
    error.value = e?.response?.data?.error ?? "Could not load user access.";
  }
}

onMounted(async () => {
  await loadOverview();
  if (selectedUserId.value) await loadUser(selectedUserId.value);
});

watch(selectedUserId, (id) => {
  if (id) loadUser(id);
});

async function savePayment() {
  if (!selectedUserId.value) return;
  saving.value = true;
  error.value = null;
  try {
    const { access } = await api.adminUpdateUserAccess(selectedUserId.value, {
      paymentStatus: paymentStatus.value,
      paymentNote: paymentNote.value,
    });
    selectedAccess.value = access;
    await loadOverview();
  } catch (e) {
    error.value = e?.response?.data?.error ?? "Update failed.";
  } finally {
    saving.value = false;
  }
}

async function grant() {
  if (!selectedUserId.value || !grantProductId.value) return;
  saving.value = true;
  try {
    const { access } = await api.adminGrantSubscription(selectedUserId.value, grantProductId.value);
    selectedAccess.value = access;
    await loadOverview();
  } catch (e) {
    error.value = e?.response?.data?.error ?? "Grant failed.";
  } finally {
    saving.value = false;
  }
}

async function setSubStatus(productId, status) {
  if (!selectedUserId.value) return;
  saving.value = true;
  try {
    const { access } = await api.adminPatchSubscription(
      selectedUserId.value,
      productId,
      status
    );
    selectedAccess.value = access;
    await loadOverview();
  } catch (e) {
    error.value = e?.response?.data?.error ?? "Update failed.";
  } finally {
    saving.value = false;
  }
}

async function revoke(productId) {
  if (!selectedUserId.value) return;
  saving.value = true;
  try {
    const { access } = await api.adminRevokeSubscription(selectedUserId.value, productId);
    selectedAccess.value = access;
    await loadOverview();
  } catch (e) {
    error.value = e?.response?.data?.error ?? "Revoke failed.";
  } finally {
    saving.value = false;
  }
}

function userLabel(u) {
  return `${u.name || u.email} (${u.email})`;
}
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Admin</span>
        <h1>Access & payments</h1>
        <p>Grant subscriptions, update payment status, and manage member entitlements.</p>
      </div>

      <p v-if="error" class="alert">{{ error }}</p>
      <p v-if="loading" class="muted">Loading…</p>

      <template v-else>
        <div class="grid-2" style="margin-bottom:24px">
          <div class="card">
            <span class="tag">Members</span>
            <h3>Select user</h3>
            <select
              v-model="selectedUserId"
              class="input"
              style="width:100%;margin-top:12px"
              aria-label="Select member"
            >
              <option v-for="u in users" :key="u._id" :value="String(u._id)">
                {{ userLabel(u) }} — {{ u.role }}
              </option>
            </select>
            <p class="small muted" style="margin-top:8px">{{ records.length }} access record(s) on file</p>
          </div>

          <div class="card">
            <span class="tag">Payment</span>
            <h3>Billing status</h3>
            <label class="small" style="display:block;margin-top:12px">Status</label>
            <select v-model="paymentStatus" class="input" style="width:100%">
              <option value="none">None</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
            <label class="small" style="display:block;margin-top:12px">Note</label>
            <input v-model="paymentNote" class="input" style="width:100%" type="text" placeholder="Invoice ref, manual comp, etc." />
            <button class="btn primary" style="margin-top:12px" :disabled="saving" @click="savePayment">
              Save payment
            </button>
          </div>
        </div>

        <template v-if="selectedAccess">
          <div class="card" style="margin-bottom:24px">
            <span class="tag">Subscriptions</span>
            <h3>{{ selectedAccess.email }}</h3>
            <div v-if="selectedAccess.subscriptions?.length" class="list" style="margin-top:12px">
              <div v-for="sub in selectedAccess.subscriptions" :key="sub.productId" class="result">
                <div>
                  <strong>{{ sub.name }}</strong>
                  <p class="small">{{ sub.productId }} · {{ sub.status }}</p>
                </div>
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                  <button
                    v-if="sub.status !== 'active'"
                    class="btn"
                    :disabled="saving"
                    @click="setSubStatus(sub.productId, 'active')"
                  >
                    Activate
                  </button>
                  <button
                    v-if="sub.status === 'active'"
                    class="btn"
                    :disabled="saving"
                    @click="revoke(sub.productId)"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
            <p v-else class="muted small" style="margin-top:12px">No subscriptions for this member.</p>

            <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;align-items:center">
              <select v-model="grantProductId" class="input" aria-label="Product to grant">
                <option
                  v-for="p in catalog?.products"
                  :key="p.productId"
                  :value="p.productId"
                >
                  {{ p.name }}
                </option>
              </select>
              <button class="btn primary" :disabled="saving" @click="grant">Grant product</button>
            </div>
          </div>

          <div class="grid-2">
            <div class="card">
              <span class="tag">Entitlements</span>
              <div class="list" style="margin-top:12px">
                <div v-for="ent in selectedAccess.entitlements" :key="ent.code" class="result">
                  <strong>{{ ent.code }}</strong>
                  <span class="pill">{{ ent.status }}</span>
                </div>
                <p v-if="!selectedAccess.entitlements?.length" class="muted small">None</p>
              </div>
            </div>
            <div class="card">
              <span class="tag">Features</span>
              <ul class="small" style="margin-top:12px;padding-left:18px">
                <li v-for="f in selectedAccess.features" :key="f">{{ f }}</li>
                <li v-if="!selectedAccess.features?.length" class="muted">None enabled</li>
              </ul>
            </div>
          </div>
        </template>
      </template>
    </div>
  </section>
</template>
