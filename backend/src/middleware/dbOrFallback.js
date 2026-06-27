import { connectDb } from "../config/db.js";

let dbReady = false;

/** Attach `req.fallbackMode` when MongoDB is missing or unreachable. */
export async function dbOrFallback(req, res, next) {
  const uri = (process.env.MONGODB_URI || "").trim();
  if (!uri) {
    req.fallbackMode = true;
    return next();
  }
  if (!dbReady) {
    try {
      const ns = (process.env.MONGODB_NS || "wcs").trim();
      await connectDb(uri, ns);
      dbReady = true;
    } catch (err) {
      console.error("MongoDB connection failed — using built-in content fallback:", err.message);
      req.fallbackMode = true;
    }
  }
  next();
}

export function requireDatabase(req, res, next) {
  if (req.fallbackMode) {
    return res.status(503).json({
      error: "Database is not configured. Set MONGODB_URI in Vercel environment variables.",
    });
  }
  next();
}
