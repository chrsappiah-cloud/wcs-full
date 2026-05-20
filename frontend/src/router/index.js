import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.js";
import { applyPageSeo } from "../lib/seo.js";

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
import MarketingPortalView from "../views/MarketingPortalView.vue";
import DashboardView     from "../views/admin/DashboardView.vue";
import CmsView           from "../views/admin/CmsView.vue";
import PublishingView    from "../views/admin/PublishingView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, saved) {
    return saved ?? { top: 0, behavior: "smooth" };
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        seoTitle: "Home",
        seoDescription:
          "World Class Scholars — consultancy, courses, library, and iOS apps by Dr Christopher Appiah-Thompson.",
      },
    },
    {
      path: "/library",
      name: "library",
      component: LibraryView,
      meta: {
        seoTitle: "Library search",
        seoDescription: "Search books and open resources across scholarly and public catalogs.",
      },
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
      meta: {
        seoTitle: "Dr Christopher Appiah-Thompson",
        seoDescription:
          "Founder profile — consultancy, education, digital art, podcasts, and social links.",
      },
    },
    {
      path: "/courses",
      name: "courses",
      component: CoursesView,
      meta: {
        seoTitle: "Courses & micro-credentials",
        seoDescription: "Learning pathways for care and community services leaders.",
      },
    },
    {
      path: "/future-lab",
      name: "future-lab",
      component: FutureLabView,
      meta: {
        seoTitle: "Future Lab",
        seoDescription: "WCS Future Lab research and innovation showcase.",
      },
    },
    {
      path: "/art-verse",
      name: "art-verse",
      component: ArtVerseView,
      meta: {
        seoTitle: "Art Verse",
        seoDescription: "WCS Art Verse — digital gallery and creative healing arts.",
      },
    },
    {
      path: "/resources/:slug",
      name: "resource",
      component: ResourceView,
      props: true,
      meta: {
        seoTitle: "Resource",
        seoDescription: "WCS toolkit resource page.",
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      meta: { robots: "noindex, nofollow" },
    },
    {
      path: "/api-status",
      name: "api-status",
      component: ApiStatusView,
      meta: { robots: "noindex, nofollow" },
    },
    {
      path: "/marketing",
      name: "marketing",
      component: MarketingPortalView,
      meta: {
        seoTitle: "iOS apps, TestFlight & App Store",
        seoDescription:
          "TestFlight beta downloads, social referral links, and App Store purchases for WCS iOS apps.",
      },
    },
    {
      path: "/marketing/:appSlug",
      name: "marketing-app",
      component: MarketingPortalView,
      props: true,
      meta: {
        seoTitle: "iOS app referrals",
        seoDescription: "Trackable referral links and TestFlight install for WCS iOS apps.",
      },
    },

    { path: "/my-courses", name: "my-courses", component: MyCoursesView, meta: { requiresAuth: true, robots: "noindex, nofollow" } },
    { path: "/admin", name: "admin", component: DashboardView, meta: { requiresAdmin: true, robots: "noindex, nofollow" } },
    { path: "/admin/cms", name: "admin-cms", component: CmsView, meta: { requiresAdmin: true, robots: "noindex, nofollow" } },
    { path: "/admin/publishing", name: "admin-pub", component: PublishingView, meta: { requiresAdmin: true, robots: "noindex, nofollow" } },
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

router.afterEach((to) => {
  applyPageSeo({
    title: to.meta.seoTitle,
    description: to.meta.seoDescription,
    path: to.fullPath.split("?")[0],
    robots: to.meta.robots,
  });
});

export default router;
