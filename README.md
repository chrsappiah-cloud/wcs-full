# World Class Scholars — Full Platform

A full MEVN-stack digital campus for **World Class Scholars**, founded by Dr Christopher Appiah-Thompson. Combines public storytelling, federated library search, a course platform, AI-assisted discovery, and an admin CMS — all backed by MongoDB.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Vue 3 · Vite · Vue Router · Pinia · Axios |
| Backend | Node.js · Express · MongoDB (native driver) |
| Auth | JWT (jsonwebtoken) · bcryptjs |
| Search | MongoDB text index + Open Library API |
| CI/CD | GitHub Actions |

---

## Project layout

```
wcs-full/
├── frontend/          # Vue 3 SPA
│   └── src/
│       ├── views/     # Page components (Home, Library, About, Courses, …)
│       ├── components/ # SiteHeader, SiteFooter, ResourceGrid
│       ├── stores/    # Pinia (platform, auth)
│       ├── router/    # Vue Router with auth guards
│       └── services/  # Axios API client (api.js + adminApi)
├── backend/           # Express API
│   └── src/
│       ├── api/       # routes.js + adminRoutes.js
│       ├── controllers/ # content, library, auth, admin, analytics, enrollment
│       ├── dao/       # contentDao, userDao
│       ├── middleware/ # requireAuth, requireAdmin
│       ├── config/    # db.js (MongoDB connection)
│       └── utils/     # seed.js
├── database/          # schema.js (collection reference)
└── docs/              # IMPLEMENTATION.md
```

---

## Local setup

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or an Atlas connection string

### Backend

```bash
cd backend
cp .env.example .env        # fill in MONGODB_URI and JWT_SECRET
npm install
npm run seed                # populates MongoDB + creates text index
npm run dev                 # API on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev                 # Vite dev server on http://localhost:5173
```

Vite proxies `/api` → `http://localhost:3001` so no CORS config is needed during development.

---

## Environment variables (backend)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3001` | Express listen port |
| `MONGODB_URI` | — | MongoDB connection string |
| `MONGODB_NS` | `wcs` | Database name |
| `OPEN_LIBRARY_BASE` | `https://openlibrary.org` | Open Library API origin |
| `JWT_SECRET` | — | Secret for signing JWTs (change in production) |
| `JWT_EXPIRES_IN` | `7d` | Token expiry |

---

## API routes

### Public (`/api/v1`)

| Method | Path | Description |
|---|---|---|
| GET | `/platform` | Site identity & nav |
| GET | `/about` | About page + founder profile |
| GET | `/courses` | Course catalogue |
| GET | `/labs` | Future Lab initiatives |
| GET | `/art-verse` | Art collections |
| GET | `/resources/featured` | Featured resources |
| GET | `/resources/:slug` | Single resource |
| GET | `/library/search?q=&source=` | Federated search |
| POST | `/auth/register` | Create account |
| POST | `/auth/login` | Sign in → JWT |
| GET | `/auth/me` | Current user (auth required) |
| POST | `/enrollments` | Enrol in a course (auth required) |
| GET | `/enrollments/mine` | My enrolments (auth required) |
| POST | `/analytics/track` | Log a platform event |

### Admin (`/api/admin`) — requires admin JWT

| Method | Path | Description |
|---|---|---|
| GET | `/analytics` | Aggregated stats |
| GET | `/api-status` | Endpoint health + document counts |
| GET/POST/PUT/DELETE | `/resources` | Full resource CRUD |
| PATCH | `/resources/:id/toggle` | Toggle published status |
| GET/POST/PUT/DELETE | `/courses` | Course CRUD |
| GET/POST/PUT/DELETE | `/labs` | Lab CRUD |
| GET | `/users` | List registered users |
| GET | `/enrollments` | All enrolments |

---

## Seeded admin credentials

```
Email:    admin@myworldclass.org
Password: admin123
```

Change these before any public deployment.

---

## CI/CD

GitHub Actions run on every push and pull request to `main`:

- **`ci.yml`** — installs dependencies, builds the frontend, and verifies the backend starts cleanly.
- **`deploy.yml`** — placeholder deployment workflow; add your target (Railway, Render, Fly.io, VPS) and set the required secrets in GitHub → Settings → Secrets.

---

## Phase two (not yet implemented)

Authentication hardening · file uploads · rich content models · Google Books / Internet Archive connectors · role-based publishing · caching · structured logging · production Docker / reverse-proxy setup.
