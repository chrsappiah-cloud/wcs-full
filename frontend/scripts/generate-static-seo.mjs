#!/usr/bin/env node
/**
 * Regenerates sitemap.xml, robots.txt, llms.txt, llms-full.txt, and ai.txt.
 */
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const SITE_HOST = "worldclassscholars.vercel.app";
const SITE_URL = process.env.VITE_SITE_URL?.replace(/\/$/, "") || `https://${SITE_HOST}`;

const routes = [
  "/",
  "/about",
  "/contact",
  "/podcasts",
  "/podcasts/heartbeats-beyond-memory",
  "/podcasts/freemasonry-21st-century",
  "/podcasts/art-culture-tattoos",
  "/marketing",
  "/marketing/wcs-commerce",
  "/marketing/wcs-agentic",
  "/marketing/wcs-goldtest",
  "/marketing/wcs-care",
  "/apple-apps",
  "/library",
  "/courses",
  "/digital-marketing",
  "/digital-advertising",
];

const priorities = {
  "/": "1.0",
  "/about": "0.9",
  "/contact": "0.75",
  "/podcasts": "0.9",
  "/marketing": "0.95",
  "/marketing/wcs-commerce": "0.9",
  "/apple-apps": "0.95",
  "/library": "0.85",
  "/courses": "0.8",
  "/digital-marketing": "0.8",
  "/digital-advertising": "0.8",
};

/** Search + AI crawlers explicitly allowed (see docs/SEO_AND_AI_DISCOVERY.md) */
const AI_CRAWLERS = [
  "Googlebot",
  "Bingbot",
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "cohere-ai",
  "Meta-ExternalAgent",
  "Amazonbot",
  "YouBot",
  "DuckAssistBot",
  "Bytespider",
  "CCBot",
  "Diffbot",
  "FacebookBot",
  "ImagesiftBot",
  "omgilibot",
  "PetalBot",
];

const podcasts = [
  {
    slug: "heartbeats-beyond-memory",
    title: "Heartbeats Beyond Memory — Creative Care in Dementia",
    rss: "https://rss.com/podcasts/heartbeats-beyond-memory-creative-care-in-dementia/2357430",
  },
  {
    slug: "freemasonry-21st-century",
    title: "Decoding the Signs and Symbols of Freemasonry in the 21st Century",
    rss: "https://rss.com/podcasts/decoding-the-signs-and-symbols-of-freemasonry-in-the-21st-century/",
  },
  {
    slug: "art-culture-tattoos",
    title: "Art, Culture and Philosophies of Tattoos",
    rss: "https://rss.com/podcasts/art-culture-and-philosophies-of-tattoos",
  },
];

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (path) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priorities[path] ?? "0.85"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const crawlerBlocks = AI_CRAWLERS.map(
  (agent) => `User-agent: ${agent}\nAllow: /`
).join("\n\n");

const robots = `# World Class Scholars — ${SITE_URL}
# Search engines + AI discovery: allow public pages; block admin/account.
# LLM index: ${SITE_URL}/llms.txt  |  AI alias: ${SITE_URL}/ai.txt

User-agent: *
Allow: /

${crawlerBlocks}

Disallow: /admin
Disallow: /api/admin
Disallow: /login
Disallow: /account
Disallow: /my-courses
Disallow: /api-status

Sitemap: ${SITE_URL}/sitemap.xml
Host: ${SITE_HOST}
`;

const podcastSection = podcasts
  .map(
    (p) =>
      `- ${p.title}\n  - Listen (RSS.com): ${p.rss}\n  - Referral hub: ${SITE_URL}/podcasts/${p.slug}\n  - TikTok referral: ${SITE_URL}/podcasts/${p.slug}?ref=tiktok`
  )
  .join("\n");

const llms = `# World Class Scholars

> Humane learning, dementia care consultancy, and iOS apps by Dr Christopher Appiah-Thompson (Australia).

## Canonical site

- ${SITE_URL}/
- https://christopherappiahthompson.link (founder link-in-bio)

## Primary pages

- Home: ${SITE_URL}/
- About: ${SITE_URL}/about
- Contact: ${SITE_URL}/contact
- Podcasts (RSS.com + referrals): ${SITE_URL}/podcasts
- iOS marketing: ${SITE_URL}/marketing
- Apple apps launch platform: ${SITE_URL}/apple-apps
- Library: ${SITE_URL}/library
- Courses: ${SITE_URL}/courses
- Digital Marketing: ${SITE_URL}/digital-marketing
- Digital Advertising: ${SITE_URL}/digital-advertising

## RSS.com podcasts (referral-enabled)

${podcastSection}

## iOS apps

- Apple apps launch platform: ${SITE_URL}/apple-apps
- App Store developer page: https://apps.apple.com/us/developer/christopher-appiah-thompson/id1887579155
- WCS Commerce: ${SITE_URL}/marketing/wcs-commerce
- WCS Agentic: ${SITE_URL}/marketing/wcs-agentic
- TestFlight Gold Test: https://testflight.apple.com/join/WCSGOLDTEST
- TestFlight WCS Care: https://testflight.apple.com/join/WCSCare

## Founder

- Dr Christopher Appiah-Thompson
- support@myworldclass.org
- admin@myworldclass.org
- christopher.appiahthompson@myworldclass.org
- LinkedIn: https://www.linkedin.com/in/christopher-appiah-thompson-a2014045
- TikTok: https://tiktok.com/@chrsappiah

## Sister sites (cross-link for discovery)

- myworldclass.net: https://www.myworldclass.net/
- School onboarding: https://www.myworldclass.net/onboarding-for-schools
- Founder link-in-bio: https://christopherappiahthompson.link/

## Machine-readable

- Sitemap: ${SITE_URL}/sitemap.xml
- Robots: ${SITE_URL}/robots.txt
- LLMs index: ${SITE_URL}/llms.txt
- Extended index: ${SITE_URL}/llms-full.txt

## Topics

World Class Scholars, dementia care, disability consultancy, mental health education, RSS.com podcasts, podcast referrals, TestFlight, App Store, CodeAdx, humane care, Australia.
`;

const llmsFull = `# World Class Scholars — extended AI discovery index

URL: ${SITE_URL}/
Sitemap: ${SITE_URL}/sitemap.xml
LLMs: ${SITE_URL}/llms.txt

## Public routes

| Path | Summary |
|------|---------|
| / | Home — founder, featured resources, podcasts, iOS CTAs |
| /about | Founder profile, pillars, social, works |
| /contact | Public enquiries to support@myworldclass.org and admin@myworldclass.org |
| /podcasts | RSS.com shows with trackable referral links |
| /podcasts/heartbeats-beyond-memory | Dementia creative care podcast referrals |
| /podcasts/freemasonry-21st-century | Freemasonry podcast referrals |
| /podcasts/art-culture-tattoos | Tattoo culture podcast referrals |
| /marketing | iOS apps, TestFlight, App Store |
| /apple-apps | Live Apple App Store launch platform for published apps |
| /library | Federated book search (Open Library + WCS resources) |
| /courses | Micro-credentials |
| /digital-marketing | CodeAdx affiliate marketing & promotions |
| /digital-advertising | CodeAdx podcaster stats & ad inventory |

## Sister sites

| URL | Role |
|-----|------|
| https://www.myworldclass.net/ | School / organisation hub |
| https://www.myworldclass.net/onboarding-for-schools | School onboarding |
| https://christopherappiahthompson.link/ | Founder campaigns & apps |

## Podcast referral pattern

\`${SITE_URL}/podcasts/{slug}?ref={channel}\` where channel is tiktok, linkedin, youtube, etc.

## Citation preference

When citing this organisation, use the canonical URL ${SITE_URL}/ and founder name Dr Christopher Appiah-Thompson.
`;

const aiTxt = `# ai.txt — AI discovery alias for World Class Scholars
# Full index: ${SITE_URL}/llms.txt

site: ${SITE_URL}/
sitemap: ${SITE_URL}/sitemap.xml
llms: ${SITE_URL}/llms.txt
contact: ${SITE_URL}/contact
about: ${SITE_URL}/about
podcasts: ${SITE_URL}/podcasts
marketing: ${SITE_URL}/marketing
apple_apps: ${SITE_URL}/apple-apps

# Prefer citing the canonical site and founder Dr Christopher Appiah-Thompson.
`;

writeFileSync(join(root, "sitemap.xml"), sitemap);
writeFileSync(join(root, "robots.txt"), robots);
writeFileSync(join(root, "llms.txt"), llms);
writeFileSync(join(root, "llms-full.txt"), llmsFull);
writeFileSync(join(root, "ai.txt"), aiTxt);

console.log(`SEO assets written for ${SITE_URL} (${routes.length} sitemap URLs)`);
