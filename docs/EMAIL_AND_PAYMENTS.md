# Email, JWT, and payment administration

## JWT (admin sign-in)

Production requires `JWT_SECRET` on Vercel.

```bash
# From repo root (requires Vercel CLI linked to worldclassscholars)
npm run configure:vercel
vercel --prod
```

Or set manually: **Vercel → Settings → Environment Variables → `JWT_SECRET`** = output of `openssl rand -hex 32`.

## Email (contact form → inbox)

The contact form at `/contact` saves messages and sends email when a provider is configured.

### Option A — Resend (recommended on Vercel)

1. Create an account at [resend.com](https://resend.com).
2. Verify domain `myworldclass.org` (or use Resend onboarding domain for testing).
3. Add to Vercel:

| Variable | Example |
|----------|---------|
| `RESEND_API_KEY` | `re_...` |
| `EMAIL_FROM` | `World Class Scholars <noreply@myworldclass.org>` |
| `NOTIFY_EMAIL` | `chrsappiah@gmail.com` |

Messages route to `support@myworldclass.org` or `admin@myworldclass.org` and copy `NOTIFY_EMAIL`.

### Option B — SMTP (Gmail, Outlook, etc.)

| Variable | Example |
|----------|---------|
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | your mailbox |
| `SMTP_PASS` | app password |
| `SMTP_SECURE` | `false` |

## Payments & Apple commerce (admin)

**Admin → Payments** (`/admin/payments`):

- View Apple / bank / card provider status
- Activate commerce integrations (when `WCS_COMMERCE_BASE_URL` is set)
- Review StoreKit transactions from the commerce API
- Record manual bank payments and grant entitlements

### Live Apple / StoreKit backend

1. Deploy or run the WCS commerce API (`wcs-ios/backend`, default port `8787`).
2. Set `WCS_COMMERCE_BASE_URL` on Vercel (e.g. `https://your-commerce-api.example.com`).
3. In admin **Payments**, click **Activate all integrations**.

Real Apple Pay and App Store billing require Apple Developer Program, App Store Connect products, and App Store Server API keys in that commerce service — the admin panel controls simulation/live status and member access on the website.

### Access & entitlements

**Admin → Access** (`/admin/access`) remains the place to grant/revoke subscriptions and set payment status (`paid`, `pending`, etc.) per user.

## Verify

```bash
curl -s https://worldclassscholars.vercel.app/health
# Sign in at /login, then open /admin/system for configuration status
```
