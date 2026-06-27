import { getDb } from "../config/db.js";
import { extractGeoFromRequest } from "../lib/analyticsGeo.js";
import { aggregateDashboard } from "../lib/analyticsAggregate.js";
import {
  allFallbackEvents,
  appendRuntimeEvent,
} from "../data/analyticsFallback.js";

const col = () => getDb().collection("analytics");

function buildEventDoc(req, { event, path, meta, sessionId }) {
  const geo = extractGeoFromRequest(req);
  return {
    event,
    path: path ?? req.body?.path ?? "/",
    meta: meta ?? {},
    geo,
    sessionId: sessionId ?? null,
    userAgent: req.headers["user-agent"]?.slice(0, 256) ?? null,
    ts: new Date(),
  };
}

export async function track(req, res, next) {
  try {
    const { event, path, meta, sessionId } = req.body ?? {};
    const doc = buildEventDoc(req, {
      event: String(event).trim(),
      path: path != null ? String(path).trim().slice(0, 512) : undefined,
      meta: meta && typeof meta === "object" ? meta : {},
      sessionId: sessionId != null ? String(sessionId).trim().slice(0, 128) : undefined,
    });

    if (req.fallbackMode) {
      appendRuntimeEvent(doc);
      return res.status(201).json({ ok: true });
    }

    await col().insertOne(doc);
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
}

async function loadCounts(db) {
  if (!db) {
    return { users: 1, courses: 0, resources: 0, enrollments: 0, memberAccess: 1 };
  }
  const [users, courses, resources, enrollments, memberAccess] = await Promise.all([
    db.collection("users").countDocuments(),
    db.collection("courses").countDocuments(),
    db.collection("resources").countDocuments(),
    db.collection("enrollments").countDocuments(),
    db.collection("memberAccess").countDocuments().catch(() => 0),
  ]);
  return { users, courses, resources, enrollments, memberAccess };
}

async function aggregateFromMongo(db) {
  const events = await col().find({}).sort({ ts: -1 }).limit(5000).toArray();
  const counts = await loadCounts(db);
  return aggregateDashboard(events, counts);
}

function aggregateFromFallback() {
  const events = allFallbackEvents();
  return aggregateDashboard(events, {
    users: 1,
    courses: 4,
    resources: 6,
    enrollments: 1,
    memberAccess: 1,
  });
}

export async function getDashboard(req, res, next) {
  try {
    const dashboard = req.fallbackMode
      ? aggregateFromFallback()
      : await aggregateFromMongo(getDb());
    res.json({ ...dashboard, mode: req.fallbackMode ? "fallback" : "live" });
  } catch (err) {
    next(err);
  }
}

/** Legacy admin stats endpoint */
export async function getStats(req, res, next) {
  try {
    const dashboard = req.fallbackMode
      ? aggregateFromFallback()
      : await aggregateFromMongo(getDb());
    res.json({
      totalEvents: dashboard.totalEvents,
      topPages: dashboard.topPages,
      searchQueries: dashboard.topSearches,
      recentEvents: dashboard.recentEvents,
      counts: dashboard.counts,
    });
  } catch (err) {
    next(err);
  }
}
