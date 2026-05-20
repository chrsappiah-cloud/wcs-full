/**
 * Marketing portal data — sourced from https://christopherappiahthompson.link
 * (Gravatar profile JSON + public link-in-bio, May 2026).
 */

export const founderProfile = {
  name: "Dr Christopher Appiah-Thompson",
  title: "Founder, World Class Scholars",
  location: "Australia",
  email: "christopher.appiahthompson@myworldclass.org",
  phone: "0403138328",
  profileUrl: "https://christopherappiahthompson.link",
  avatar:
    "https://0.gravatar.com/avatar/d8bd3742b066b58641607204c431fb47b6b32016887ba1a7b95e91279d7562d3?size=512",
  bio:
    "Global consultancy championing equity, dignity, and social justice in disability, mental health, and dementia care — bridging research, practice, lived experience, and creative storytelling.",
};

/** Verified social handles from Gravatar / link-in-bio */
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
    handle: "UC2a-_QUygsGAKWzEdKHEP9Q",
    url: "https://www.youtube.com/channel/UC2a-_QUygsGAKWzEdKHEP9Q",
    icon: "yt",
  },
  {
    id: "facebook",
    label: "Facebook",
    handle: "Verified via Gravatar",
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

/** Digital artwork & creative platforms from link-in-bio */
export const digitalArtworks = [
  {
    label: "WCS Art Verse",
    category: "Gallery",
    url: "https://wcs-art-verse.com",
    image: null,
  },
  {
    label: "NightCafe — CKRIZ",
    category: "AI digital art",
    url: "https://creator.nightcafe.studio/u/CKRIZ",
    image: null,
  },
  {
    label: "Gumroad — healing arts download",
    category: "Digital product",
    url: "https://chrspiah.gumroad.com/l/qylmdn",
    image: null,
  },
  {
    label: "myworldclass.net",
    category: "Brand hub",
    url: "https://myworldclass.net",
    image: null,
  },
  {
    label: "WCS Future Lab",
    category: "Research lab",
    url: "https://www.wcsflab.com/",
    image: null,
  },
];

export const podcasts = [
  {
    label: "Heartbeats Beyond Memory — Creative Care in Dementia",
    url: "https://rss.com/podcasts/heartbeats-beyond-memory-creative-care-in-dementia/2357430",
  },
  {
    label: "Decoding the Signs and Symbols of Freemasonry in the 21st Century",
    url: "https://rss.com/podcasts/decoding-the-signs-and-symbols-of-freemasonry-in-the-21st-century/",
  },
  {
    label: "Art, Culture and Philosophies of Tattoos",
    url: "https://rss.com/podcasts/art-culture-and-philosophies-of-tattoos",
  },
];

const SITE_ORIGIN =
  typeof window !== "undefined" ? window.location.origin : "https://wcs-full.vercel.app";

/**
 * iOS apps promoted via TestFlight — update `testFlightCode` when App Store Connect
 * public links are issued. Referral URLs route through this site for attribution.
 */
export const iosApps = [
  {
    slug: "wcs-commerce",
    name: "WCS Commerce",
    tagline: "Server-first subscriptions, entitlements & middleware activation",
    description:
      "Pilot commerce platform for premium membership, AI tutor packs, and specialist unlocks — aligned with the WCS commerce backend contract.",
    bundleId: "wcs.wcs-ios",
    testFlightCode: null,
    testFlightUrl: null,
    accent: "#4f98a3",
    artworkLabel: "Commerce platform",
    features: ["StoreKit pilot catalog", "Integration simulator", "Entitlement ledger"],
  },
  {
    slug: "wcs-agentic",
    name: "WCS Agentic",
    tagline: "Agentic operations for scholarship workflows",
    description:
      "iOS command surface for WCS agentic platform operations, onboarding flows, and TestFlight-ready release automation.",
    bundleId: "wcs.WCS-Agentic",
    testFlightCode: null,
    testFlightUrl: null,
    accent: "#8ef2ff",
    artworkLabel: "Agentic campus",
    features: ["Operations dashboard", "Platform agents", "Release CI/CD"],
  },
  {
    slug: "wcs-goldtest",
    name: "WCS Gold Test",
    tagline: "Gold-standard TestFlight validation harness",
    description:
      "Reference build for validating TestFlight invite flows and public beta distribution patterns across the WCS iOS portfolio.",
    bundleId: "wcs.WCS-GoldTest",
    testFlightCode: "WCSGOLDTEST",
    testFlightUrl: "https://testflight.apple.com/join/WCSGOLDTEST",
    accent: "#c9a227",
    artworkLabel: "Gold test",
    features: ["Public invite link", "Status surface", "Campaign QA"],
  },
  {
    slug: "wcs-care",
    name: "WCS Care",
    tagline: "Humane aged-care & dementia support experiences",
    description:
      "Care-sector iOS experience with direct TestFlight join for field pilots and social referral campaigns.",
    bundleId: "wcs.care",
    testFlightCode: "WCSCare",
    testFlightUrl: "https://testflight.apple.com/join/WCSCare",
    accent: "#01696f",
    artworkLabel: "Care pilot",
    features: ["TestFlight join", "Marketing config", "Care storytelling"],
  },
];

iosApps.forEach((app) => {
  if (app.testFlightCode && !app.testFlightUrl) {
    app.testFlightUrl = `https://testflight.apple.com/join/${app.testFlightCode}`;
  }
});

export function marketingLandingUrl(appSlug, channelId) {
  const params = new URLSearchParams();
  if (channelId) params.set("ref", channelId);
  const query = params.toString();
  return `${SITE_ORIGIN}/marketing/${appSlug}${query ? `?${query}` : ""}`;
}

export function buildReferralLink(appSlug, channelId) {
  return marketingLandingUrl(appSlug, channelId);
}

export function resolveAttribution(searchParams) {
  const ref = searchParams.get("ref") ?? searchParams.get("utm_source") ?? "direct";
  const campaign = searchParams.get("utm_campaign") ?? searchParams.get("app") ?? "";
  return { ref, campaign };
}

export function findApp(slug) {
  return iosApps.find((app) => app.slug === slug) ?? null;
}
