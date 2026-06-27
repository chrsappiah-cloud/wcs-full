const MAX_QUERY_LEN = 200;
const MAX_EVENT_LEN = 64;
const MAX_PATH_LEN = 512;

export function clampQuery(req, _res, next) {
  const q = req.query?.q;
  if (typeof q === "string" && q.length > MAX_QUERY_LEN) {
    req.query.q = q.slice(0, MAX_QUERY_LEN);
  }
  next();
}

export function validateAnalyticsBody(req, res, next) {
  const { event, path, sessionId } = req.body ?? {};
  if (!event || typeof event !== "string") {
    return res.status(400).json({ error: "event is required" });
  }
  if (event.length > MAX_EVENT_LEN) {
    return res.status(400).json({ error: "event name too long" });
  }
  if (path != null && typeof path === "string" && path.length > MAX_PATH_LEN) {
    return res.status(400).json({ error: "path too long" });
  }
  if (sessionId != null && typeof sessionId === "string" && sessionId.length > 128) {
    return res.status(400).json({ error: "sessionId too long" });
  }
  next();
}

export function validatePassword(password) {
  return typeof password === "string" && password.length >= 8 && password.length <= 128;
}
