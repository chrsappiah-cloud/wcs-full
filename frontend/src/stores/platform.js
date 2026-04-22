import { defineStore } from "pinia";
import { api } from "../services/api.js";

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
