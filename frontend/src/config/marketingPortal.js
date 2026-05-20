/**
 * Marketing portal — sourced from https://christopherappiahthompson.link
 */

import { DEFAULT_SITE_URL } from "./site.js";
import { rssPodcasts } from "./podcasts.js";
import { founderLinkPromotions, FOUNDER_PROFILE_URL } from "./founderLinkPromotions.js";

export { FOUNDER_PROFILE_URL };

export const founderProfile = {
  name: "Dr Christopher Appiah-Thompson",
  title: "Founder, World Class Scholars",
  location: "Australia",
  email: "christopher.appiahthompson@myworldclass.org",
  personalEmail: "chrsappiah@gmail.com",
  phone: "0403138328",
  profileUrl: "https://christopherappiahthompson.link",
  avatar:
    "https://0.gravatar.com/avatar/d8bd3742b066b58641607204c431fb47b6b32016887ba1a7b95e91279d7562d3?size=512",
  bio:
    "Global consultancy championing equity, dignity, and social justice in disability, mental health, and dementia care — bridging research, practice, lived experience, and creative storytelling.",
};

export const socialChannels = [
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "christopher-appiah-thompson-a2014045",
    url: "https://www.linkedin.com/in/christopher-appiah-thompson-a2014045",
    icon: "in",
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@chrsappiah",
    url: "https://tiktok.com/@chrsappiah",
    icon: "tk",
  },
  {
    id: "youtube",
    label: "YouTube",
    handle: "World Class Scholars",
    url: "https://www.youtube.com/channel/UC2a-_QUygsGAKWzEdKHEP9Q",
    icon: "yt",
  },
  {
    id: "facebook",
    label: "Facebook",
    handle: "Verified profile",
    url: "https://christopherappiahthompson.link/facebook",
    icon: "fb",
  },
  {
    id: "paypal",
    label: "PayPal",
    handle: "christopherappiahthompson",
    url: "https://paypal.me/christopherappiahthompson",
    icon: "pp",
  },
];

/** Promotional tiles with preview images from christopherappiahthompson.link */
export const digitalArtworks = [
  ...founderLinkPromotions,
  {
    id: "wcs-digital-marketing",
    title: "Digital Marketing — WCS",
    category: "On-site program",
    url: `${DEFAULT_SITE_URL}/digital-marketing`,
    imageUrl: founderLinkPromotions.find((p) => p.id === "wcs-art-verse")?.imageUrl,
  },
  {
    id: "codeadx-stats",
    title: "CodeAdx Podcaster Stats",
    category: "Advertising",
    url: "https://app.codeadx.com/podcaster/stats",
    imageUrl: founderLinkPromotions.find((p) => p.id === "freemasonry")?.imageUrl,
  },
];

export { podcasts, rssPodcasts, findPodcast } from "./podcasts.js";

/** Apple surfaces shown on the public marketing site (no developer/API links). */
export const publicAppleStoreServices = [
  {
    id: "testflight",
    label: "TestFlight",
    description: "Install WCS iOS betas before App Store release.",
    url: "https://testflight.apple.com/",
    action: "Open TestFlight",
  },
  {
    id: "app-store",
    label: "App Store",
    description: "Discover and purchase WCS apps when published on the App Store.",
    url: "https://apps.apple.com/developer/world-class-scholars/id0",
    action: "Browse App Store",
    fallbackSearch: "https://apps.apple.com/search?term=World+Class+Scholars",
  },
];

/** WCS Commerce catalog — matches wcs-ios pilot StoreKit products */
export const storeProducts = [
  {
    productId: "wcs_premium_monthly",
    name: "WCS Premium Monthly",
    type: "Auto-renewable subscription",
    entitlement: "premium_membership",
    appSlug: "wcs-commerce",
  },
  {
    productId: "wcs_ai_tutor_pack_10",
    name: "AI Tutor Pack (10)",
    type: "Consumable",
    entitlement: "ai_tutor_credits",
    appSlug: "wcs-commerce",
  },
  {
    productId: "wcs_exam_pack_unlock",
    name: "Exam Pack Unlock",
    type: "Non-consumable",
    entitlement: "specialist_tool_unlock",
    appSlug: "wcs-commerce",
  },
];

/** Commerce API paths on the WCS backend (proxied when WCS_COMMERCE_BASE_URL is set) */
export const commerceApiEndpoints = [
  { method: "GET", path: "/v1/catalog", purpose: "Pilot product catalog" },
  { method: "POST", path: "/v1/purchases/app-account-token", purpose: "App account token for StoreKit" },
  { method: "POST", path: "/v1/purchases/ingest", purpose: "Ingest signed App Store transaction" },
  { method: "GET", path: "/v1/entitlements/me", purpose: "Current entitlements" },
  { method: "POST", path: "/v1/purchases/reconcile", purpose: "Restore purchases" },
  { method: "POST", path: "/v1/apple/notifications", purpose: "App Store Server Notifications webhook" },
  { method: "GET", path: "/v1/offers/eligibility", purpose: "Promotional offer eligibility" },
  { method: "POST", path: "/v1/offers/signature", purpose: "Signed offer for StoreKit" },
];

const SITE_ORIGIN = typeof window !== "undefined" ? window.location.origin : DEFAULT_SITE_URL;

export const iosApps = [
  {
    slug: "wcs-commerce",
    name: "WCS Commerce",
    tagline: "Premium membership, tutor packs & specialist unlocks via the App Store",
    description:
      "Purchase subscriptions and consumables through the App Store. Entitlements sync across your WCS account.",
    bundleId: "wcs.wcs-ios",
    appStoreSearchUrl: "https://apps.apple.com/search?term=WCS+Commerce",
    testFlightCode: null,
    testFlightUrl: null,
    accent: "#4f98a3",
    products: storeProducts,
  },
  {
    slug: "wcs-agentic",
    name: "WCS Agentic",
    tagline: "Scholarship operations on iPhone & iPad",
    description: "Agentic workflows for World Class Scholars platform teams and pilot partners.",
    bundleId: "wcs.WCS-Agentic",
    appStoreSearchUrl: "https://apps.apple.com/search?term=WCS+Agentic",
    testFlightCode: null,
    testFlightUrl: null,
    accent: "#8ef2ff",
    products: [],
  },
  {
    slug: "wcs-goldtest",
    name: "WCS Gold Test",
    tagline: "Public TestFlight beta harness",
    description: "Join the gold-standard beta channel to validate releases before wider campaigns.",
    bundleId: "wcs.WCS-GoldTest",
    appStoreSearchUrl: "https://apps.apple.com/search?term=WCS+Gold",
    testFlightCode: "WCSGOLDTEST",
    testFlightUrl: "https://testflight.apple.com/join/WCSGOLDTEST",
    accent: "#c9a227",
    products: [],
  },
  {
    slug: "wcs-care",
    name: "WCS Care",
    tagline: "Dementia & aged-care field pilot",
    description: "Humane care experiences with a live TestFlight join link for referral campaigns.",
    bundleId: "wcs.care",
    appStoreSearchUrl: "https://apps.apple.com/search?term=WCS+Care",
    testFlightCode: "WCSCare",
    testFlightUrl: "https://testflight.apple.com/join/WCSCare",
    accent: "#01696f",
    products: [],
  },
];

iosApps.forEach((app) => {
  if (app.testFlightCode && !app.testFlightUrl) {
    app.testFlightUrl = `https://testflight.apple.com/join/${app.testFlightCode}`;
  }
});

export const marketingTabs = [
  { id: "apps", label: "Apps & referrals" },
  { id: "testflight", label: "TestFlight beta" },
  { id: "app-store", label: "App Store purchase" },
];

export function marketingLandingUrl(appSlug, channelId) {
  const params = new URLSearchParams();
  if (channelId) params.set("ref", channelId);
  const query = params.toString();
  return `${SITE_ORIGIN}/marketing/${appSlug}${query ? `?${query}` : ""}`;
}

export function buildReferralLink(appSlug, channelId) {
  return marketingLandingUrl(appSlug, channelId);
}

export function podcastLandingUrl(podcastSlug, channelId) {
  const params = new URLSearchParams();
  if (channelId) params.set("ref", channelId);
  const query = params.toString();
  return `${SITE_ORIGIN}/podcasts/${podcastSlug}${query ? `?${query}` : ""}`;
}

export function buildPodcastReferralLink(podcastSlug, channelId) {
  return podcastLandingUrl(podcastSlug, channelId);
}

function queryValue(searchParams, key) {
  if (!searchParams) return undefined;
  if (typeof searchParams.get === "function") return searchParams.get(key) ?? undefined;
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

/** Accepts URLSearchParams or Vue Router `route.query` object. */
export function resolveAttribution(searchParams) {
  const ref = queryValue(searchParams, "ref") ?? queryValue(searchParams, "utm_source") ?? "direct";
  const campaign =
    queryValue(searchParams, "utm_campaign") ?? queryValue(searchParams, "app") ?? "";
  return { ref, campaign };
}

export function findApp(slug) {
  return iosApps.find((app) => app.slug === slug) ?? null;
}

/** JSON bundle for TestFlight campaign tooling and beta testers */
export function buildBetaManifest() {
  const generatedAt = new Date().toISOString();
  return {
    schema: "wcs-ios-beta-manifest/1.0",
    generatedAt,
    founder: founderProfile,
    socialChannels,
    apps: iosApps.map((app) => ({
      slug: app.slug,
      name: app.name,
      bundleId: app.bundleId,
      testFlightUrl: app.testFlightUrl,
      testFlightCode: app.testFlightCode,
      appStoreSearchUrl: app.appStoreSearchUrl,
      referralLinks: Object.fromEntries(
        socialChannels.map((ch) => [ch.id, buildReferralLink(app.slug, ch.id)])
      ),
      products: app.products ?? [],
    })),
    storeProducts,
    appleStoreServices: publicAppleStoreServices,
    podcasts: rssPodcasts.map((p) => ({
      slug: p.slug,
      label: p.label,
      rssUrl: p.rssUrl,
      referralLinks: Object.fromEntries(
        socialChannels.map((ch) => [ch.id, buildPodcastReferralLink(p.slug, ch.id)])
      ),
    })),
  };
}

export function downloadBetaManifest(filename = "wcs-ios-beta-manifest.json") {
  const blob = new Blob([JSON.stringify(buildBetaManifest(), null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
