<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import {
  buildReferralLink,
  digitalArtworks,
  findApp,
  founderProfile,
  iosApps,
  podcasts,
  resolveAttribution,
  socialChannels,
} from "../config/marketingPortal.js";

const route = useRoute();
const copiedKey = ref(null);

const selectedSlug = computed(() => route.params.appSlug ?? null);
const selectedApp = computed(() => (selectedSlug.value ? findApp(selectedSlug.value) : null));
const attribution = computed(() => resolveAttribution(route.query));

const headline = computed(() =>
  selectedApp.value
    ? `${selectedApp.value.name} — TestFlight referrals`
    : "iOS marketing portal"
);

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
</script>

<template>
  <div class="marketing-portal">
    <!-- Hero -->
    <section class="hero marketing-hero">
      <div class="container hero-grid">
        <div>
          <span class="eyebrow">TestFlight · subscriptions · social referrals</span>
          <h1>{{ headline }}</h1>
          <p>
            Promote World Class Scholars iOS betas from
            <a :href="founderProfile.profileUrl" target="_blank" rel="noopener noreferrer" class="accent-link">
              {{ founderProfile.profileUrl.replace("https://", "") }}
            </a>.
            Each channel gets a trackable landing link before TestFlight install.
          </p>
          <p v-if="selectedApp && attribution.ref !== 'direct'" class="attribution-banner">
            Referral source: <strong>{{ attribution.ref }}</strong>
            <span v-if="attribution.campaign"> · campaign {{ attribution.campaign }}</span>
          </p>
          <div class="hero-actions">
            <RouterLink v-if="selectedApp" class="btn" to="/marketing">All apps</RouterLink>
            <RouterLink class="btn primary" to="/about">Founder profile</RouterLink>
            <a
              class="btn"
              href="https://christopherappiahthompson.link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Link in bio
            </a>
          </div>
        </div>

        <aside class="card founder-card">
          <img :src="founderProfile.avatar" :alt="founderProfile.name" class="founder-card-avatar" />
          <h3>{{ founderProfile.name }}</h3>
          <p class="small">{{ founderProfile.title }} · {{ founderProfile.location }}</p>
          <p class="small">{{ founderProfile.bio }}</p>
          <a :href="`mailto:${founderProfile.email}`" class="accent-link small">{{ founderProfile.email }}</a>
        </aside>
      </div>
    </section>

    <!-- App catalog or single app detail -->
    <section class="section">
      <div class="container">
        <template v-if="!selectedApp">
          <div class="section-head">
            <h2>iOS apps &amp; promotional links</h2>
            <p class="lede">Copy a per-channel referral URL for each app, then share on your social handles.</p>
          </div>

          <div class="marketing-app-grid">
            <article v-for="app in iosApps" :key="app.slug" class="card marketing-app-card">
              <div class="marketing-app-accent" :style="{ background: app.accent }" />
              <span class="tag">{{ app.artworkLabel }}</span>
              <h3>{{ app.name }}</h3>
              <p class="small">{{ app.tagline }}</p>
              <ul class="marketing-feature-list">
                <li v-for="feature in app.features" :key="feature">{{ feature }}</li>
              </ul>
              <div class="marketing-app-actions">
                <RouterLink class="btn primary" :to="`/marketing/${app.slug}`">Open referral kit</RouterLink>
                <a
                  v-if="app.testFlightUrl"
                  class="btn"
                  :href="app.testFlightUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TestFlight
                </a>
                <span v-else class="pill">Invite code pending</span>
              </div>
            </article>
          </div>
        </template>

        <template v-else>
          <div class="section-head">
            <RouterLink to="/marketing" class="accent-link small">&larr; All apps</RouterLink>
            <h2>{{ selectedApp.name }}</h2>
            <p class="lede">{{ selectedApp.description }}</p>
          </div>

          <div class="grid-2 marketing-detail-grid">
            <article class="card">
              <span class="tag">TestFlight</span>
              <h3>Install beta</h3>
              <p class="small">Bundle ID: <code>{{ selectedApp.bundleId }}</code></p>
              <div v-if="selectedApp.testFlightUrl" class="hero-actions">
                <a
                  class="btn primary"
                  :href="selectedApp.testFlightUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join on TestFlight
                </a>
              </div>
              <p v-else class="alert">
                Add a public link in App Store Connect, then set
                <code>testFlightCode</code> in <code>marketingPortal.js</code>.
              </p>
            </article>

            <article class="card">
              <span class="tag">Attribution</span>
              <h3>Social referral links</h3>
              <p class="small">Share these URLs on each handle — they land here with <code>?ref=</code> tracking.</p>
              <div class="referral-list">
                <div v-for="channel in socialChannels" :key="channel.id" class="referral-row">
                  <div>
                    <strong>{{ channel.label }}</strong>
                    <span class="small"> {{ channel.handle }}</span>
                  </div>
                  <div class="referral-row-actions">
                    <code class="referral-url">{{ buildReferralLink(selectedApp.slug, channel.id) }}</code>
                    <button
                      type="button"
                      class="btn"
                      @click="copyLink(`${selectedApp.slug}-${channel.id}`, buildReferralLink(selectedApp.slug, channel.id))"
                    >
                      {{ copiedKey === `${selectedApp.slug}-${channel.id}` ? "Copied" : "Copy" }}
                    </button>
                    <a
                      class="btn"
                      :href="channel.url"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Profile
                    </a>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </template>
      </div>
    </section>

    <!-- Social handles -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <h2>Social handles</h2>
          <p class="lede">Extracted from <a href="https://christopherappiahthompson.link" class="accent-link" target="_blank" rel="noopener noreferrer">christopherappiahthompson.link</a></p>
        </div>
        <div class="social-links marketing-social-grid">
          <a
            v-for="channel in socialChannels"
            :key="channel.url"
            :href="channel.url"
            target="_blank"
            rel="noopener noreferrer"
            class="social-chip"
          >
            <span class="social-icon">{{ channel.icon }}</span>
            <span class="social-label">{{ channel.label }}</span>
            <span class="social-handle">{{ channel.handle }}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Digital artwork -->
    <section class="section">
      <div class="container">
        <div class="section-head">
          <h2>Digital artwork &amp; creative links</h2>
        </div>
        <div class="works-grid">
          <a
            v-for="work in digitalArtworks"
            :key="work.url"
            :href="work.url"
            target="_blank"
            rel="noopener noreferrer"
            class="card work-card"
          >
            <span class="tag">{{ work.category }}</span>
            <strong>{{ work.label }}</strong>
            <span class="small accent-link">Open gallery &rarr;</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Podcasts -->
    <section class="section">
      <div class="container narrow">
        <div class="section-head">
          <h2>Podcasts &amp; media</h2>
        </div>
        <ul class="podcast-list">
          <li v-for="pod in podcasts" :key="pod.url">
            <a :href="pod.url" target="_blank" rel="noopener noreferrer" class="accent-link">{{ pod.label }}</a>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
