<script setup>
import { computed, ref } from "vue";
import { appleAppCategories, appleApps, appleLaunchStats, developerProfile } from "../config/appleApps.js";

const search = ref("");
const selectedCategory = ref("All");
const selectedPrice = ref("All");

const launchChannels = [
  { label: "App Store", detail: "Direct product page with Apple-hosted artwork and pricing." },
  { label: "Website", detail: "Public launch hub for SEO, media kits, and cross-promotion." },
  { label: "Social", detail: "Short-form captions for LinkedIn, TikTok, YouTube, and Facebook." },
];

const categoryOptions = computed(() => ["All", ...appleAppCategories]);
const priceOptions = ["All", "Free", "Paid"];

const filteredApps = computed(() => {
  const term = search.value.trim().toLowerCase();
  return appleApps.filter((app) => {
    const matchesTerm = !term
      || [app.name, app.category, app.headline, app.summary, app.audience, app.bundleId]
        .join(" ")
        .toLowerCase()
        .includes(term);
    const matchesCategory = selectedCategory.value === "All" || app.category === selectedCategory.value;
    const matchesPrice = selectedPrice.value === "All"
      || (selectedPrice.value === "Free" ? app.price === "Free" : app.price !== "Free");
    return matchesTerm && matchesCategory && matchesPrice;
  });
});

function formatLaunchDate(date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}
</script>

<template>
  <div class="apple-launch-page">
    <section class="hero apple-launch-hero">
      <div class="container apple-launch-hero-grid">
        <div>
          <span class="eyebrow">Official App Store launch platform</span>
          <h1>Apple apps by Christopher Appiah-Thompson</h1>
          <p class="launch-lede">
            A public marketing home for every live iPhone and iPad app, using Apple Store product links,
            Apple-hosted icons, launch positioning, pricing, categories, and campaign-ready calls to action.
          </p>
          <div class="hero-actions">
            <a class="btn primary" :href="developerProfile.appStoreUrl" target="_blank" rel="noopener noreferrer">
              View developer page
            </a>
            <a class="btn" href="#app-catalog">Explore apps</a>
          </div>
          <div class="apple-launch-stats" aria-label="App Store launch stats">
            <div class="apple-launch-stat">
              <strong>{{ appleLaunchStats.totalApps }}</strong>
              <span>live apps</span>
            </div>
            <div class="apple-launch-stat">
              <strong>{{ appleLaunchStats.categories }}</strong>
              <span>categories</span>
            </div>
            <div class="apple-launch-stat">
              <strong>{{ appleLaunchStats.freeApps }}</strong>
              <span>free apps</span>
            </div>
            <div class="apple-launch-stat">
              <strong>{{ appleLaunchStats.paidApps }}</strong>
              <span>paid apps</span>
            </div>
          </div>
        </div>

        <aside class="apple-feature-wall" aria-label="Featured App Store artwork">
          <a
            v-for="app in appleApps.slice(0, 9)"
            :key="app.slug"
            :href="app.appStoreUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="apple-icon-orbit"
            :aria-label="`${app.name} on the App Store`"
          >
            <img :src="app.artworkUrl" :alt="`${app.name} app icon`" loading="eager" />
          </a>
        </aside>
      </div>
    </section>

    <section class="section apple-launch-strip">
      <div class="container">
        <div class="apple-channel-grid">
          <article v-for="channel in launchChannels" :key="channel.label" class="card apple-channel-card">
            <span class="tag">{{ channel.label }}</span>
            <p>{{ channel.detail }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="app-catalog" class="section">
      <div class="container">
        <div class="section-head apple-catalog-head">
          <div>
            <h2>Launch catalog</h2>
            <p class="lede">Filter by category, price, app name, audience, or campaign message.</p>
          </div>
          <a class="btn" :href="developerProfile.appStoreUrl" target="_blank" rel="noopener noreferrer">
            Apple developer page
          </a>
        </div>

        <div class="apple-filter-bar">
          <input v-model="search" class="input" type="search" placeholder="Search apps, audiences, features..." />
          <select v-model="selectedCategory" class="select" aria-label="Filter by category">
            <option v-for="category in categoryOptions" :key="category" :value="category">{{ category }}</option>
          </select>
          <select v-model="selectedPrice" class="select" aria-label="Filter by price">
            <option v-for="price in priceOptions" :key="price" :value="price">{{ price }}</option>
          </select>
        </div>

        <div class="apple-app-grid">
          <article v-for="app in filteredApps" :key="app.slug" class="card apple-app-card">
            <div class="apple-app-card-top">
              <img class="apple-app-icon" :src="app.artworkUrl" :alt="`${app.name} app icon`" loading="lazy" />
              <div>
                <span class="tag">{{ app.category }}</span>
                <h3>{{ app.name }}</h3>
                <p class="small">{{ app.bundleId }}</p>
              </div>
            </div>

            <p class="apple-app-headline">{{ app.headline }}</p>
            <p>{{ app.summary }}</p>

            <div class="apple-app-meta">
              <span class="pill">{{ app.price }}</span>
              <span class="pill">Launched {{ formatLaunchDate(app.releaseDate) }}</span>
            </div>

            <div class="apple-app-audience">
              <strong>Audience</strong>
              <span>{{ app.audience }}</span>
            </div>

            <ul class="apple-highlight-list">
              <li v-for="highlight in app.highlights" :key="highlight">{{ highlight }}</li>
            </ul>

            <div class="apple-app-actions">
              <a class="btn primary" :href="app.appStoreUrl" target="_blank" rel="noopener noreferrer">
                Download on App Store
              </a>
              <a class="btn" :href="`https://apps.apple.com/search?term=${encodeURIComponent(app.name)}`" target="_blank" rel="noopener noreferrer">
                Search
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="section apple-campaign-section">
      <div class="container">
        <div class="section-head">
          <h2>Launch campaign assets</h2>
          <p class="lede">
            Every card above carries the live App Store product URL and Apple-hosted icon artwork. Use this platform
            as the source of truth for product launches, paid ads, creator posts, email campaigns, and QR-code landing pages.
          </p>
        </div>
        <div class="grid-3">
          <article class="card feature">
            <span class="tag">Asset source</span>
            <h3>Apple Store artwork</h3>
            <p>App icons are loaded from Apple’s public artwork CDN, matching the published App Store listings.</p>
          </article>
          <article class="card feature">
            <span class="tag">Conversion</span>
            <h3>Direct CTAs</h3>
            <p>Each app card links directly to its App Store product page with price, category, and launch context nearby.</p>
          </article>
          <article class="card feature">
            <span class="tag">Portfolio</span>
            <h3>Cross-promotion</h3>
            <p>The page groups health, education, business, design, legal, finance, shopping, and civic technology products.</p>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
