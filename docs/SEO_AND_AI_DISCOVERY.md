# SEO & AI discovery — World Class Scholars

**Canonical site:** https://worldclassscholars.vercel.app

This project ships crawl-friendly assets for **Google**, **Bing**, and **AI search engines** (ChatGPT, Perplexity, Claude, Google AI Overviews, Apple Intelligence, etc.).

## What is included

| Asset | URL | Purpose |
|-------|-----|---------|
| `robots.txt` | `/robots.txt` | Allows Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot, and more |
| `sitemap.xml` | `/sitemap.xml` | XML sitemap for Google Search Console & Bing Webmaster Tools |
| `llms.txt` | `/llms.txt` | Short index for AI crawlers ([llmstxt.org](https://llmstxt.org/)) |
| `llms-full.txt` | `/llms-full.txt` | Extended machine-readable site map |
| `ai.txt` | `/ai.txt` | Compact AI discovery alias (links to llms + key URLs) |
| Meta + JSON-LD | `index.html` + runtime | Organization, Person, WebSite, **PodcastSeries** |
| Per-route SEO | `src/lib/seo.js` | Dynamic title, description, Open Graph, canonical |
| Podcast referrals | `/podcasts`, `/podcasts/{slug}` | RSS.com shows with `?ref=` tracking |

Regenerated on each build via `frontend/scripts/generate-static-seo.mjs`.

## Submit to Google

**Step-by-step:** [SEARCH_CONSOLE_SETUP.md](./SEARCH_CONSOLE_SETUP.md) (verification tokens, Bing, cross-links to myworldclass.net).

1. Open [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://worldclassscholars.vercel.app`
3. Verify ownership: set `VITE_GOOGLE_SITE_VERIFICATION` in Vercel → redeploy (HTML meta injected at build)
4. **Sitemaps** → submit: `https://worldclassscholars.vercel.app/sitemap.xml`
5. **URL inspection** → request indexing for:
   - `/`
   - `/about`
   - `/podcasts`
   - `/podcasts/heartbeats-beyond-memory`
   - `/marketing`
6. Link from [christopherappiahthompson.link](https://christopherappiahthompson.link) and [myworldclass.net](https://www.myworldclass.net/) — see [SEARCH_CONSOLE_SETUP.md](./SEARCH_CONSOLE_SETUP.md)

## Submit to Bing (Copilot)

1. [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add site and submit the same sitemap URL

## AI engines

`robots.txt` explicitly allows:

- `GPTBot`, `ChatGPT-User`, `OAI-SearchBot` (OpenAI)
- `ClaudeBot`, `Claude-Web`, `anthropic-ai` (Anthropic)
- `PerplexityBot` (Perplexity)
- `Google-Extended` (Google AI overviews)
- `Applebot-Extended` (Apple Intelligence)
- `cohere-ai`, `Meta-ExternalAgent`
- `Amazonbot`, `YouBot`, `DuckAssistBot`, `Bytespider`, `CCBot`, `Diffbot`, `FacebookBot`, `PetalBot`

Point agents to **`/llms.txt`** or **`/ai.txt`** for citations. Podcast URLs and referral patterns are listed there.

Admin, login, and account routes are **`noindex`** via `robots.txt`, `X-Robots-Tag` on Vercel, and SPA meta.

## Podcast referrals (RSS.com)

| Show | Referral hub | RSS.com listen |
|------|----------------|----------------|
| Heartbeats Beyond Memory | `/podcasts/heartbeats-beyond-memory` | [RSS.com show](https://rss.com/podcasts/heartbeats-beyond-memory-creative-care-in-dementia/2357430) |
| Freemasonry 21st Century | `/podcasts/freemasonry-21st-century` | [RSS.com show](https://rss.com/podcasts/decoding-the-signs-and-symbols-of-freemasonry-in-the-21st-century/) |
| Art, Culture & Tattoos | `/podcasts/art-culture-tattoos` | [RSS.com show](https://rss.com/podcasts/art-culture-and-philosophies-of-tattoos) |

Example campaign link: `https://worldclassscholars.vercel.app/podcasts/heartbeats-beyond-memory?ref=tiktok`

## Build-time canonical URL

```bash
VITE_SITE_URL=https://worldclassscholars.vercel.app
```

Set in Vercel → Environment Variables (Production).

## Checklist after deploy

- [ ] `curl -s https://worldclassscholars.vercel.app/robots.txt` shows Sitemap and GPTBot Allow
- [ ] `curl -s https://worldclassscholars.vercel.app/sitemap.xml` includes `/podcasts` URLs
- [ ] `curl -s https://worldclassscholars.vercel.app/llms.txt` lists podcast referral hubs
- [ ] `curl -s https://worldclassscholars.vercel.app/ai.txt` returns site + llms pointers
- [ ] `curl -s https://worldclassscholars.vercel.app/sitemap.xml` includes `/contact`
- [ ] Google Search Console sitemap submitted
- [ ] Bing Webmaster sitemap submitted
- [ ] Founder link-in-bio links to `https://worldclassscholars.vercel.app`
