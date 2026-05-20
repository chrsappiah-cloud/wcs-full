/** Canonical site URL — override with VITE_SITE_URL at build time */
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://wcs-full.vercel.app").replace(/\/$/, "");

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
].join(", ");

export const founder = {
  name: "Dr Christopher Appiah-Thompson",
  email: "christopher.appiahthompson@myworldclass.org",
  url: "https://christopherappiahthompson.link",
  image: "https://0.gravatar.com/avatar/d8bd3742b066b58641607204c431fb47b6b32016887ba1a7b95e91279d7562d3?size=512",
  sameAs: [
    "https://www.linkedin.com/in/christopher-appiah-thompson-a2014045",
    "https://tiktok.com/@chrsappiah",
    "https://www.youtube.com/channel/UC2a-_QUygsGAKWzEdKHEP9Q",
    "https://christopherappiahthompson.link",
    "https://myworldclass.net",
    "https://wcs-art-verse.com",
  ],
};

export const publicRoutes = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.9", changefreq: "monthly" },
  { path: "/marketing", priority: "0.95", changefreq: "weekly" },
  { path: "/marketing/wcs-commerce", priority: "0.9", changefreq: "weekly" },
  { path: "/marketing/wcs-agentic", priority: "0.85", changefreq: "weekly" },
  { path: "/marketing/wcs-goldtest", priority: "0.85", changefreq: "weekly" },
  { path: "/marketing/wcs-care", priority: "0.85", changefreq: "weekly" },
  { path: "/library", priority: "0.85", changefreq: "weekly" },
  { path: "/courses", priority: "0.8", changefreq: "monthly" },
  { path: "/future-lab", priority: "0.75", changefreq: "monthly" },
  { path: "/art-verse", priority: "0.75", changefreq: "monthly" },
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
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: founder.email,
      areaServed: "AU",
      availableLanguage: "English",
    },
  };
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
}
