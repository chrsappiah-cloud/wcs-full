<script setup>
import { onMounted, ref } from "vue";
import { api } from "../services/api.js";
import { usePlatformStore } from "../stores/platform.js";

const platformStore = usePlatformStore();
const featured = ref([]);
const error = ref(null);

onMounted(async () => {
  error.value = null;
  try {
    featured.value = await api.getFeaturedResources();
  } catch (e) {
    error.value = e;
  }
});
</script>

<template>
  <!-- Hero -->
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <span class="eyebrow">Hyperreal learning, research, care and culture</span>
        <h1>A future-facing digital campus for World Class Scholars.</h1>
        <p>
          Designed as a modular knowledge platform, this prototype combines public
          storytelling, AI-assisted discovery, library federation, learning products,
          and humane service design for education, dementia care, arts, and global
          consultancy.
        </p>
        <div class="hero-actions">
          <RouterLink class="btn primary" to="/library">Search the library</RouterLink>
          <RouterLink class="btn" to="/about">Founder &amp; impact</RouterLink>
        </div>

        <!-- KPIs -->
        <div class="kpis">
          <div class="card kpi">
            <strong>4</strong>
            <span class="small">core public experience zones</span>
          </div>
          <div class="card kpi">
            <strong>6</strong>
            <span class="small">future backend modules</span>
          </div>
          <div class="card kpi">
            <strong>API-first</strong>
            <span class="small">library and content federation model</span>
          </div>
        </div>
      </div>

      <!-- Platform map card -->
      <aside class="card">
        <span class="tag">Platform map</span>
        <h3>Multi-page experience</h3>
        <p>
          Public Site, Library Intelligence, Founder &amp; Impact, Future Lab,
          Courses &amp; Microcredentials, and Admin/CMS all fit a clean modular
          application structure.
        </p>
        <div class="list">
          <div class="result">
            <div>
              <strong>Public narrative layer</strong>
              <p class="small">Mission, sectors, partnerships, campaigns, calls to action.</p>
            </div>
            <span class="pill">Landing</span>
          </div>
          <div class="result">
            <div>
              <strong>Knowledge discovery layer</strong>
              <p class="small">Open Library, Google Books, Internet Archive, Gutendex, and custom curation.</p>
            </div>
            <span class="pill">Search</span>
          </div>
          <div class="result">
            <div>
              <strong>Operational layer</strong>
              <p class="small">CMS, learning management, analytics, content ingestion and user roles.</p>
            </div>
            <span class="pill">Admin</span>
          </div>
        </div>
      </aside>
    </div>
  </section>

  <!-- Platform zones -->
  <section class="section">
    <div class="container">
      <div class="section-head">
        <h2>Platform zones</h2>
      </div>
      <div class="grid-3">
        <article class="card feature">
          <span class="tag">Public site</span>
          <h3>World Class Scholars storyworld</h3>
          <p>Mission-led storytelling for consultancy, advocacy, education, training, digital campaigns, healing arts, and purpose-driven innovation.</p>
        </article>
        <article class="card feature">
          <span class="tag">Knowledge</span>
          <h3>Global library search</h3>
          <p>Unified discovery for books, metadata, abstracts, editions, and open resources from major scholarly and public book ecosystems.</p>
        </article>
        <article class="card feature">
          <span class="tag">Growth</span>
          <h3>Future Lab and courses</h3>
          <p>R&amp;D showcases, micro-credential pathways, consultancy products, digital galleries, and human-rights-centered learning labs.</p>
        </article>
      </div>
    </div>
  </section>

  <!-- Featured resources -->
  <section class="section">
    <div class="container">
      <div class="section-head">
        <h2>Featured resources</h2>
        <p>Toolkit pages indexed for internal search.</p>
      </div>
      <p v-if="error" class="alert">Could not load resources. Is the API running?</p>
      <div v-else class="list">
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

  <!-- Founder profile -->
  <section class="section founder-home-section">
    <div class="container">
      <div class="founder-home-header">
        <img
          src="https://0.gravatar.com/avatar/d8bd3742b066b58641607204c431fb47b6b32016887ba1a7b95e91279d7562d3?size=400"
          alt="Dr Christopher Appiah-Thompson"
          class="founder-home-avatar"
        />
        <div>
          <span class="eyebrow">Founder</span>
          <h2 style="margin-bottom:8px">Dr Christopher Appiah-Thompson</h2>
          <p class="small" style="color:var(--muted);margin-bottom:12px">Australia &mdash;
            <a href="mailto:christopher.appiahthompson@myworldclass.org" class="accent-link">
              christopher.appiahthompson@myworldclass.org
            </a>
          </p>
          <p>
            Founder of World Class Scholars — a global consultancy championing equity, dignity,
            and social justice in disability, mental health, and dementia care. His work bridges
            research, frontline practice, lived experience, and creative storytelling to help
            organisations design humane services, trauma-aware communication, and inclusive policies.
          </p>
          <div class="founder-home-social">
            <a href="https://www.linkedin.com/in/christopher-appiah-thompson-a2014045" target="_blank" rel="noopener noreferrer" class="social-chip">
              <span class="social-label">LinkedIn</span>
              <span class="social-handle">christopher-appiah-thompson</span>
            </a>
            <a href="https://tiktok.com/@chrsappiah" target="_blank" rel="noopener noreferrer" class="social-chip">
              <span class="social-label">TikTok</span>
              <span class="social-handle">@chrsappiah</span>
            </a>
            <a href="https://www.youtube.com/channel/UC2a-_QUygsGAKWzEdKHEP9Q" target="_blank" rel="noopener noreferrer" class="social-chip">
              <span class="social-label">YouTube</span>
              <span class="social-handle">World Class Scholars</span>
            </a>
          </div>
        </div>
      </div>

      <!-- What I do -->
      <div class="section-head" style="margin-top:36px">
        <h3 style="font-family:Orbitron,sans-serif">What I do</h3>
      </div>
      <div class="grid-2" style="margin-bottom:28px">
        <article class="card feature">
          <span class="tag">Consultancy &amp; Advocacy</span>
          <h3>Policy and co-design</h3>
          <p>Advising government, NGOs, and aged-care providers on policy, standards, and co-design processes that centre human rights and lived experience.</p>
        </article>
        <article class="card feature">
          <span class="tag">Education &amp; Training</span>
          <h3>Courses and micro-credentials</h3>
          <p>Designing online courses, micro-credentials, and bespoke workshops for workers and leaders in care and community services.</p>
        </article>
        <article class="card feature">
          <span class="tag">Digital Campaigns</span>
          <h3>Brand storytelling</h3>
          <p>Building ethical, high-impact marketing campaigns for care organisations and purpose-driven brands.</p>
        </article>
        <article class="card feature">
          <span class="tag">Creative Arts &amp; Media</span>
          <h3>Healing arts and podcasts</h3>
          <p>Producing digital art, healing-arts resources, and podcasts that connect culture, care, and scholarship.</p>
        </article>
      </div>

      <!-- Digital works + Podcasts -->
      <div class="grid-2">
        <div class="card">
          <span class="tag">Digital works</span>
          <h3>Platforms &amp; projects</h3>
          <div class="works-grid" style="margin-top:12px">
            <a href="https://myworldclass.net" target="_blank" rel="noopener noreferrer" class="work-card">
              <span class="work-category">Website</span><span class="work-label">myworldclass.net</span>
            </a>
            <a href="https://wcs-art-verse.com" target="_blank" rel="noopener noreferrer" class="work-card">
              <span class="work-category">Gallery</span><span class="work-label">WCS Art Verse</span>
            </a>
            <a href="https://www.wcsflab.com/" target="_blank" rel="noopener noreferrer" class="work-card">
              <span class="work-category">Lab</span><span class="work-label">WCS Future Lab</span>
            </a>
            <a href="https://creator.nightcafe.studio/u/CKRIZ" target="_blank" rel="noopener noreferrer" class="work-card">
              <span class="work-category">Digital Art</span><span class="work-label">NightCafe (CKRIZ)</span>
            </a>
            <a href="https://africanhistoryanditsdiscontentsafricanhistoryanditsdiscontents.codeadx.me" target="_blank" rel="noopener noreferrer" class="work-card">
              <span class="work-category">Blog</span><span class="work-label">African History &amp; Its Discontents</span>
            </a>
            <a href="https://chrspiah.gumroad.com/l/qylmdn" target="_blank" rel="noopener noreferrer" class="work-card">
              <span class="work-category">Product</span><span class="work-label">Digital Download (Gumroad)</span>
            </a>
          </div>
        </div>

        <div class="card">
          <span class="tag">Podcasts</span>
          <h3>Listen</h3>
          <ul class="podcast-list" style="margin-top:12px">
            <li>
              <a href="https://rss.com/podcasts/heartbeats-beyond-memory-creative-care-in-dementia/2357430" target="_blank" rel="noopener noreferrer" class="podcast-link">
                🎙 Heartbeats Beyond Memory — Creative Care in Dementia
              </a>
            </li>
            <li>
              <a href="https://rss.com/podcasts/decoding-the-signs-and-symbols-of-freemasonry-in-the-21st-century/" target="_blank" rel="noopener noreferrer" class="podcast-link">
                🎙 Decoding the Signs and Symbols of Freemasonry in the 21st Century
              </a>
            </li>
            <li>
              <a href="https://rss.com/podcasts/art-culture-and-philosophies-of-tattoos" target="_blank" rel="noopener noreferrer" class="podcast-link">
                🎙 Art, Culture and Philosophies of Tattoos
              </a>
            </li>
          </ul>
          <a href="https://paypal.me/christopherappiahthompson" target="_blank" rel="noopener noreferrer"
             class="btn primary" style="margin-top:20px;width:100%;justify-content:center">
            Support via PayPal
          </a>
        </div>
      </div>

      <div style="text-align:center;margin-top:24px">
        <RouterLink to="/about" class="btn">Full founder profile &rarr;</RouterLink>
      </div>
    </div>
  </section>
</template>
