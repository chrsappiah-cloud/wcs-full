# API keys search & activation status

## Keys found in this repository

| Key | Location | Value |
|-----|----------|--------|
| `JWT_SECRET` | `backend/.env` (local dev only) | Set — not used on Vercel |
| `MONGODB_URI` | `backend/.env` | `mongodb://127.0.0.1:27017` (local only) |
| `WCS_COMMERCE_BASE_URL` | `backend/.env` | `http://127.0.0.1:8787` (local only) |

**Not found in the repo:** `RESEND_API_KEY`, `SMTP_*`, `STRIPE_SECRET_KEY`, MongoDB Atlas `mongodb+srv://…`

Secrets must be added manually — they are never committed (see `.gitignore`).

## Already active on Vercel (production)

- `JWT_SECRET` — admin sign-in works
- `JWT_EXPIRES_IN` — `7d`
- `NOTIFY_EMAIL` — `chrsappiah@gmail.com`
- `EMAIL_FROM` — World Class Scholars sender
- `VITE_SITE_URL` — in `vercel.json`

## Activate the rest (2 steps)

### 1. Create `backend/.env.production`

```bash
cp backend/.env.production.example backend/.env.production
```

Fill in:

1. **MongoDB Atlas** (free): [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) → Create cluster → Connect → copy `mongodb+srv://…` → `MONGODB_URI`
2. **Resend** (free tier): [resend.com](https://resend.com) → API Keys → `RESEND_API_KEY=re_…`

Then sync and deploy:

```bash
npm run sync:vercel
npx vercel --prod
cd backend && MONGODB_URI="your-atlas-uri" MONGODB_NS=wcs node src/utils/seed.js
```

### 2. Verify in admin UI

Sign in → **System** → click **Activate all services** and **Test email**.

## Local development (active now)

```bash
# Terminal 1 — API
cd backend && npm run dev

# Terminal 2 — commerce (Apple simulation)
cd ../wcs-ios/backend && PORT=8787 npm start

# Terminal 3 — frontend
cd frontend && npm run dev
```

Local MongoDB is seeded (`npm run seed` in `backend`).

## Commerce / Apple Pay (production)

`WCS_COMMERCE_BASE_URL` must be a **public HTTPS** URL (not localhost). Deploy `wcs-ios/backend` to Render/Railway/Fly, then set that URL on Vercel and use **Admin → Payments → Activate all integrations**.
