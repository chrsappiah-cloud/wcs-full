<script setup>
import { computed } from "vue";

const props = defineProps({
  markers: { type: Array, default: () => [] },
});

const width = 1000;
const height = 500;

function project(lat, lng) {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

const dots = computed(() =>
  props.markers
    .filter((m) => m.lat != null && m.lng != null)
    .map((m) => {
      const { x, y } = project(m.lat, m.lng);
      const r = Math.min(28, 6 + Math.sqrt(m.count) * 4);
      return { ...m, x, y, r };
    })
);

const maxCount = computed(() =>
  Math.max(1, ...dots.value.map((d) => d.count))
);
</script>

<template>
  <div class="world-map-wrap">
    <svg
      class="world-map"
      :viewBox="`0 0 ${width} ${height}`"
      role="img"
      aria-label="Visitor locations on world map"
    >
      <defs>
        <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(8, 24, 48, 0.95)" />
          <stop offset="100%" stop-color="rgba(4, 12, 28, 0.98)" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#ocean)" rx="12" />
      <!-- Simplified continent outlines -->
      <g fill="rgba(142, 242, 255, 0.08)" stroke="rgba(142, 242, 255, 0.15)" stroke-width="1">
        <path d="M120,120 L280,100 L320,200 L250,280 L140,260 Z" />
        <path d="M480,90 L620,80 L680,160 L640,240 L520,220 L460,150 Z" />
        <path d="M720,100 L920,90 L960,180 L900,280 L760,260 L700,180 Z" />
        <path d="M780,300 L880,280 L920,380 L820,420 L740,360 Z" />
        <path d="M200,320 L340,300 L380,400 L280,440 L180,380 Z" />
        <path d="M520,320 L600,300 L640,400 L560,440 L500,380 Z" />
      </g>
      <!-- Grid -->
      <g stroke="rgba(142, 242, 255, 0.06)" stroke-width="1">
        <line v-for="i in 9" :key="'v' + i" :x1="i * 100" y1="0" :x2="i * 100" :y2="height" />
        <line v-for="i in 5" :key="'h' + i" x1="0" :y1="i * 100" :x2="width" :y2="i * 100" />
      </g>
      <g v-for="dot in dots" :key="dot.country">
        <circle
          :cx="dot.x"
          :cy="dot.y"
          :r="dot.r"
          fill="rgba(142, 242, 255, 0.25)"
          stroke="var(--accent)"
          stroke-width="1.5"
        />
        <circle
          :cx="dot.x"
          :cy="dot.y"
          r="4"
          fill="var(--accent)"
        />
        <title>{{ dot.name }}: {{ dot.count }} events</title>
      </g>
    </svg>
    <ul v-if="markers.length" class="map-legend">
      <li v-for="m in markers.slice(0, 8)" :key="m.country">
        <span class="map-legend-dot" :style="{ opacity: 0.4 + (m.count / maxCount) * 0.6 }" />
        <strong>{{ m.name }}</strong>
        <span class="muted small">{{ m.count }}</span>
      </li>
    </ul>
    <p v-else class="muted small" style="margin-top:12px">No geo data yet. Visitors are located via Vercel edge country headers.</p>
  </div>
</template>
