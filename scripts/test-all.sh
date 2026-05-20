#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export MONGODB_URI="${MONGODB_URI:-mongodb://127.0.0.1:27017}"
export MONGODB_NS="${MONGODB_NS:-wcs_test_smoke}"
export TEST_API_BASE="${TEST_API_BASE:-http://127.0.0.1:3001}"

echo "==> Backend seed"
(cd "$ROOT/backend" && npm run seed)

echo "==> Starting backend on :3001"
(cd "$ROOT/backend" && npm run dev) &
BACKEND_PID=$!
trap 'kill $BACKEND_PID 2>/dev/null || true' EXIT

for i in $(seq 1 30); do
  if curl -sf "$TEST_API_BASE/health" >/dev/null; then
    echo "Backend ready"
    break
  fi
  sleep 1
done

echo "==> Backend API smoke tests"
(cd "$ROOT/backend" && node --test tests/api.smoke.test.js)

echo "==> Frontend unit tests"
(cd "$ROOT/frontend" && npm run test:unit)

echo "==> Frontend E2E (Playwright)"
(cd "$ROOT/frontend" && PLAYWRIGHT_SKIP_WEBSERVER=1 PLAYWRIGHT_BASE_URL=http://localhost:5173 npm run test:e2e)

echo ""
echo "All tests passed."
