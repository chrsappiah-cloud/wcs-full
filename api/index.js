/**
 * Vercel serverless adapter — SPA + Express API on one project.
 */
import express from "express";
import cors from "cors";
import routes from "../backend/src/api/routes.js";
import adminRoutes from "../backend/src/api/adminRoutes.js";
import { dbOrFallback, requireDatabase } from "../backend/src/middleware/dbOrFallback.js";
import { securityHeaders, jsonBodyLimit } from "../backend/src/middleware/security.js";

const app = express();

app.use(securityHeaders);
app.use(cors({ origin: true, credentials: true }));
app.use(jsonBodyLimit());
app.use(express.json({ limit: "64kb" }));
app.use(dbOrFallback);

app.get("/health", (req, res) =>
  res.json({
    ok: true,
    env: "vercel",
    database: req.fallbackMode ? "fallback" : "mongodb",
  })
);

app.use("/api/v1", routes);
app.use("/api/admin", requireDatabase, adminRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status && err.status >= 400 && err.status < 600 ? err.status : 500;
  const message =
    status === 500 ? "Internal server error" : err.message || "Request failed";
  res.status(status).json({ error: message });
});

export default app;
