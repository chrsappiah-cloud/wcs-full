/** Lightweight security headers and request limits for API routes. */
export function securityHeaders(_req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
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
