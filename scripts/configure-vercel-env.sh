#!/usr/bin/env bash
# Configure required Vercel environment variables for worldclassscholars.
set -euo pipefail
cd "$(dirname "$0")/.."

JWT_SECRET="${JWT_SECRET:-$(openssl rand -hex 32)}"

echo "Setting Vercel env for project worldclassscholars..."

add_env() {
  local name="$1"
  local value="$2"
  local sensitive="${3:-}"
  for env in production preview development; do
    if [ -n "$sensitive" ]; then
      vercel env add "$name" "$env" --value "$value" --yes --force --sensitive 2>/dev/null || true
    else
      vercel env add "$name" "$env" --value "$value" --yes --force 2>/dev/null || true
    fi
  done
}

add_env JWT_SECRET "$JWT_SECRET" sensitive
add_env JWT_EXPIRES_IN "7d"
add_env MONGODB_NS "wcs"
add_env OPEN_LIBRARY_BASE "https://openlibrary.org"
add_env VITE_SITE_URL "https://worldclassscholars.vercel.app"
add_env EMAIL_FROM "World Class Scholars <noreply@myworldclass.org>"
add_env NOTIFY_EMAIL "chrsappiah@gmail.com"

echo ""
echo "Done. JWT_SECRET was set (not printed)."
echo ""
echo "You still need to add manually in Vercel dashboard:"
echo "  MONGODB_URI       — MongoDB Atlas connection string"
echo "  RESEND_API_KEY    — https://resend.com (enables outbound email)"
echo "  OR SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS"
echo "  WCS_COMMERCE_BASE_URL — optional live Apple commerce API"
echo ""
echo ""
echo "Optional: copy backend/.env.production.example → backend/.env.production"
echo "         fill MONGODB_URI + RESEND_API_KEY, then: npm run sync:vercel"
echo "Redeploy: vercel --prod"
