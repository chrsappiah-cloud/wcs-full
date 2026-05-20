<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { api } from "../services/api.js";
import { useAuthStore } from "../stores/auth.js";

const router = useRouter();
const auth = useAuthStore();

const access = ref(null);
const enrollments = ref([]);
const catalog = ref(null);
const error = ref(null);
const loading = ref(true);

const paymentLabel = computed(() => {
  const s = access.value?.paymentStatus ?? "none";
  const map = {
    paid: "Paid",
    pending: "Pending",
    failed: "Failed",
    none: "No payment on file",
  };
  return map[s] ?? s;
});

onMounted(async () => {
  if (!auth.isLoggedIn) return router.push("/login");
  error.value = null;
  loading.value = true;
  try {
    const data = await api.getMyAccess();
    access.value = data.access;
    enrollments.value = data.enrollments ?? [];
    catalog.value = data.catalog;
    if (data.access?.subscriptions?.length) {
      api.track("subscription_view", "/account", {
        count: data.access.subscriptions.length,
      });
    }
  } catch (e) {
    error.value = e?.response?.data?.error ?? "Could not load your access details.";
  } finally {
    loading.value = false;
  }
});

function statusClass(status) {
  if (status === "active") return "pill";
  if (status === "cancelled") return "pill muted";
  return "pill";
}
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">Membership</span>
        <h1>My access</h1>
        <p>Subscriptions, entitlements, and course enrolments tied to your WCS account.</p>
      </div>

      <p v-if="error" class="alert">{{ error }}</p>
      <p v-else-if="loading" class="muted">Loading…</p>

      <template v-else-if="access">
        <div class="grid-2" style="margin-bottom:24px">
          <div class="card">
            <span class="tag">Account</span>
            <h3>{{ access.name || auth.user?.name }}</h3>
            <p class="small">{{ access.email }}</p>
            <p class="small" style="margin-top:8px">
              Payment: <strong>{{ paymentLabel }}</strong>
              <span v-if="access.paymentNote"> — {{ access.paymentNote }}</span>
            </p>
          </div>
          <div class="card">
            <span class="tag">App Store</span>
            <h3>Purchase on iOS</h3>
            <p class="small">
              Subscriptions sync through the WCS Commerce app. Restore purchases after signing in on device.
            </p>
            <RouterLink
              class="btn primary"
              style="margin-top:12px;display:inline-block"
              to="/marketing?tab=app-store"
              @click="api.track('subscription_attempt', '/account', { productId: 'wcs_premium_monthly', source: 'account_cta' })"
            >
              View App Store products
            </RouterLink>
          </div>
        </div>

        <div class="card" style="margin-bottom:24px">
          <span class="tag">Subscriptions</span>
          <h3>Active products</h3>
          <div v-if="access.subscriptions?.length" class="list" style="margin-top:12px">
            <div v-for="sub in access.subscriptions" :key="sub.productId" class="result">
              <div>
                <strong>{{ sub.name }}</strong>
                <p class="small">{{ sub.priceLabel }} · {{ sub.source ?? "app" }}</p>
              </div>
              <span :class="statusClass(sub.status)">{{ sub.status }}</span>
            </div>
          </div>
          <p v-else class="muted small" style="margin-top:12px">
            No subscriptions yet. Browse products below or purchase in the WCS Commerce iOS app.
          </p>
        </div>

        <div class="grid-2" style="margin-bottom:24px">
          <div class="card">
            <span class="tag">Entitlements</span>
            <h3>Feature access</h3>
            <div v-if="access.entitlements?.length" class="list" style="margin-top:12px">
              <div v-for="ent in access.entitlements" :key="ent.code" class="result">
                <div>
                  <strong>{{ ent.code }}</strong>
                  <p v-if="ent.detail" class="small">{{ ent.detail }}</p>
                </div>
                <span :class="statusClass(ent.status)">{{ ent.status }}</span>
              </div>
            </div>
            <p v-else class="muted small" style="margin-top:12px">No entitlements active.</p>
          </div>
          <div class="card">
            <span class="tag">Features</span>
            <h3>Enabled capabilities</h3>
            <ul v-if="access.features?.length" class="small" style="margin-top:12px;padding-left:18px">
              <li v-for="f in access.features" :key="f">{{ f }}</li>
            </ul>
            <p v-else class="muted small" style="margin-top:12px">Upgrade to unlock library, courses, and iOS sync.</p>
          </div>
        </div>

        <div v-if="catalog?.products?.length" class="card" style="margin-bottom:24px">
          <span class="tag">Catalog</span>
          <h3>Available products</h3>
          <div class="grid-3" style="margin-top:12px">
            <article v-for="p in catalog.products" :key="p.productId" class="card feature">
              <span class="tag">{{ p.type }}</span>
              <h4>{{ p.name }}</h4>
              <p class="small">{{ p.priceLabel }}</p>
              <ul class="small" style="padding-left:16px;margin-top:8px">
                <li v-for="feat in p.features" :key="feat">{{ feat }}</li>
              </ul>
            </article>
          </div>
        </div>

        <div class="card">
          <span class="tag">Courses</span>
          <h3>Enrolments</h3>
          <div v-if="enrollments.length" class="list" style="margin-top:12px">
            <div v-for="e in enrollments" :key="e._id" class="result">
              <div>
                <strong>{{ e.courseSlug }}</strong>
                <p class="small">Progress {{ e.progress ?? 0 }}%</p>
              </div>
              <RouterLink class="btn" to="/my-courses">Open</RouterLink>
            </div>
          </div>
          <p v-else class="muted small" style="margin-top:12px">
            No course enrolments.
            <RouterLink to="/my-courses">Browse courses</RouterLink>
          </p>
        </div>
      </template>
    </div>
  </section>
</template>
