# Digital governance (Supabase + Next.js console)

World Class Scholars uses a **founder-controlled governance backbone** separate from the MEVN marketing platform in this repo.

| Component | Repository | Deploy target |
|-----------|------------|---------------|
| Public marketing (this repo) | [wcs-full](https://github.com/chrsappiah-cloud/wcs-full) | worldclassscholars.vercel.app |
| Governance console | [wcs-governance](https://github.com/chrsappiah-cloud/wcs-governance) | Vercel (staff `/login`, `/dashboard`, …) |
| Supabase schema | `supabase/migrations/` in both repos | Existing Supabase project |

## Why two repos

- **wcs-full** — Vue/Vite public site + Express/MongoDB campus features (courses, library, legacy admin).
- **wcs-governance** — Next.js internal console with Supabase RBAC, RLS, R&D evidence, grant reporting, and audit trails.

Governance is enforced in **Postgres (RLS)**, not only in UI tabs. iOS apps (EtherealVeil, WCSLiB, WCS-GEO, etc.) should use the same Supabase project as clients.

## Setup (once per Supabase project)

1. Run migrations in order from `supabase/migrations/`:
   - `001_core_governance.sql`
   - `002_permissions_seed.sql`
   - `003_rls.sql`
   - `004_audit_triggers.sql`
2. Enable **Custom Access Token Hook** → `public.custom_access_token_hook`
3. Deploy [wcs-governance](https://github.com/chrsappiah-cloud/wcs-governance) to Vercel with:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Run `supabase/seed-founder.sql` after founder sign-up
5. Set `VITE_GOVERNANCE_CONSOLE_URL` in wcs-full Vercel env to the governance console URL (shows **Staff** link in header)

## Migration path

1. **Now** — Deploy governance console; run Supabase migrations; assign founder + test roles.
2. **Next** — Move high-risk ops (publishing approvals, R&D evidence, release sign-off) into the console.
3. **Later** — Gradually port marketing pages from `frontend/` into wcs-governance `(marketing)/` if consolidating to one Next.js deploy.

Full details: [docs/GOVERNANCE_INTEGRATION.md](./GOVERNANCE_INTEGRATION.md)
