# SEO & AI discovery — World Class Scholars

Public site: **https://wcs-full.vercel.app**

This project ships crawl-friendly assets for **Google**, **Bing**, and **AI search engines** (ChatGPT, Perplexity, Claude, Apple Intelligence, etc.).

## What is included

| Asset | URL | Purpose |
|-------|-----|---------|
| `robots.txt` | `/robots.txt` | Allows Googlebot, Bingbot, GPTBot, ClaudeBot, PerplexityBot, and more |
| `sitemap.xml` | `/sitemap.xml` | XML sitemap for Google Search Console & Bing Webmaster Tools |
| `llms.txt` | `/llms.txt` | Short index for AI crawlers ([llmstxt.org](https://llmstxt.org/)) |
| `llms-full.txt` | `/llms-full.txt` | Extended machine-readable site map |
| Meta + JSON-LD | `index.html` | Organization, Person, WebSite schema |
| Per-route SEO | `src/lib/seo.js` | Dynamic title, description, Open Graph, canonical |

## Submit to Google

1. Open [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://wcs-full.vercel.app`
3. Verify ownership (HTML tag or DNS — use Vercel DNS if on custom domain)
4. **Sitemaps** → submit: `https://wcs-full.vercel.app/sitemap.xml`
5. **URL inspection** → request indexing for `/`, `/about`, `/marketing`
6. Optional: link from [christopherappiahthompson.link](https://christopherappiahthompson.link) and [myworldclass.net](https://myworldclass.net) for faster discovery

## Submit to Bing (Copilot)

1. [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add site and submit the same sitemap URL

## AI engines

Most AI crawlers read `robots.txt` and public HTML. This site explicitly allows:

- `GPTBot`, `ChatGPT-User`, `OAI-SearchBot` (OpenAI)
- `ClaudeBot`, `Claude-Web`, `anthropic-ai` (Anthropic)
- `PerplexityBot` (Perplexity)
- `Google-Extended` (Google AI overviews)
- `Applebot-Extended` (Apple Intelligence)

Point agents to **`/llms.txt`** for a concise citation index.

## Build-time canonical URL

Set in Vercel (or `.env` for local builds):

```bash
VITE_SITE_URL=https://wcs-full.vercel.app
```

If you add a custom domain (e.g. `myworldclass.net`), update:

- `VITE_SITE_URL`
- `frontend/public/sitemap.xml`
- `frontend/public/robots.txt` Host / Sitemap lines
- `frontend/public/llms.txt` URLs

## Custom domain on Vercel

1. Vercel project → **Settings** → **Domains**
2. Add `myworldclass.net` or subdomain
3. Update `VITE_SITE_URL` and redeploy
4. Re-submit sitemap in Search Console under the new property

## Checklist after deploy

- [ ] `curl -s https://wcs-full.vercel.app/robots.txt` shows Sitemap line
- [ ] `curl -s https://wcs-full.vercel.app/sitemap.xml` returns XML
- [ ] `curl -s https://wcs-full.vercel.app/llms.txt` returns markdown index
- [ ] Google Search Console sitemap submitted
- [ ] Bing Webmaster sitemap submitted
- [ ] Founder link-in-bio links to `https://wcs-full.vercel.app`
