<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api } from "../services/api.js";
import {
  appleStoreServices,
  buildBetaManifest,
  buildReferralLink,
  digitalArtworks,
  downloadBetaManifest,
  findApp,
  founderProfile,
  iosApps,
  marketingTabs,
  podcasts,
  resolveAttribution,
  socialChannels,
  storeProducts,
} from "../config/marketingPortal.js";

const route = useRoute();
const router = useRouter();
const copiedKey = ref(null);
const commerce = ref(null);
const commerceError = ref(null);
const commerceLoading = ref(true);

const selectedSlug = computed(() => route.params.appSlug ?? null);
const selectedApp = computed(() => (selectedSlug.value ? findApp(selectedSlug.value) : null));
const attribution = computed(() => resolveAttribution(route.query));

const activeTab = computed({
  get: () => {
    const tab = route.query.tab;
    return marketingTabs.some((t) => t.id === tab) ? tab : "apps";
  },
  set: (tab) => {
    router.replace({ query: { ...route.query, tab } });
  },
});

const headline = computed(() => {
  if (selectedApp.value) return selectedApp.value.name;
  if (activeTab.value === "testflight") return "TestFlight beta downloads";
  if (activeTab.value === "app-store") return "App Store & Apple purchase";
  return "Dr Christopher Appiah-Thompson — iOS apps";
});

async function copyLink(key, text) {
  try {
    await navigator.clipboard.writeText(text);
    copiedKey.value = key;
    setTimeout(() => {
      if (copiedKey.value === key) copiedKey.value = null;
    }, 2000);
  } catch {
    copiedKey.value = "error";
  }
}

function setTab(tabId) {
  activeTab.value = tabId;
}

async function loadCommerce() {
  commerceLoading.value = true;
  commerceError.value = null;
  try {
    commerce.value = await api.getAppleCommerce();
  } catch {
    commerceError.value = "Commerce API unavailable. Configure WCS_COMMERCE_BASE_URL on the server.";
  } finally {
    commerceLoading.value = false;
  }
}

function downloadFromApi() {
  const blob = new Blob([JSON.stringify(buildBetaManifest(), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "wcs-ios-beta-manifest.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

onMounted(loadCommerce);
watch(() => route.query.tab, () => {
  if (activeTab.value === "app-store" && !commerce.value) loadCommerce();
});
</script>

<template>
  <div class="marketing-portal">
    <section class="hero marketing-hero">
      <div class="container hero-grid">
        <div>
          <span class="eyebrow">World Class Scholars · iOS</span>
          <h1>{{ headline }}</h1>
          <p>
            Connect with
            <a :href="founderProfile.profileUrl" target="_blank" rel="noopener noreferrer" class="accent-link">
              {{ founderProfile.profileUrl.replace("https://", "") }}
            </a>
            — TestFlight betas, App Store purchases, and social referral campaigns.
          </p>
          <p v-if="selectedApp && attribution.ref !== 'direct'" class="attribution-banner">
            Referral: <strong>{{ attribution.ref }}</strong>
          </p>
          <div class="hero-actions">
            <RouterLink v-if="selectedApp" class="btn" to="/marketing">All apps</RouterLink>
            <RouterLink class="btn" to="/about">{{ founderProfile.name }}</RouterLink>
            <a class="btn primary" href="mailto:christopher.appiahthompson@myworldclass.org">Email Christopher</a>
          </div>
        </div>
        <aside class="card founder-card">
          <img :src="founderProfile.avatar" :alt="founderProfile.name" class="founder-card-avatar" />
          <h3>{{ founderProfile.name }}</h3>
          <p class="small">{{ founderProfile.title }}</p>
          <p class="small">{{ founderProfile.location }} · {{ founderProfile.phone }}</p>
          <a :href="`mailto:${founderProfile.email}`" class="accent-link small">{{ founderProfile.email }}</a>
        </aside>
      </div>
    </section>

    <section class="section marketing-tabs-section">
      <div class="container">
        <nav class="marketing-tabs" aria-label="Marketing sections">
          <button
            v-for="tab in marketingTabs"
            :key="tab.id"
            type="button"
            class="marketing-tab"
            :class="{ active: activeTab === tab.id }"
            @click="setTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>
    </section>

    <!-- Tab: Apps & referrals -->
    <section v-show="activeTab === 'apps' && !selectedApp" class="section">
      <div class="container">
        <div class="section-head">
          <h2>Promotional iOS apps</h2>
          <p class="lede">Share trackable links on @chrsappiah, LinkedIn, or YouTube before testers install.</p>
        </div>
        <div class="marketing-app-grid">
          <article v-for="app in iosApps" :key="app.slug" class="card marketing-app-card">
            <div class="marketing-app-accent" :style="{ background: app.accent }" />
            <h3>{{ app.name }}</h3>
            <p class="small">{{ app.tagline }}</p>
            <div class="marketing-app-actions">
              <RouterLink class="btn primary" :to="`/marketing/${app.slug}`">Referral kit</RouterLink>
              <a v-if="app.testFlightUrl" class="btn" :href="app.testFlightUrl" target="_blank" rel="noopener noreferrer">TestFlight</a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section v-if="activeTab === 'apps' && selectedApp" class="section">
      <div class="container">
        <div class="section-head">
          <RouterLink to="/marketing" class="accent-link small">&larr; All apps</RouterLink>
          <h2>{{ selectedApp.name }}</h2>
          <p class="lede">{{ selectedApp.description }}</p>
        </div>
        <div class="grid-2 marketing-detail-grid">
          <article class="card">
            <h3>Install beta</h3>
            <p class="small"><code>{{ selectedApp.bundleId }}</code></p>
            <div class="hero-actions">
              <a v-if="selectedApp.testFlightUrl" class="btn primary" :href="selectedApp.testFlightUrl" target="_blank" rel="noopener noreferrer">Join TestFlight</a>
              <a class="btn" :href="selectedApp.appStoreSearchUrl" target="_blank" rel="noopener noreferrer">Search App Store</a>
            </div>
          </article>
          <article class="card">
            <h3>Social referral links</h3>
            <div class="referral-list">
              <div v-for="channel in socialChannels" :key="channel.id" class="referral-row">
                <strong>{{ channel.label }}</strong>
                <span class="small">{{ channel.handle }}</span>
                <div class="referral-row-actions">
                  <code class="referral-url">{{ buildReferralLink(selectedApp.slug, channel.id) }}</code>
                  <button type="button" class="btn" @click="copyLink(`${selectedApp.slug}-${channel.id}`, buildReferralLink(selectedApp.slug, channel.id))">
                    {{ copiedKey === `${selectedApp.slug}-${channel.id}` ? "Copied" : "Copy" }}
                  </button>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Tab: TestFlight beta -->
    <section v-show="activeTab === 'testflight'" class="section">
      <div class="container">
        <div class="section-head">
          <h2>Download TestFlight beta data</h2>
          <p class="lede">
            Export a JSON manifest with bundle IDs, invite links, referral URLs, and product IDs for campaign tooling.
          </p>
        </div>
        <div class="card" style="margin-bottom:24px">
          <div class="hero-actions">
            <button type="button" class="btn primary" @click="downloadBetaManifest()">Download beta manifest (JSON)</button>
            <button type="button" class="btn" @click="downloadFromApi">Refresh from live API</button>
            <a class="btn" href="https://testflight.apple.com/" target="_blank" rel="noopener noreferrer">Open TestFlight app</a>
          </div>
          <p class="small" style="margin-top:12px">
            API endpoint: <code>GET /api/v1/commerce/beta-manifest</code>
          </p>
        </div>
        <div class="marketing-app-grid">
          <article v-for="app in iosApps" :key="app.slug" class="card">
            <h3>{{ app.name }}</h3>
            <p class="small"><code>{{ app.bundleId }}</code></p>
            <div class="hero-actions">
              <a v-if="app.testFlightUrl" class="btn primary" :href="app.testFlightUrl" target="_blank" rel="noopener noreferrer">Install beta</a>
              <span v-else class="pill">Public link pending</span>
              <RouterLink class="btn" :to="`/marketing/${app.slug}`">Referrals</RouterLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Tab: App Store purchase -->
    <section v-show="activeTab === 'app-store'" class="section">
      <div class="container">
        <div class="section-head">
          <h2>Purchase through the App Store</h2>
          <p class="lede">
            WCS Commerce uses StoreKit and the App Store Server API. Buy in-app; entitlements sync to the WCS backend.
          </p>
        </div>

        <div class="grid-3" style="margin-bottom:28px">
          <a
            v-for="service in appleStoreServices"
            :key="service.id"
            :href="service.url"
            target="_blank"
            rel="noopener noreferrer"
            class="card feature apple-service-card"
          >
            <h3>{{ service.label }}</h3>
            <p class="small">{{ service.description }}</p>
            <span class="accent-link small">{{ service.action }} &rarr;</span>
          </a>
        </div>

        <div class="section-head">
          <h3>StoreKit products (WCS Commerce)</h3>
        </div>
        <div class="list" style="margin-bottom:28px">
          <div v-for="product in storeProducts" :key="product.productId" class="result">
            <div>
              <strong>{{ product.name }}</strong>
              <p class="small">{{ product.type }} · <code>{{ product.productId }}</code> · {{ product.entitlement }}</p>
            </div>
            <span class="pill">In-app purchase</span>
          </div>
        </div>

        <div class="section-head">
          <h3>Apple commerce API (live)</h3>
        </div>
        <p v-if="commerceLoading" class="muted">Connecting to WCS commerce backend…</p>
        <p v-else-if="commerceError" class="alert">{{ commerceError }}</p>
        <template v-else-if="commerce">
          <div class="kpis" style="grid-template-columns:repeat(2,1fr);margin-bottom:20px">
            <div class="card kpi">
              <strong :style="{ color: commerce.configured ? '#4ade80' : 'var(--muted)' }">
                {{ commerce.configured ? "Connected" : "Simulation" }}
              </strong>
              <span class="small">WCS commerce backend</span>
            </div>
            <div class="card kpi">
              <strong>{{ commerce.endpoints?.length ?? 0 }}</strong>
              <span class="small">Apple Server API routes</span>
            </div>
          </div>
          <p v-if="commerce.commerceBaseUrl" class="small">
            Base URL: <code>{{ commerce.commerceBaseUrl }}</code>
          </p>
          <div class="list">
            <div v-for="ep in commerce.endpoints" :key="ep.path" class="result">
              <div>
                <strong>{{ ep.method }} {{ ep.path }}</strong>
                <p class="small">{{ ep.purpose }}</p>
              </div>
              <a
                v-if="commerce.commerceBaseUrl"
                class="btn"
                :href="`${commerce.commerceBaseUrl}${ep.path}`"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open
              </a>
              <span v-else class="pill">Configure URL</span>
            </div>
          </div>
          <p v-if="commerce.live?.health" class="small" style="margin-top:16px">
            System health: {{ commerce.live.health.health?.backend ?? "—" }} /
            {{ commerce.live.health.health?.middleware ?? "—" }}
          </p>
        </template>

        <div class="marketing-app-grid" style="margin-top:28px">
          <article v-for="app in iosApps" :key="app.slug" class="card">
            <h3>{{ app.name }}</h3>
            <a class="btn primary" :href="app.appStoreSearchUrl" target="_blank" rel="noopener noreferrer">Find on App Store</a>
            <a v-if="app.testFlightUrl" class="btn" :href="app.testFlightUrl" target="_blank" rel="noopener noreferrer" style="margin-top:8px">TestFlight beta</a>
          </article>
        </div>
      </div>
    </section>

    <!-- Founder links (all tabs) -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <h2>{{ founderProfile.name }} — connect</h2>
        </div>
        <div class="social-links marketing-social-grid">
          <a v-for="channel in socialChannels" :key="channel.url" :href="channel.url" target="_blank" rel="noopener noreferrer" class="social-chip">
            <span class="social-icon">{{ channel.icon }}</span>
            <span class="social-label">{{ channel.label }}</span>
            <span class="social-handle">{{ channel.handle }}</span>
          </a>
        </div>
        <div class="works-grid" style="margin-top:24px">
          <a v-for="work in digitalArtworks" :key="work.url" :href="work.url" target="_blank" rel="noopener noreferrer" class="card work-card">
            <span class="tag">{{ work.category }}</span>
            <strong>{{ work.label }}</strong>
          </a>
        </div>
        <ul class="podcast-list" style="margin-top:24px">
          <li v-for="pod in podcasts" :key="pod.url">
            <a :href="pod.url" target="_blank" rel="noopener noreferrer" class="accent-link">{{ pod.label }}</a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
