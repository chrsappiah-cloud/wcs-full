<script setup>
import { computed } from "vue";
import { usePlatformStore } from "../stores/platform.js";
import { founderProfile, socialChannels } from "../config/marketingPortal.js";

const store  = usePlatformStore();
const name   = computed(() => store.platform?.name ?? "World Class Scholars");
const nav    = computed(() => store.platform?.nav ?? []);
const avatar = computed(() => store.founderAvatar);
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
        <div style="display:flex;align-items:center;gap:12px;margin-top:14px">
          <img :src="avatar" :alt="founderProfile.name" class="footer-avatar" />
          <div>
            <a :href="`mailto:${founderProfile.email}`" class="accent-link small">{{ founderProfile.email }}</a>
            <br />
            <a :href="founderProfile.profileUrl" target="_blank" rel="noopener noreferrer" class="accent-link small">
              christopherappiahthompson.link
            </a>
          </div>
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
            <RouterLink to="/marketing?tab=testflight" class="footer-col-link">TestFlight beta data</RouterLink>
          </li>
          <li>
            <RouterLink to="/marketing?tab=app-store" class="footer-col-link">App Store purchase</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
