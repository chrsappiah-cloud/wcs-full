/** In-memory sliding-window rate limiter (per serverless instance on Vercel). */
const buckets = new Map();

export function rateLimit({ windowMs = 60_000, max = 60, keyFn } = {}) {
  return (req, res, next) => {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.ip ||
      req.socket?.remoteAddress ||
      "unknown";
    const key = keyFn ? keyFn(req) : ip;
    const now = Date.now();

    let bucket = buckets.get(key);
    if (!bucket || now >= bucket.resetAt) {
      bucket = { count: 0, resetAt: now + windowMs };
      buckets.set(key, bucket);
    }
    bucket.count += 1;

    const remaining = Math.max(0, max - bucket.count);
    res.setHeader("X-RateLimit-Limit", String(max));
    res.setHeader("X-RateLimit-Remaining", String(remaining));
    res.setHeader("X-RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > max) {
      return res.status(429).json({ error: "Too many requests. Please try again later." });
    }
    next();
  };
}

/** 10 contact submissions per 15 minutes per IP */
export const contactPostLimit = rateLimit({ windowMs: 15 * 60_000, max: 10 });

/** 120 analytics events per minute per IP */
export const analyticsPostLimit = rateLimit({ windowMs: 60_000, max: 120 });

/** 20 auth attempts per 15 minutes per IP */
export const authPostLimit = rateLimit({ windowMs: 15 * 60_000, max: 20 });

/** 90 library searches per minute per IP */
export const searchGetLimit = rateLimit({ windowMs: 60_000, max: 90 });
