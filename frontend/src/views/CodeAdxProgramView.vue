<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import {
  CODEADX_APP_URL,
  CODEADX_DASHBOARD_URL,
  digitalCreativeWorks,
  getProgramBySlug,
} from "../config/codeadxPrograms.js";
import {
  founderLinkPromotions,
  FOUNDER_PROFILE_URL,
} from "../config/founderLinkPromotions.js";
import PromotionalGallery from "../components/PromotionalGallery.vue";

const route = useRoute();
const program = computed(() => getProgramBySlug(route.meta.programSlug));
const isMarketing = computed(() => route.meta.programSlug === "digital-marketing");
</script>

<template>
  <section v-if="program" class="section codeadx-program">
    <div class="container">
      <div class="section-head">
        <span class="eyebrow">{{ program.eyebrow }}</span>
        <h1>{{ program.title }}</h1>
        <p class="lede">{{ program.summary }}</p>
        <div class="hero-actions" style="margin-top:20px">
          <a
            class="btn primary"
            :href="isMarketing ? CODEADX_APP_URL : CODEADX_DASHBOARD_URL"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ isMarketing ? "Open CodeAdx app" : "Open podcaster stats" }}
          </a>
          <a
            :href="FOUNDER_PROFILE_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="btn"
          >
            Founder link hub
          </a>
          <RouterLink v-if="!isMarketing" class="btn" to="/digital-marketing">Digital marketing</RouterLink>
          <RouterLink v-else class="btn" to="/digital-advertising">Digital advertising</RouterLink>
        </div>
      </div>

      <div class="grid-3" style="margin-bottom:32px">
        <article v-for="item in program.highlights" :key="item" class="card feature">
          <p>{{ item }}</p>
        </article>
      </div>

      <div class="section-head">
        <h2>Program modules</h2>
      </div>
      <div class="grid-3" style="margin-bottom:40px">
        <article v-for="mod in program.modules" :key="mod.title" class="card">
          <h3>{{ mod.title }}</h3>
          <p class="small">{{ mod.summary }}</p>
        </article>
      </div>

      <PromotionalGallery
        :items="founderLinkPromotions"
        heading="Promotional showcase"
        lede="Preview images from the Christopher Appiah-Thompson link hub — podcasts, healing arts, and digital brands."
        :profile-url="FOUNDER_PROFILE_URL"
      />

      <div class="section-head" style="margin-top:40px">
        <h2>Featured creative storefronts</h2>
      </div>
      <div class="promo-gallery" style="margin-bottom:40px">
        <a
          v-for="work in digitalCreativeWorks"
          :key="work.id"
          :href="work.url"
          target="_blank"
          rel="noopener noreferrer"
          class="card promo-card"
        >
          <div class="promo-card-image-wrap">
            <img :src="work.imageUrl" :alt="work.title" class="promo-card-image" loading="lazy" />
          </div>
          <span class="tag">{{ work.category }}</span>
          <h3 class="promo-card-title">{{ work.title }}</h3>
          <span class="accent-link small">Visit &rarr;</span>
        </a>
      </div>

      <template v-if="!isMarketing">
        <div class="section-head">
          <h2>Podcaster analytics dashboard</h2>
          <p class="lede">
            View impressions, ad delivery, and show performance in the CodeAdx podcaster console.
          </p>
        </div>
        <div class="card codeadx-dashboard-card">
          <p class="small">
            Sign in at
            <a :href="CODEADX_DASHBOARD_URL" target="_blank" rel="noopener noreferrer" class="accent-link">
              app.codeadx.com/podcaster/stats
            </a>
            for live metrics.
          </p>
          <a
            class="btn primary"
            :href="CODEADX_DASHBOARD_URL"
            target="_blank"
            rel="noopener noreferrer"
            style="margin-top:16px"
          >
            Launch podcaster stats
          </a>
        </div>
      </template>
    </div>
  </section>
</template>

<style scoped>
.codeadx-dashboard-card {
  max-width: 640px;
}
</style>
