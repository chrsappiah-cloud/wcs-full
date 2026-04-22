# Deployment guide — worldclassscholars.onrender.com

## Architecture

One unified Render web service serves both the Express API and the compiled Vue SPA.  
MongoDB is hosted on Atlas (free M0 tier).

```
Browser → https://worldclassscholars.onrender.com
                │
                ├── /api/v1/*   → Express controllers → MongoDB Atlas
                ├── /api/admin/* → Admin controllers  → MongoDB Atlas
                └── /*          → Vue SPA (frontend/dist)
```

---

## Step 1 — MongoDB Atlas (database)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) and create a free account.
2. Create a **free M0 cluster** (any region).
3. Under **Database Access** add a user with password — note the credentials.
4. Under **Network Access** add `0.0.0.0/0` (allow all — Render IPs are dynamic).
5. Click **Connect → Drivers** and copy the connection string:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

## Step 2 — Render (hosting)

1. Go to [render.com](https://render.com) and sign in with GitHub.
2. Click **New → Blueprint** and connect the `chrsappiah-cloud/wcs-full` repository.
3. Render reads `render.yaml` and creates the `worldclassscholars` web service automatically.
4. In **Environment** add the two secret variables:

   | Key | Value |
   |---|---|
   | `MONGODB_URI` | Your Atlas connection string |
   | `JWT_SECRET` | A strong random string (e.g. output of `openssl rand -hex 32`) |

5. Click **Deploy** — Render will build the frontend, install backend deps, and start the server.
6. Your live URL: **https://worldclassscholars.onrender.com**

---

## Step 3 — Seed the database (once)

After the first deploy, open a terminal and run:

```bash
cd backend
MONGODB_URI="your-atlas-uri" MONGODB_NS=wcs node src/utils/seed.js
```

Or use the Render **Shell** tab in the dashboard.

---

## Step 4 — Wire CI/CD deploy hook

1. In the Render dashboard → your service → **Settings → Deploy Hook** — copy the URL.
2. In GitHub → your repo → **Settings → Secrets → Actions** → add:
   - Name: `RENDER_DEPLOY_HOOK`
   - Value: the URL from step 1

Now every push to `main` will: run CI (build + smoke test) → trigger a Render deploy automatically.

---

## Step 5 — Custom domain (optional)

1. In Render → your service → **Settings → Custom Domains** → add your domain.
2. Add the CNAME record your DNS provider shows (e.g. `worldclassscholars.onrender.com`).
3. Render provisions a free TLS certificate automatically.

---

## Environment variables reference

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | yes | Set to `production` by render.yaml |
| `PORT` | yes | Set to `10000` by render.yaml |
| `MONGODB_URI` | **secret** | Atlas connection string |
| `MONGODB_NS` | yes | `wcs` (set by render.yaml) |
| `JWT_SECRET` | **secret** | Strong random string |
| `JWT_EXPIRES_IN` | yes | `7d` (set by render.yaml) |
| `OPEN_LIBRARY_BASE` | yes | `https://openlibrary.org` |

---

## Admin login after seeding

```
Email:    admin@myworldclass.org
Password: admin123
```

Change this in `seed.js` before seeding production.
