<script setup>
import { computed } from "vue";
import { usePlatformStore } from "../stores/platform.js";

const store  = usePlatformStore();
const name   = computed(() => store.platform?.name ?? "World Class Scholars");
const nav    = computed(() => store.platform?.nav ?? []);
const avatar = computed(() => store.founderAvatar);
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-grid">

      <!-- Brand -->
      <div>
        <div class="footer-brand">
          <svg width="28" height="28" viewBox="0 0 64 64" fill="none"
               stroke="currentColor" stroke-width="3" aria-hidden="true">
            <path d="M10 42 32 10l22 32"/><path d="M18 42h28"/>
            <circle cx="32" cy="26" r="5"/>
          </svg>
          <span>{{ name }}</span>
        </div>
        <p class="small">
          A future-ready digital platform for humane learning systems, research,
          knowledge discovery, creative healing, and global impact partnerships.
        </p>
        <div style="display:flex;align-items:center;gap:12px;margin-top:14px">
          <img :src="avatar" alt="Dr Christopher Appiah-Thompson" class="footer-avatar" />
          <a href="mailto:christopher.appiahthompson@myworldclass.org"
             class="accent-link small">
            christopher.appiahthompson@myworldclass.org
          </a>
        </div>
      </div>

      <!-- Pages -->
      <div>
        <h3 class="footer-col-heading">Pages</h3>
        <ul class="footer-col-list">
          <li v-for="item in nav" :key="item.to">
            <RouterLink :to="item.to" class="footer-col-link">{{ item.label }}</RouterLink>
          </li>
        </ul>
      </div>

      <!-- Next phase (now live) -->
      <div>
        <h3 class="footer-col-heading">Next phase</h3>
        <ul class="footer-col-list">
          <li><RouterLink to="/api-status" class="footer-col-link">Live APIs</RouterLink></li>
          <li><RouterLink to="/admin/cms" class="footer-col-link">CMS</RouterLink></li>
          <li><RouterLink to="/login" class="footer-col-link">Auth</RouterLink></li>
          <li><RouterLink to="/my-courses" class="footer-col-link">Course platform</RouterLink></li>
          <li><RouterLink to="/admin" class="footer-col-link">Analytics</RouterLink></li>
          <li><RouterLink to="/admin/publishing" class="footer-col-link">Admin publishing</RouterLink></li>
        </ul>
      </div>

    </div>
  </footer>
</template>
