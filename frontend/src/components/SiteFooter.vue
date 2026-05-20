<script setup>
import { computed } from "vue";
import { usePlatformStore } from "../stores/platform.js";
import { founderProfile, socialChannels } from "../config/marketingPortal.js";
import FounderContactLinks from "./FounderContactLinks.vue";

const store  = usePlatformStore();
const name   = computed(() => store.platform?.name ?? "World Class Scholars");
const nav    = computed(() => store.displayNav);
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <div class="footer-brand">
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none"
               stroke="currentColor" stroke-width="3" aria-hidden="true">
            <path d="M10 42 32 10l22 32"/><path d="M18 42h28"/>
            <circle cx="32" cy="26" r="5"/>
          </svg>
          <span>{{ name }}</span>
        </div>
        <p class="small">{{ founderProfile.bio }}</p>
        <div style="margin-top:14px">
          <FounderContactLinks />
          <a :href="founderProfile.profileUrl" target="_blank" rel="noopener noreferrer" class="accent-link small" style="display:block;margin-top:8px">
            christopherappiahthompson.link
          </a>
        </div>
      </div>

      <div>
        <h3 class="footer-col-heading">Explore</h3>
        <ul class="footer-col-list">
          <li v-for="item in nav" :key="item.to">
            <RouterLink :to="item.to" class="footer-col-link">{{ item.label }}</RouterLink>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="footer-col-heading">Connect</h3>
        <ul class="footer-col-list">
          <li v-for="channel in socialChannels" :key="channel.url">
            <a :href="channel.url" target="_blank" rel="noopener noreferrer" class="footer-col-link">
              {{ channel.label }} — {{ channel.handle }}
            </a>
          </li>
          <li>
            <RouterLink to="/podcasts" class="footer-col-link">RSS.com podcasts</RouterLink>
          </li>
          <li>
            <RouterLink to="/marketing?tab=testflight" class="footer-col-link">TestFlight beta data</RouterLink>
          </li>
          <li>
            <RouterLink to="/marketing?tab=app-store" class="footer-col-link">App Store purchase</RouterLink>
          </li>
          <li>
            <RouterLink to="/contact" class="footer-col-link">Contact & feedback</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
