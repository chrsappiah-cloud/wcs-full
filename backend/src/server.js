import "dotenv/config";
import express from "express";
import cors from "cors";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";
import routes from "./api/routes.js";
import adminRoutes from "./api/adminRoutes.js";
import { dbOrFallback, requireDatabase } from "./middleware/dbOrFallback.js";
import { securityHeaders, jsonBodyLimit } from "./middleware/security.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProd    = process.env.NODE_ENV === "production";
const PORT      = Number(process.env.PORT) || 3001;
const app = express();

// In dev allow Vite dev server (port 5173) to call the API
const allowedOrigins = isProd
  ? []
  : ["http://localhost:5173", "http://127.0.0.1:5173"];

app.use(securityHeaders);
app.use(cors({
  origin: isProd ? false : allowedOrigins,
  credentials: true,
}));
app.use(jsonBodyLimit());
app.use(express.json({ limit: "64kb" }));
app.use(dbOrFallback);

// ── Health ────────────────────────────────────────────────────────────────────
app.get("/health", (req, res) =>
  res.json({
    ok: true,
    env: isProd ? "production" : "development",
    database: req.fallbackMode ? "fallback" : "mongodb",
  })
);

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/v1", routes);
app.use("/api/admin", requireDatabase, adminRoutes);

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
  const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500;
  res.status(status).json({
    error: status === 500 ? "Internal server error" : err.message || "Request failed",
  });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`WCS listening on http://localhost:${PORT} [${isProd ? "production" : "development"}]`);
});
