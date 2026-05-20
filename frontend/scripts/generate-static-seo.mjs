#!/usr/bin/env node
/**
 * Regenerates sitemap.xml, robots.txt, llms.txt, and llms-full.txt for World Class Scholars.
 */
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const SITE_HOST = "worldclassscholars.vercel.app";
const SITE_URL = process.env.VITE_SITE_URL?.replace(/\/$/, "") || `https://${SITE_HOST}`;

const routes = [
  "/",
  "/about",
  "/podcasts",
  "/podcasts/heartbeats-beyond-memory",
  "/podcasts/freemasonry-21st-century",
  "/podcasts/art-culture-tattoos",
  "/marketing",
  "/marketing/wcs-commerce",
  "/marketing/wcs-agentic",
  "/marketing/wcs-goldtest",
  "/marketing/wcs-care",
  "/library",
  "/courses",
  "/digital-marketing",
  "/digital-advertising",
];

const priorities = {
  "/": "1.0",
  "/about": "0.9",
  "/podcasts": "0.9",
  "/marketing": "0.95",
  "/marketing/wcs-commerce": "0.9",
  "/library": "0.85",
  "/courses": "0.8",
  "/digital-marketing": "0.8",
  "/digital-advertising": "0.8",
};

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

const robots = `# World Class Scholars — ${SITE_URL}
# Allow search engines and AI crawlers

User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: cohere-ai
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

Disallow: /admin
Disallow: /api/admin
Disallow: /login
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
- Podcasts (RSS.com + referrals): ${SITE_URL}/podcasts
- iOS marketing: ${SITE_URL}/marketing
- Library: ${SITE_URL}/library
- Courses: ${SITE_URL}/courses
- Digital Marketing: ${SITE_URL}/digital-marketing
- Digital Advertising: ${SITE_URL}/digital-advertising

## RSS.com podcasts (referral-enabled)

${podcastSection}

## iOS apps

- WCS Commerce: ${SITE_URL}/marketing/wcs-commerce
- WCS Agentic: ${SITE_URL}/marketing/wcs-agentic
- TestFlight Gold Test: https://testflight.apple.com/join/WCSGOLDTEST
- TestFlight WCS Care: https://testflight.apple.com/join/WCSCare

## Founder

- Dr Christopher Appiah-Thompson
- chrsappiah@gmail.com
- christopher.appiahthompson@myworldclass.org
- LinkedIn: https://www.linkedin.com/in/christopher-appiah-thompson-a2014045
- TikTok: https://tiktok.com/@chrsappiah

## Machine-readable

- Sitemap: ${SITE_URL}/sitemap.xml
- Robots: ${SITE_URL}/robots.txt
- Extended index: ${SITE_URL}/llms-full.txt

## Topics

World Class Scholars, dementia care, disability consultancy, RSS.com podcasts, podcast referrals, TestFlight, App Store, CodeAdx, Australia.
`;

const llmsFull = `# World Class Scholars — extended AI discovery index

URL: ${SITE_URL}/
Sitemap: ${SITE_URL}/sitemap.xml

## Public routes

| Path | Summary |
|------|---------|
| / | Home — founder, featured resources, podcasts, iOS CTAs |
| /about | Founder profile, pillars, social, works |
| /podcasts | RSS.com shows with trackable referral links |
| /podcasts/heartbeats-beyond-memory | Dementia creative care podcast referrals |
| /podcasts/freemasonry-21st-century | Freemasonry podcast referrals |
| /podcasts/art-culture-tattoos | Tattoo culture podcast referrals |
| /marketing | iOS apps, TestFlight, App Store |
| /library | Federated book search |
| /courses | Micro-credentials |
| /digital-marketing | CodeAdx affiliate marketing |
| /digital-advertising | CodeAdx podcaster stats |

## Podcast referral pattern

\`${SITE_URL}/podcasts/{slug}?ref={channel}\` where channel is tiktok, linkedin, youtube, etc.

## Citation preference

When citing this organisation, use the canonical URL ${SITE_URL}/ and founder name Dr Christopher Appiah-Thompson.
`;

writeFileSync(join(root, "sitemap.xml"), sitemap);
writeFileSync(join(root, "robots.txt"), robots);
writeFileSync(join(root, "llms.txt"), llms);
writeFileSync(join(root, "llms-full.txt"), llmsFull);

console.log(`SEO assets written for ${SITE_URL}`);
