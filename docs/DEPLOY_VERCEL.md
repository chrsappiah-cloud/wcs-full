# Deploy World Class Scholars on Vercel (single website)

One Vercel project serves **everything**:

| Path | What runs |
|------|-----------|
| `/` … `/*` (pages) | Vue 3 SPA (`frontend/dist`) |
| `/api/v1/*` | Express API (serverless `api/index.js`) |
| `/api/admin/*` | Admin API (same function) |
| `/health` | Health check |

**Canonical URL:** https://worldclassscholars.vercel.app  
**Legacy redirect:** `wcs-full.vercel.app` → `worldclassscholars.vercel.app`

---

## 1. Create the Vercel project

1. Go to [vercel.com](https://vercel.com) → **Add New → Project**.
2. Import **`chrsappiah-cloud/wcs-full`** from GitHub.
3. Set **Project Name** to **`worldclassscholars`** (gives `worldclassscholars.vercel.app`).
4. Framework Preset: **Other** (uses root `vercel.json`).
5. Do **not** override Build Command or Output Directory — `vercel.json` defines them.

---

## 2. Environment variables (Production)

In Vercel → Project → **Settings → Environment Variables**:

| Variable | Required | Example / notes |
|----------|----------|-----------------|
| `MONGODB_URI` | **Yes** | MongoDB Atlas `mongodb+srv://...` |
| `MONGODB_NS` | Yes | `wcs` |
| `JWT_SECRET` | **Yes** | `openssl rand -hex 32` — or run `npm run configure:vercel` |
| `JWT_EXPIRES_IN` | Yes | `7d` |
| `RESEND_API_KEY` | For email | From [resend.com](https://resend.com) — activates contact form email |
| `EMAIL_FROM` | Yes (with email) | `World Class Scholars <noreply@myworldclass.org>` |
| `NOTIFY_EMAIL` | Yes (with email) | `chrsappiah@gmail.com` — copies all enquiries |
| `OPEN_LIBRARY_BASE` | Yes | `https://openlibrary.org` |
| `VITE_SITE_URL` | Yes | `https://worldclassscholars.vercel.app` |
| `WCS_COMMERCE_BASE_URL` | No | Live commerce API; omit for built-in simulation |
| `STRIPE_SECRET_KEY` | No | Future card payments (admin shows status when set) |

See **`docs/EMAIL_AND_PAYMENTS.md`** for email setup and admin payment controls.

`VITE_SITE_URL` is also set in `vercel.json` for builds; the dashboard value wins if both exist.

---

## 3. Seed MongoDB (once)

```bash
cd backend
MONGODB_URI="your-atlas-uri" MONGODB_NS=wcs node src/utils/seed.js
```

This loads platform nav (**Digital Marketing**, **Digital Advertising**, courses, marketing content, admin user).

---

## 4. GitHub Actions auto-deploy (optional)

Add repository secrets (Vercel → Project → Settings → General → Project ID; Account → Tokens):

| Secret | Where to find |
|--------|----------------|
| `VERCEL_TOKEN` | Vercel → Account → Tokens |
| `VERCEL_ORG_ID` | `.vercel/project.json` after `vercel link` |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` |

Push to `main` runs CI, then deploys with `.github/workflows/deploy.yml`.

---

## 5. Custom domain (optional)

Vercel → Project → **Domains** → add e.g. `worldclassscholars.com` or `www.myworldclass.org`.  
Update `VITE_SITE_URL` and redeploy; run `node frontend/scripts/generate-static-seo.mjs` is included in `npm run build`.

---

## 6. Local production build

```bash
npm install
cd frontend && npm install && cd ..
VITE_SITE_URL=https://worldclassscholars.vercel.app npm run build
```

---

## Admin login (after seed)

- Email: `admin@myworldclass.org`
- Password: `admin123` (change in `seed.js` before production seed)

---

## Verify

```bash
curl -s https://worldclassscholars.vercel.app/health
curl -s https://worldclassscholars.vercel.app/api/v1/platform
```

Open:

- https://worldclassscholars.vercel.app/
- https://worldclassscholars.vercel.app/digital-marketing
- https://worldclassscholars.vercel.app/digital-advertising
- https://worldclassscholars.vercel.app/marketing
