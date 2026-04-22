import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.js";

import HomeView          from "../views/HomeView.vue";
import LibraryView       from "../views/LibraryView.vue";
import AboutView         from "../views/AboutView.vue";
import CoursesView       from "../views/CoursesView.vue";
import FutureLabView     from "../views/FutureLabView.vue";
import ArtVerseView      from "../views/ArtVerseView.vue";
import ResourceView      from "../views/ResourceView.vue";
import LoginView         from "../views/LoginView.vue";
import MyCoursesView     from "../views/MyCoursesView.vue";
import ApiStatusView     from "../views/ApiStatusView.vue";
import DashboardView     from "../views/admin/DashboardView.vue";
import CmsView           from "../views/admin/CmsView.vue";
import PublishingView    from "../views/admin/PublishingView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, saved) {
    return saved ?? { top: 0, behavior: "smooth" };
  },
  routes: [
    { path: "/",             name: "home",       component: HomeView },
    { path: "/library",      name: "library",    component: LibraryView },
    { path: "/about",        name: "about",      component: AboutView },
    { path: "/courses",      name: "courses",    component: CoursesView },
    { path: "/future-lab",   name: "future-lab", component: FutureLabView },
    { path: "/art-verse",    name: "art-verse",  component: ArtVerseView },
    { path: "/resources/:slug", name: "resource", component: ResourceView, props: true },
    { path: "/login",        name: "login",      component: LoginView },
    { path: "/api-status",   name: "api-status", component: ApiStatusView },

    // Authenticated
    { path: "/my-courses",   name: "my-courses", component: MyCoursesView, meta: { requiresAuth: true } },

    // Admin
    { path: "/admin",            name: "admin",       component: DashboardView, meta: { requiresAdmin: true } },
    { path: "/admin/cms",        name: "admin-cms",   component: CmsView,       meta: { requiresAdmin: true } },
    { path: "/admin/publishing", name: "admin-pub",   component: PublishingView, meta: { requiresAdmin: true } },
  ],
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();
  if (!auth.ready) await auth.fetchMe();

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: "login" };
  }
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: "login" };
  }
});

export default router;
