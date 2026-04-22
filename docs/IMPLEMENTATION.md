# World Class Scholars Full (`wcs-full`) — Implementation Notes

This package is a local-development scaffold: Vue 3 + Vite frontend, Express + native MongoDB driver backend, seed data, and a federated library search that merges internal text search with the [Open Library](https://openlibrary.org/) search API.

## Layout

- `frontend/` — SPA shell, router, Pinia store, Axios API client, global styles, views, and shared components.
- `backend/` — Express entrypoint, `/api/v1` routes, controllers, DAO, Mongo connection, and `npm run seed`.
- `database/schema.js` — documents collection responsibilities and example documents (not executed at runtime).

## Backend environment

Copy `backend/.env.example` to `backend/.env` and set:

- `PORT` — API port (default 5000).
- `MONGODB_URI` — local `mongodb://` URI or Atlas SRV string.
- `MONGODB_NS` — database name (default `wcs`).
- `OPEN_LIBRARY_BASE` — Open Library origin (default `https://openlibrary.org`).

## Commands

```bash
cd wcs-full/backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

```bash
cd wcs-full/frontend
npm install
npm run dev
```

The Vite dev server listens on port 5173 and proxies `/api` to `http://localhost:5000`, so the browser can call `/api/v1/...` without CORS friction during development.

## Smoke checks

1. `GET http://localhost:5000/api/v1/platform` returns platform metadata after seeding.
2. `GET http://localhost:5000/api/v1/library/search?q=open&source=all` returns internal matches (when indexed) plus Open Library hits.

## Phase two (not implemented here)

Authentication, admin CRUD, uploads, validation middleware, caching, structured logging, deployment hardening, richer content models, role-based publishing, and additional federated search providers (for example Google Books, Internet Archive, or Crossref) should be added before production use.
