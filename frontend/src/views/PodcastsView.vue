<script setup>
import { rssPodcasts } from "../config/podcasts.js";
import { buildPodcastReferralLink } from "../config/marketingPortal.js";
import { DEFAULT_SITE_URL } from "../config/site.js";
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">RSS.com · World Class Scholars</span>
        <h1>Podcasts</h1>
        <p class="lede">
          Three shows hosted on
          <a href="https://rss.com" target="_blank" rel="noopener noreferrer" class="accent-link">RSS.com</a>
          — listen on any platform and share trackable referral links for campaigns on TikTok, LinkedIn, and YouTube.
        </p>
      </div>

      <div class="marketing-app-grid">
        <article v-for="pod in rssPodcasts" :key="pod.slug" class="card marketing-app-card">
          <span class="tag">{{ pod.category }}</span>
          <h3>{{ pod.shortTitle }}</h3>
          <p class="small">{{ pod.description }}</p>
          <div class="marketing-app-actions">
            <RouterLink class="btn primary" :to="`/podcasts/${pod.slug}`">Referral kit</RouterLink>
            <a class="btn" :href="pod.rssUrl" target="_blank" rel="noopener noreferrer">Listen on RSS.com</a>
          </div>
          <p class="small muted" style="margin-top:12px">
            Example referral:
            <code class="referral-url">{{ buildPodcastReferralLink(pod.slug, "tiktok") }}</code>
          </p>
        </article>
      </div>

      <div class="card" style="margin-top:32px">
        <h3>How podcast referrals work</h3>
        <p class="small">
          Each show has a dedicated page on {{ DEFAULT_SITE_URL.replace("https://", "") }} with social tracking
          (<code>?ref=tiktok</code>, <code>?ref=linkedin</code>, etc.). Listeners can subscribe on RSS.com; campaigns can
          measure which channel drove the visit before redirecting to Apple Podcasts, Spotify, or RSS.com.
        </p>
        <RouterLink class="btn" to="/digital-advertising" style="margin-top:12px">Podcast advertising stats</RouterLink>
      </div>
    </div>
  </section>
</template>
