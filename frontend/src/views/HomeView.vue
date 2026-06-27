<script setup>
import { onMounted, ref } from "vue";
import { api } from "../services/api.js";
import { founderProfile, iosApps, podcasts, socialChannels } from "../config/marketingPortal.js";
import { featuredResourcesFallback } from "../config/featuredResources.js";
import FounderContactLinks from "../components/FounderContactLinks.vue";

const featured = ref([]);
const usingFallback = ref(false);

onMounted(async () => {
  usingFallback.value = false;
  try {
    featured.value = await api.getFeaturedResources();
    if (!featured.value?.length) {
      featured.value = featuredResourcesFallback;
      usingFallback.value = true;
    }
  } catch {
    featured.value = featuredResourcesFallback;
    usingFallback.value = true;
  }
});
</script>

<template>
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <span class="eyebrow">Dr Christopher Appiah-Thompson · Australia</span>
        <h1>World Class Scholars</h1>
        <p>
          Equity, dignity, and social justice in disability, mental health, and dementia care —
          through consultancy, courses, digital art, podcasts, and iOS apps you can try on TestFlight today.
        </p>
        <div class="hero-actions">
          <RouterLink class="btn primary" to="/marketing">iOS apps &amp; App Store</RouterLink>
          <RouterLink class="btn" to="/library">Search the library</RouterLink>
          <RouterLink class="btn" to="/about">About Christopher</RouterLink>
        </div>
        <div class="kpis">
          <div class="card kpi">
            <strong>{{ iosApps.length }}</strong>
            <span class="small">promotional iOS apps</span>
          </div>
          <div class="card kpi">
            <strong>{{ podcasts.length }}</strong>
            <span class="small">podcasts on RSS</span>
          </div>
          <div class="card kpi">
            <strong>@chrsappiah</strong>
            <span class="small">TikTok · LinkedIn · YouTube</span>
          </div>
        </div>
      </div>

      <aside class="card founder-card">
        <img :src="founderProfile.avatar" :alt="founderProfile.name" class="founder-card-avatar" />
        <h3>{{ founderProfile.name }}</h3>
        <p class="small">{{ founderProfile.title }}</p>
        <p class="small">{{ founderProfile.bio }}</p>
        <a :href="founderProfile.profileUrl" target="_blank" rel="noopener noreferrer" class="accent-link small">
          christopherappiahthompson.link
        </a>
        <FounderContactLinks style="display:block;margin-top:8px" />
      </aside>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <h2>Connect with Christopher</h2>
      </div>
      <div class="social-links" style="margin-bottom:24px">
        <a
          v-for="channel in socialChannels"
          :key="channel.url"
          :href="channel.url"
          target="_blank"
          rel="noopener noreferrer"
          class="social-chip"
        >
          <span class="social-label">{{ channel.label }}</span>
          <span class="social-handle">{{ channel.handle }}</span>
        </a>
      </div>
      <div class="grid-3">
        <RouterLink to="/marketing?tab=testflight" class="card feature">
          <h3>TestFlight betas</h3>
          <p>Download beta manifest JSON and join public invite links for WCS Care and Gold Test.</p>
        </RouterLink>
        <RouterLink to="/marketing?tab=app-store" class="card feature">
          <h3>App Store purchases</h3>
          <p>Premium monthly, AI tutor packs, and exam unlocks on the App Store.</p>
        </RouterLink>
        <RouterLink to="/courses" class="card feature">
          <h3>Courses &amp; micro-credentials</h3>
          <p>Workshops and learning pathways for care and community services leaders.</p>
        </RouterLink>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="section-head">
        <h2>Featured resources</h2>
        <p>Curated toolkit pages from the WCS library.</p>
      </div>
      <p v-if="usingFallback" class="small muted" style="margin-bottom:12px">
        Showing curated library highlights (live database sync pending).
      </p>
      <div class="list">
        <RouterLink
          v-for="item in featured"
          :key="item.slug"
          class="result result-link"
          :to="`/resources/${item.slug}`"
        >
          <div>
            <strong>{{ item.title }}</strong>
            <p class="small">{{ item.summary }}</p>
          </div>
          <span class="pill">{{ item.category }}</span>
        </RouterLink>
      </div>
    </div>
  </section>

  <section class="section founder-home-section">
    <div class="container">
      <div class="grid-2">
        <div class="card">
          <span class="tag">What I do</span>
          <h3>Consultancy, education &amp; creative media</h3>
          <p>Policy and co-design for government and NGOs; online courses for care workers; ethical brand campaigns; digital art and podcasts.</p>
          <RouterLink to="/about" class="btn" style="margin-top:16px">Full profile &rarr;</RouterLink>
        </div>
        <div class="card">
          <span class="tag">Listen · RSS.com</span>
          <h3>Podcasts</h3>
          <ul class="podcast-list">
            <li v-for="pod in podcasts" :key="pod.slug">
              <RouterLink :to="`/podcasts/${pod.slug}`" class="accent-link">{{ pod.label }}</RouterLink>
              <span class="small muted">
                —
                <a :href="pod.url" target="_blank" rel="noopener noreferrer" class="accent-link">RSS.com</a>
              </span>
            </li>
          </ul>
          <RouterLink to="/podcasts" class="btn" style="margin-top:16px">All podcast referral kits &rarr;</RouterLink>
          <a href="https://paypal.me/christopherappiahthompson" target="_blank" rel="noopener noreferrer" class="btn primary" style="margin-top:16px">
            Support via PayPal
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
