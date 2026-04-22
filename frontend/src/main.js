import { createApp } from "vue";
import { createPinia } from "pinia";
import { RouterLink, RouterView } from "vue-router";
import App from "./App.vue";
import router from "./router/index.js";
import "./assets/styles.css";

const app = createApp(App);
app.component("RouterLink", RouterLink);
app.component("RouterView", RouterView);
app.use(createPinia());
app.use(router);
app.mount("#app");
