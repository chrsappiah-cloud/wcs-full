<script setup>
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { applyPageSeo } from "../lib/seo.js";
import {
  buildPodcastReferralLink,
  resolveAttribution,
  socialChannels,
} from "../config/marketingPortal.js";
import { findPodcast } from "../config/podcasts.js";

const route = useRoute();
const copiedKey = ref(null);

const podcast = computed(() => findPodcast(route.params.slug));
const attribution = computed(() => resolveAttribution(route.query));

watch(
  podcast,
  (p) => {
    if (!p) return;
    applyPageSeo({
      seoTitle: `${p.shortTitle} podcast`,
      seoDescription: `${p.description} Listen on RSS.com. Trackable referral links for social campaigns.`,
      path: `/podcasts/${p.slug}`,
      keywords: p.keywords?.join(", "),
    });
  },
  { immediate: true }
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
  <section v-if="podcast" class="section">
    <div class="container">
      <div class="section-head">
        <RouterLink to="/podcasts" class="accent-link small">&larr; All podcasts</RouterLink>
        <span class="eyebrow">{{ podcast.category }} · RSS.com</span>
        <h1>{{ podcast.shortTitle }}</h1>
        <p class="lede">{{ podcast.description }}</p>
        <p v-if="attribution.ref !== 'direct'" class="attribution-banner">
          Referral: <strong>{{ attribution.ref }}</strong>
        </p>
        <div class="hero-actions" style="margin-top:16px">
          <a class="btn primary" :href="podcast.rssUrl" target="_blank" rel="noopener noreferrer">
            Listen &amp; subscribe on RSS.com
          </a>
          <RouterLink class="btn" to="/marketing">iOS app referrals</RouterLink>
        </div>
      </div>

      <div class="section-head">
        <h2>Social referral links</h2>
        <p class="lede small">Share these URLs on @chrsappiah, LinkedIn, or YouTube before listeners open RSS.com.</p>
      </div>
      <article class="card">
        <div class="referral-list">
          <div v-for="channel in socialChannels" :key="channel.id" class="referral-row">
            <strong>{{ channel.label }}</strong>
            <span class="small">{{ channel.handle }}</span>
            <div class="referral-row-actions">
              <code class="referral-url">{{ buildPodcastReferralLink(podcast.slug, channel.id) }}</code>
              <button
                type="button"
                class="btn"
                @click="copyLink(`${podcast.slug}-${channel.id}`, buildPodcastReferralLink(podcast.slug, channel.id))"
              >
                {{ copiedKey === `${podcast.slug}-${channel.id}` ? "Copied" : "Copy" }}
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  </section>

  <section v-else class="section">
    <div class="container">
      <p class="alert">Podcast not found.</p>
      <RouterLink class="btn" to="/podcasts">Back to podcasts</RouterLink>
    </div>
  </section>
</template>
