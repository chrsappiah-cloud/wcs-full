<script setup>
import { onMounted, ref } from "vue";
import { api } from "../services/api.js";

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
            <img
              v-if="page.founder.avatar"
              :src="page.founder.avatar"
              :alt="page.founder.name"
              class="founder-avatar"
            />
            <div>
              <h2 class="founder-name">{{ page.founder.name }}</h2>
              <p class="muted small">{{ page.founder.location }} &mdash;
                <a :href="`mailto:${page.founder.email}`" class="accent-link">{{ page.founder.email }}</a>
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
                <a :href="p.url" target="_blank" rel="noopener noreferrer" class="podcast-link">
                  🎙 {{ p.label }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </template>

      <p v-else class="muted">Loading…</p>
    </div>
  </section>
</template>
