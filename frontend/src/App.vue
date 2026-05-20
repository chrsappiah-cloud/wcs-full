<script setup>
import { onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import SiteHeader from "./components/SiteHeader.vue";
import SiteFooter from "./components/SiteFooter.vue";
import { usePlatformStore } from "./stores/platform.js";
import { useAuthStore } from "./stores/auth.js";
import { api } from "./services/api.js";

const platformStore = usePlatformStore();
const authStore     = useAuthStore();
const route         = useRoute();

onMounted(() => {
  platformStore.fetchPlatform();
  authStore.fetchMe();
});

watch(
  () => route.fullPath,
  (fullPath) => {
    const path = fullPath.split("?")[0];
    api.track("page_view", path, {
      query: route.query && Object.keys(route.query).length ? { ...route.query } : undefined,
    });
  },
  { immediate: true }
);
</script>

<template>
  <div class="app-shell">
    <SiteHeader />
    <main class="main">
      <RouterView :key="route.fullPath" />
    </main>
    <SiteFooter />
  </div>
</template>
