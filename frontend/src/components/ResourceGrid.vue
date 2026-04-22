<script setup>
defineProps({ resources: { type: Array, default: () => [] } });
</script>

<template>
  <div class="list">
    <RouterLink
      v-for="item in resources"
      :key="item.slug"
      class="result result-link"
      :to="`/resources/${item.slug}`"
    >
      <div>
        <strong>{{ item.title }}</strong>
        <p v-if="item.summary" class="small">{{ item.summary }}</p>
      </div>
      <span class="pill">{{ item.category || 'Resource' }}</span>
    </RouterLink>
  </div>
</template>
