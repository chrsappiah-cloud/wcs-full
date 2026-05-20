# Release — platform hardening & new surfaces

**Production:** https://worldclassscholars.vercel.app  
**Local dev:** `http://localhost:5173` (frontend) + `http://localhost:3001` (API)

## New & updated features

| Area | Route / API | Description |
|------|-------------|-------------|
| Account & subscriptions | `/account`, `/api/v1/access/*` | Catalog, entitlements, payment status (MongoDB + fallback) |
| Admin access | `/admin/access` | User access records |
| Analytics | `/admin/analytics`, `POST /analytics/track` | KPIs, world map, traffic; geo/session enrichment |
| Contact | `/contact`, `/api/v1/contact` | Public form → `support@` / `admin@` routing |
| Admin enquiries | `/admin/enquiries` | Inbox for contact submissions |
| Payments & system | `/admin/payments`, `/admin/system` | Integrations, manual payments, health checks |
| Promotions | Digital marketing pages | Gallery from christopherappiahthompson.link (no affiliate net-sales table) |
| Commerce / iOS | `/api/v1/commerce/*` | Apple products + beta manifest for WCS iOS |
| SEO / AI discovery | `llms.txt`, sitemap, meta | Crawler-friendly discovery assets |

## Hardening (this release)

- Security headers + 64KB JSON body limit on API
- Library search fallback when MongoDB/text index unavailable
- Full DB seed before API smoke tests; CI runs `npm test` + frontend unit tests
- `scripts/test-all.sh` for local full verification

## Admin (fallback mode)

- Email: `admin@myworldclass.org`
- Password: `admin123` (change in production with MongoDB seeded admin)

## CI/CD

- **CI:** `.github/workflows/ci.yml` — frontend unit + build, backend seed + smoke tests
- **Deploy:** `.github/workflows/deploy.yml` on `main` → Vercel production (requires `VERCEL_*` secrets)

## Secrets to activate on Vercel

See `docs/ACTIVATE_KEYS.md`, `docs/EMAIL_AND_PAYMENTS.md`, `docs/DEPLOY_VERCEL.md`.
