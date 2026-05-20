import { resolveSiteUrl } from "../config/site.js";
import { ADMIN_EMAIL, SUPPORT_EMAIL } from "../config/contactEmails.js";
import { rssPodcasts } from "../config/podcasts.js";

/** Canonical site URL — override with VITE_SITE_URL at build time */
export const SITE_URL = resolveSiteUrl(import.meta.env.VITE_SITE_URL);

export const siteName = "World Class Scholars";
export const siteTagline = "Humane learning, dementia care consultancy & iOS apps by Dr Christopher Appiah-Thompson";
export const defaultDescription =
  "World Class Scholars — global consultancy in disability, mental health and dementia care. Courses, library, digital art, podcasts, TestFlight iOS apps, and App Store subscriptions.";

export const defaultKeywords = [
  "World Class Scholars",
  "Christopher Appiah-Thompson",
  "dementia care",
  "disability consultancy",
  "mental health education",
  "TestFlight",
  "WCS Commerce",
  "App Store",
  "humane care",
  "Australia",
  "RSS.com podcasts",
  "podcast referrals",
  "World Class Scholars podcasts",
].join(", ");

export const founder = {
  name: "Dr Christopher Appiah-Thompson",
  email: "christopher.appiahthompson@myworldclass.org",
  personalEmail: "chrsappiah@gmail.com",
  url: "https://christopherappiahthompson.link",
  image: "https://0.gravatar.com/avatar/d8bd3742b066b58641607204c431fb47b6b32016887ba1a7b95e91279d7562d3?size=512",
  sameAs: [
    "https://www.linkedin.com/in/christopher-appiah-thompson-a2014045",
    "https://tiktok.com/@chrsappiah",
    "https://www.youtube.com/channel/UC2a-_QUygsGAKWzEdKHEP9Q",
    "https://christopherappiahthompson.link",
    "https://myworldclass.net",
    "https://app.codeadx.com",
    "https://rss.com",
  ],
};

export const publicRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.9", changefreq: "monthly" },
  { path: "/podcasts", priority: "0.9", changefreq: "weekly" },
  ...rssPodcasts.map((p) => ({
    path: `/podcasts/${p.slug}`,
    priority: "0.88",
    changefreq: "weekly",
  })),
  { path: "/marketing", priority: "0.95", changefreq: "weekly" },
  { path: "/marketing/wcs-commerce", priority: "0.9", changefreq: "weekly" },
  { path: "/marketing/wcs-agentic", priority: "0.85", changefreq: "weekly" },
  { path: "/marketing/wcs-goldtest", priority: "0.85", changefreq: "weekly" },
  { path: "/marketing/wcs-care", priority: "0.85", changefreq: "weekly" },
  { path: "/library", priority: "0.85", changefreq: "weekly" },
  { path: "/courses", priority: "0.8", changefreq: "monthly" },
  { path: "/digital-marketing", priority: "0.8", changefreq: "weekly" },
  { path: "/digital-advertising", priority: "0.8", changefreq: "weekly" },
  { path: "/contact", priority: "0.75", changefreq: "monthly" },
];

export function absoluteUrl(path = "/") {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: SITE_URL,
    logo: founder.image,
    description: defaultDescription,
    founder: {
      "@type": "Person",
      name: founder.name,
      email: founder.email,
      url: founder.url,
      sameAs: founder.sameAs,
    },
    sameAs: founder.sameAs,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: SUPPORT_EMAIL,
        areaServed: "AU",
        availableLanguage: "English",
      },
      {
        "@type": "ContactPoint",
        contactType: "administrative",
        email: ADMIN_EMAIL,
        areaServed: "AU",
        availableLanguage: "English",
      },
    ],
  };
}

export function podcastsJsonLd() {
  return rssPodcasts.map((pod) => ({
    "@context": "https://schema.org",
    "@type": "PodcastSeries",
    name: pod.label,
    description: pod.description,
    url: absoluteUrl(`/podcasts/${pod.slug}`),
    webFeed: pod.rssUrl,
    author: {
      "@type": "Person",
      name: founder.name,
      url: founder.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: SITE_URL,
    },
    potentialAction: {
      "@type": "ListenAction",
      target: pod.rssUrl,
    },
  }));
}

/** Inject podcast schema into document (SPA). */
export function injectPodcastJsonLd() {
  if (typeof document === "undefined") return;
  const id = "wcs-podcasts-jsonld";
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": podcastsJsonLd(),
  });
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: SITE_URL,
    description: defaultDescription,
    publisher: { "@type": "Organization", name: siteName },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/library?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/** Apply route-level SEO to document head (SPA) */
export function applyPageSeo(meta = {}) {
  const title = meta.title ? `${meta.title} | ${siteName}` : siteName;
  const description = meta.description || defaultDescription;
  const url = absoluteUrl(meta.path || "/");
  const image = meta.image || founder.image;
  const robots = meta.robots || "index, follow, max-image-preview:large";

  document.title = title;
  upsertLink("canonical", url);
  upsertMeta("name", "description", description);
  upsertMeta("name", "keywords", meta.keywords || defaultKeywords);
  upsertMeta("name", "robots", robots);
  upsertMeta("name", "author", founder.name);

  upsertMeta("property", "og:type", meta.ogType || "website");
  upsertMeta("property", "og:site_name", siteName);
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:image", image);
  upsertMeta("property", "og:locale", "en_AU");

  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:image", image);

  upsertMeta("name", "googlebot", "index, follow");
  upsertMeta("name", "bingbot", "index, follow");

  upsertMeta("name", "ai-content-declaration", "public-indexable");
  upsertLink("alternate", `${SITE_URL}/llms.txt`);
}
