import { defineStore } from "pinia";
import { api } from "../services/api.js";

const DEFAULT_NAV = [
  { label: "Home", to: "/" },
  { label: "Library", to: "/library" },
  { label: "About", to: "/about" },
  { label: "Courses", to: "/courses" },
  { label: "Podcasts", to: "/podcasts" },
  { label: "Digital Marketing", to: "/digital-marketing" },
  { label: "Digital Advertising", to: "/digital-advertising" },
  { label: "Apps & Store", to: "/marketing" },
  { label: "Contact", to: "/contact" },
];

const NAV_REPLACEMENTS = {
  "/future-lab": { label: "Digital Marketing", to: "/digital-marketing" },
  "/art-verse": { label: "Digital Advertising", to: "/digital-advertising" },
  "Future Lab": { label: "Digital Marketing", to: "/digital-marketing" },
  "Art Verse": { label: "Digital Advertising", to: "/digital-advertising" },
};

function normalizeNavItem(item) {
  const byPath = NAV_REPLACEMENTS[item.to];
  const byLabel = NAV_REPLACEMENTS[item.label];
  if (byPath) return { ...item, ...byPath };
  if (byLabel) return { ...item, ...byLabel };
  return item;
}

export const usePlatformStore = defineStore("platform", {
  state: () => ({
    platform: null,
    about: null,
    loaded: false,
    error: null,
  }),
  getters: {
    founderAvatar: (s) =>
      s.about?.founder?.avatar ??
      "https://0.gravatar.com/avatar/d8bd3742b066b58641607204c431fb47b6b32016887ba1a7b95e91279d7562d3?size=400",
    displayNav: (s) => {
      const raw = s.platform?.nav?.length ? s.platform.nav.map(normalizeNavItem) : DEFAULT_NAV;
      const seen = new Set();
      return raw.filter((item) => {
        if (seen.has(item.to)) return false;
        seen.add(item.to);
        return true;
      });
    },
  },
  actions: {
    async fetchPlatform() {
      this.error = null;
      try {
        [this.platform, this.about] = await Promise.all([
          api.getPlatform(),
          api.getAbout(),
        ]);
      } catch (e) {
        this.error = e;
      } finally {
        this.loaded = true;
      }
    },
  },
});
