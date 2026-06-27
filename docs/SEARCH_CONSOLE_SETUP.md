# Search Console & cross-site linking

Use this guide for **two properties**: the Vercel campus site and **myworldclass.net** (already in Search Console).

| Property | URL | Sitemap |
|----------|-----|---------|
| World Class Scholars (primary) | https://worldclassscholars.vercel.app | https://worldclassscholars.vercel.app/sitemap.xml |
| myworldclass.net | https://www.myworldclass.net/ | *(use that site’s own sitemap if published)* |

---

## 1. Google Search Console — worldclassscholars.vercel.app

1. Open [Google Search Console](https://search.google.com/search-console).
2. **Add property** → **URL prefix** → `https://worldclassscholars.vercel.app`
3. **Verify ownership** → **HTML tag**:
   - Copy only the `content="..."` value from Google’s meta tag.
   - In **Vercel** → Project → **Settings** → **Environment Variables** (Production):
     - Name: `VITE_GOOGLE_SITE_VERIFICATION`
     - Value: paste the token (no quotes).
   - Redeploy the project (Deployments → Redeploy).
   - Confirm in page source:  
     `curl -s https://worldclassscholars.vercel.app/ | grep google-site-verification`
4. **Sitemaps** → Add: `https://worldclassscholars.vercel.app/sitemap.xml`
5. **URL inspection** → Request indexing for:
   - `/`
   - `/about`
   - `/contact`
   - `/podcasts`
   - `/marketing`

---

## 2. Bing Webmaster Tools

1. [Bing Webmaster Tools](https://www.bing.com/webmasters) → **Add a site** → `https://worldclassscholars.vercel.app`
2. Verify with **HTML meta tag** (`msvalidate.01`):
   - Vercel env: `VITE_BING_SITE_VERIFICATION` = Bing’s content value → redeploy.
3. **Sitemaps** → Submit: `https://worldclassscholars.vercel.app/sitemap.xml`

---

## 3. Cross-link myworldclass.net ↔ World Class Scholars

Google uses **internal links** between your domains to discover related content (e.g. your GSC view for `onboarding-for-schools` on myworldclass.net).

### On worldclassscholars.vercel.app (done in this repo)

- Footer **Also on** links to:
  - https://www.myworldclass.net/
  - https://www.myworldclass.net/onboarding-for-schools
  - https://christopherappiahthompson.link/
- `llms.txt` / `llms-full.txt` list sister sites for AI crawlers.

### On myworldclass.net (you edit that site)

Add visible links (header, footer, or onboarding page body), for example:

```html
<a href="https://worldclassscholars.vercel.app/">World Class Scholars — courses & library</a>
<a href="https://worldclassscholars.vercel.app/podcasts">Podcasts</a>
<a href="https://worldclassscholars.vercel.app/marketing">iOS apps & TestFlight</a>
```

On **onboarding-for-schools**, link back to the Vercel site and to `/contact` for enquiries.

### On christopherappiahthompson.link

Set the primary button or top link to:

`https://worldclassscholars.vercel.app/`

---

## 4. myworldclass.net (existing Search Console property)

You already have [links data](https://search.google.com/search-console/links) for `https://www.myworldclass.net/onboarding-for-schools`.

- Keep that URL in myworldclass.net’s sitemap (if you maintain one).
- Add an outbound link from that page to `https://worldclassscholars.vercel.app/` so Google associates both properties.
- Optionally add a **Search Console property** for the Vercel URL (step 1) — separate from myworldclass.net; both can coexist.

---

## 5. Local / CI verification tokens

```bash
# frontend/.env.local (not committed)
VITE_GOOGLE_SITE_VERIFICATION=your-token-from-google
VITE_BING_SITE_VERIFICATION=your-token-from-bing
```

Then `cd frontend && npm run build` and check `dist/index.html` for the meta tags.

---

## Checklist

- [ ] GSC property `https://worldclassscholars.vercel.app` verified via `VITE_GOOGLE_SITE_VERIFICATION`
- [ ] Sitemap submitted in GSC and Bing
- [ ] myworldclass.net pages link to worldclassscholars.vercel.app
- [ ] christopherappiahthompson.link points to worldclassscholars.vercel.app
- [ ] URL inspection requested for home, about, contact, podcasts, marketing
