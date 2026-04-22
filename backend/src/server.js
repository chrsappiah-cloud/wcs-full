import "dotenv/config";
import express from "express";
import cors from "cors";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import { connectDb } from "./config/db.js";
import routes from "./api/routes.js";
import adminRoutes from "./api/adminRoutes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProd    = process.env.NODE_ENV === "production";
const PORT      = Number(process.env.PORT) || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_NS  = process.env.MONGODB_NS || "wcs";

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI. Copy .env.example to .env and configure.");
  process.exit(1);
}

const app = express();

// In dev allow Vite dev server (port 5173) to call the API
const allowedOrigins = isProd
  ? []
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(cors({
  origin: isProd ? false : allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// ── Health ────────────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ ok: true, env: isProd ? "production" : "development" }));

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/v1",    routes);
app.use("/api/admin", adminRoutes);

// ── Serve Vue SPA in production ───────────────────────────────────────────────
if (isProd) {
  const distPath = join(__dirname, "../../frontend/dist");
  if (existsSync(distPath)) {
    app.use(express.static(distPath));
    // Return index.html for all non-API routes so Vue Router handles navigation
    app.get(/^(?!\/api).*/, (_req, res) => {
      res.sendFile(join(distPath, "index.html"));
    });
    console.log(`Serving Vue SPA from ${distPath}`);
  } else {
    console.warn("frontend/dist not found — run `npm run build` in the frontend folder.");
  }
}

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// ── Start ─────────────────────────────────────────────────────────────────────
await connectDb(MONGODB_URI, MONGODB_NS);
app.listen(PORT, () => {
  console.log(`WCS listening on http://localhost:${PORT} [${isProd ? "production" : "development"}]`);
});
