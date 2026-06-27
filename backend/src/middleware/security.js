/** Lightweight security headers and request limits for API routes. */
export function securityHeaders(_req, res, next) {
  res.removeHeader("X-Powered-By");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
}

/** HSTS on production / Vercel */
export function productionHardening(_req, res, next) {
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  next();
}

/** Reject obviously malicious paths early */
export function blockSuspiciousPaths(req, res, next) {
  const p = req.path || "";
  if (
    /\.\./.test(p) ||
    /\/\.env/i.test(p) ||
    /\/wp-admin/i.test(p) ||
    /\/\.git/i.test(p)
  ) {
    return res.status(404).json({ error: "Not found" });
  }
  next();
}

export function jsonBodyLimit(maxBytes = 64 * 1024) {
  return (req, res, next) => {
    const len = Number(req.headers["content-length"] ?? 0);
    if (len > maxBytes) {
      return res.status(413).json({ error: "Request body too large" });
    }
    next();
  };
}
