/**
 * Vercel serverless adapter.
 * This file is the single entry-point for all /api/* and /health requests.
 * Express handles routing; MongoDB connection is cached across warm invocations.
 */
import express from "express";
import cors   from "cors";
import { connectDb } from "../backend/src/config/db.js";
import routes      from "../backend/src/api/routes.js";
import adminRoutes from "../backend/src/api/adminRoutes.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Lazily connect MongoDB — the cached client is reused on warm invocations
let dbReady = false;
app.use(async (_req, _res, next) => {
  if (!dbReady) {
    const uri    = process.env.MONGODB_URI;
    const ns     = process.env.MONGODB_NS || "wcs";
    if (!uri) return _res.status(503).json({ error: "MONGODB_URI is not configured." });
    await connectDb(uri, ns);
    dbReady = true;
  }
  next();
});

app.get("/health", (_req, res) =>
  res.json({ ok: true, env: "vercel" })
);

app.use("/api/v1",    routes);
app.use("/api/admin", adminRoutes);

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
