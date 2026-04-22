<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { usePlatformStore } from "../stores/platform.js";
import { useAuthStore }     from "../stores/auth.js";

const platformStore = usePlatformStore();
const auth   = useAuthStore();
const router = useRouter();

const nav    = computed(() => platformStore.platform?.nav ?? []);
const title  = computed(() => platformStore.platform?.name ?? "World Class Scholars");
const avatar = computed(() => platformStore.founderAvatar);

function toggleTheme() {
  const html = document.documentElement;
  html.setAttribute("data-theme", html.getAttribute("data-theme") === "dark" ? "light" : "dark");
}

function logout() {
  auth.logout();
  router.push("/");
}
</script>

<template>
  <header class="site-header">
    <div class="container nav-inner">
      <RouterLink class="brand" to="/" aria-label="World Class Scholars home">
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
          <path d="M10 42 32 10l22 32" /><path d="M18 42h28" /><circle cx="32" cy="26" r="5" />
        </svg>
        <span>{{ title }}</span>
      </RouterLink>

      <nav class="nav" aria-label="Primary">
        <RouterLink v-for="item in nav" :key="item.to" class="nav-link" :to="item.to">
          {{ item.label }}
        </RouterLink>
        <RouterLink class="nav-link" to="/api-status">Live APIs</RouterLink>
        <template v-if="auth.isAdmin">
          <RouterLink class="nav-link admin-link" to="/admin">Dashboard</RouterLink>
          <RouterLink class="nav-link admin-link" to="/admin/cms">CMS</RouterLink>
          <RouterLink class="nav-link admin-link" to="/admin/publishing">Publishing</RouterLink>
        </template>
        <RouterLink v-if="auth.isLoggedIn && !auth.isAdmin" class="nav-link" to="/my-courses">My Courses</RouterLink>
      </nav>

      <div style="display:flex;gap:8px;flex-shrink:0">
        <button class="btn" @click="toggleTheme" aria-label="Switch theme">Theme</button>
        <template v-if="auth.isLoggedIn">
          <img
            :src="avatar"
            alt="Profile"
            class="nav-avatar"
            :title="auth.user?.name"
          />
          <button class="btn" @click="logout">Sign out</button>
        </template>
        <RouterLink v-else class="btn primary" to="/login">Sign in</RouterLink>
      </div>
    </div>
  </header>
</template>
