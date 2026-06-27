import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth.js";
import { applyPageSeo } from "../lib/seo.js";

import HomeView          from "../views/HomeView.vue";
import LibraryView       from "../views/LibraryView.vue";
import AboutView         from "../views/AboutView.vue";
import CoursesView       from "../views/CoursesView.vue";
import CodeAdxProgramView from "../views/CodeAdxProgramView.vue";
import PodcastsView from "../views/PodcastsView.vue";
import PodcastDetailView from "../views/PodcastDetailView.vue";
import ResourceView      from "../views/ResourceView.vue";
import LoginView         from "../views/LoginView.vue";
import MyCoursesView     from "../views/MyCoursesView.vue";
import AccountAccessView from "../views/AccountAccessView.vue";
import ApiStatusView     from "../views/ApiStatusView.vue";
import MarketingPortalView from "../views/MarketingPortalView.vue";
import AppleAppsLaunchView from "../views/AppleAppsLaunchView.vue";
import DashboardView     from "../views/admin/DashboardView.vue";
import CmsView           from "../views/admin/CmsView.vue";
import PublishingView    from "../views/admin/PublishingView.vue";
import AccessView        from "../views/admin/AccessView.vue";
import AnalyticsDashboardView from "../views/admin/AnalyticsDashboardView.vue";
import ContactView from "../views/ContactView.vue";
import EnquiriesView from "../views/admin/EnquiriesView.vue";
import SystemView from "../views/admin/SystemView.vue";
import PaymentsAdminView from "../views/admin/PaymentsAdminView.vue";

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
      path: "/podcasts",
      name: "podcasts",
      component: PodcastsView,
      meta: {
        seoTitle: "RSS.com podcasts",
        seoDescription:
          "Heartbeats Beyond Memory, Freemasonry, and tattoo culture podcasts on RSS.com with trackable social referral links.",
      },
    },
    {
      path: "/podcasts/:slug",
      name: "podcast-detail",
      component: PodcastDetailView,
      props: true,
      meta: {
        seoTitle: "Podcast referrals",
        seoDescription: "Trackable referral links and RSS.com subscribe for World Class Scholars podcasts.",
      },
    },
    {
      path: "/digital-marketing",
      name: "digital-marketing",
      component: CodeAdxProgramView,
      meta: {
        programSlug: "digital-marketing",
        seoTitle: "Digital Marketing — CodeAdx",
        seoDescription:
          "Digital marketing promotions — podcasts, Gumroad, NightCafe, and creative campaigns via CodeAdx and christopherappiahthompson.link.",
      },
    },
    {
      path: "/digital-advertising",
      name: "digital-advertising",
      component: CodeAdxProgramView,
      meta: {
        programSlug: "digital-advertising",
        seoTitle: "Digital Advertising — CodeAdx",
        seoDescription:
          "Podcast and display advertising analytics through the CodeAdx podcaster stats dashboard.",
      },
    },
    { path: "/future-lab", redirect: "/digital-marketing" },
    { path: "/art-verse", redirect: "/digital-advertising" },
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
      meta: { requiresAdmin: true, robots: "noindex, nofollow" },
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
      path: "/apple-apps",
      name: "apple-apps",
      component: AppleAppsLaunchView,
      meta: {
        seoTitle: "Apple apps by Christopher Appiah-Thompson",
        seoDescription:
          "Official launch platform for live Apple App Store apps by Christopher Appiah-Thompson, with App Store icons, pricing, categories, and download links.",
      },
    },
    {
      path: "/contact",
      name: "contact",
      component: ContactView,
      meta: {
        seoTitle: "Contact & feedback",
        seoDescription:
          "Send general enquiries and feedback to World Class Scholars support, or contact administration for partnerships.",
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
    {
      path: "/account",
      name: "account",
      component: AccountAccessView,
      meta: {
        requiresAuth: true,
        seoTitle: "My access",
        seoDescription: "Subscriptions, entitlements, and course access for your World Class Scholars account.",
        robots: "noindex, nofollow",
      },
    },
    { path: "/admin", name: "admin", component: DashboardView, meta: { requiresAdmin: true, robots: "noindex, nofollow" } },
    {
      path: "/admin/analytics",
      name: "admin-analytics",
      component: AnalyticsDashboardView,
      meta: { requiresAdmin: true, robots: "noindex, nofollow" },
    },
    {
      path: "/admin/enquiries",
      name: "admin-enquiries",
      component: EnquiriesView,
      meta: { requiresAdmin: true, robots: "noindex, nofollow" },
    },
    {
      path: "/admin/payments",
      name: "admin-payments",
      component: PaymentsAdminView,
      meta: { requiresAdmin: true, robots: "noindex, nofollow" },
    },
    {
      path: "/admin/system",
      name: "admin-system",
      component: SystemView,
      meta: { requiresAdmin: true, robots: "noindex, nofollow" },
    },
    { path: "/admin/cms", name: "admin-cms", component: CmsView, meta: { requiresAdmin: true, robots: "noindex, nofollow" } },
    { path: "/admin/publishing", name: "admin-pub", component: PublishingView, meta: { requiresAdmin: true, robots: "noindex, nofollow" } },
    { path: "/admin/access", name: "admin-access", component: AccessView, meta: { requiresAdmin: true, robots: "noindex, nofollow" } },
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
    googleSiteVerification: import.meta.env.VITE_GOOGLE_SITE_VERIFICATION,
  });
});

export default router;
