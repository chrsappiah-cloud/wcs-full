<script setup>
defineProps({
  items: { type: Array, required: true },
  heading: { type: String, default: "Promotions from christopherappiahthompson.link" },
  lede: { type: String, default: "" },
  profileUrl: { type: String, default: "https://christopherappiahthompson.link" },
});
</script>

<template>
  <div class="promo-gallery-section">
    <div class="section-head">
      <h2>{{ heading }}</h2>
      <p v-if="lede" class="lede small">{{ lede }}</p>
      <p v-else class="lede small">
        Podcasts, digital art, and creative projects —
        <a :href="profileUrl" target="_blank" rel="noopener noreferrer" class="accent-link">
          christopherappiahthompson.link
        </a>
      </p>
    </div>
    <div class="promo-gallery">
      <a
        v-for="item in items"
        :key="item.id"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="card promo-card"
      >
        <div class="promo-card-image-wrap">
          <img
            :src="item.imageUrl"
            :alt="item.title"
            class="promo-card-image"
            loading="lazy"
            decoding="async"
          />
        </div>
        <span class="tag">{{ item.category }}</span>
        <h3 class="promo-card-title">{{ item.title }}</h3>
        <span class="accent-link small">Visit &rarr;</span>
      </a>
    </div>
  </div>
</template>
