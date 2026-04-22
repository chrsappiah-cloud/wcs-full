import { defineStore } from "pinia";
import { api } from "../services/api.js";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("wcs_token") ?? null,
    ready: false,
  }),
  getters: {
    isLoggedIn: (s) => !!s.token,
    isAdmin:    (s) => s.user?.role === "admin",
  },
  actions: {
    async login(email, password) {
      const data = await api.login(email, password);
      this.token = data.token;
      this.user  = data.user;
      localStorage.setItem("wcs_token", data.token);
    },
    async register(name, email, password) {
      const data = await api.register(name, email, password);
      this.token = data.token;
      this.user  = data.user;
      localStorage.setItem("wcs_token", data.token);
    },
    logout() {
      this.token = null;
      this.user  = null;
      localStorage.removeItem("wcs_token");
    },
    async fetchMe() {
      if (!this.token) { this.ready = true; return; }
      try {
        this.user = await api.me();
      } catch {
        this.logout();
      } finally {
        this.ready = true;
      }
    },
  },
});
