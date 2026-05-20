<script setup>
import { onMounted, ref } from "vue";
import { api } from "../services/api.js";
import { founderProfile } from "../config/marketingPortal.js";
import { ADMIN_EMAIL, SUPPORT_EMAIL } from "../config/contactEmails.js";

const page = ref(null);
const error = ref(null);

onMounted(async () => {
  error.value = null;
  try {
    page.value = await api.getAbout();
  } catch (e) {
    error.value = e;
  }
});
</script>

<template>
  <section class="section">
    <div class="container narrow">
      <p v-if="error" class="alert">Could not load About content.</p>

      <template v-else-if="page">
        <!-- Mission -->
        <div class="section-head">
          <h1>{{ page.title }}</h1>
          <p class="lede">{{ page.summary }}</p>
        </div>

        <!-- Pillars -->
        <div v-if="page.pillars?.length" class="pillars">
          <article v-for="pillar in page.pillars" :key="pillar.title" class="card pillar-card">
            <div class="card-kicker">Pillar</div>
            <h2 class="card-title">{{ pillar.title }}</h2>
            <p class="card-body">{{ pillar.description }}</p>
          </article>
        </div>

        <!-- Founder -->
        <div v-if="page.founder" class="founder-section block">
          <div class="founder-header">
            <div>
              <h2 class="founder-name">{{ page.founder.name }}</h2>
              <p class="muted small">{{ page.founder.location }}</p>
              <p class="small" style="margin-top:8px">
                <a :href="`mailto:${SUPPORT_EMAIL}`" class="accent-link">{{ SUPPORT_EMAIL }}</a>
                <span class="muted"> · support</span>
                <br />
                <a :href="`mailto:${ADMIN_EMAIL}`" class="accent-link">{{ ADMIN_EMAIL }}</a>
                <span class="muted"> · admin</span>
                <br />
                <a :href="`mailto:${founderProfile.personalEmail}`" class="accent-link">{{ founderProfile.personalEmail }}</a>
                <span class="muted"> · personal</span>
                <br />
                <RouterLink to="/contact" class="accent-link">Send feedback or an enquiry</RouterLink>
              </p>
            </div>
          </div>

          <p class="founder-bio">{{ page.founder.bio }}</p>

          <!-- Social -->
          <div v-if="page.founder.social?.length" class="founder-block">
            <h3 class="sub-heading">Social</h3>
            <div class="social-links">
              <a
                v-for="s in page.founder.social"
                :key="s.url"
                :href="s.url"
                target="_blank"
                rel="noopener noreferrer"
                class="social-chip"
              >
                <span class="social-label">{{ s.label }}</span>
                <span class="social-handle">{{ s.handle }}</span>
              </a>
            </div>
          </div>

          <!-- Digital works -->
          <div v-if="page.founder.works?.length" class="founder-block">
            <h3 class="sub-heading">Digital works &amp; platforms</h3>
            <div class="works-grid">
              <a
                v-for="w in page.founder.works"
                :key="w.url"
                :href="w.url"
                target="_blank"
                rel="noopener noreferrer"
                class="work-card"
              >
                <span class="work-category">{{ w.category }}</span>
                <span class="work-label">{{ w.label }}</span>
              </a>
            </div>
          </div>

          <!-- Podcasts -->
          <div v-if="page.founder.podcasts?.length" class="founder-block">
            <h3 class="sub-heading">Podcasts</h3>
            <ul class="podcast-list">
              <li v-for="p in page.founder.podcasts" :key="p.url">
                <RouterLink
                  v-if="p.referralPath || p.slug"
                  :to="p.referralPath || `/podcasts/${p.slug}`"
                  class="podcast-link accent-link"
                >
                  {{ p.label }}
                </RouterLink>
                <a
                  :href="p.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="accent-link small"
                  style="margin-left:8px"
                >
                  RSS.com
                </a>
              </li>
            </ul>
            <RouterLink to="/podcasts" class="btn small" style="margin-top:12px">Podcast referral kits</RouterLink>
          </div>
        </div>
      </template>

      <p v-else class="muted">Loading…</p>
    </div>
  </section>
</template>
