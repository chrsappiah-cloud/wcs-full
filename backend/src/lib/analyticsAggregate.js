import { enrichGeoForAggregate } from "./analyticsGeo.js";

export function aggregateDashboard(events, counts = {}) {
  const sessions = new Set();
  const visitorsByCountry = new Map();
  const eventsByType = new Map();
  const pages = new Map();
  const subscriptions = [];
  const trafficByDay = new Map();
  const actions = [];

  for (const ev of events) {
    const day = ev.ts instanceof Date
      ? ev.ts.toISOString().slice(0, 10)
      : new Date(ev.ts).toISOString().slice(0, 10);
    trafficByDay.set(day, (trafficByDay.get(day) ?? 0) + 1);

    if (ev.sessionId) sessions.add(ev.sessionId);

    const type = ev.event ?? "unknown";
    eventsByType.set(type, (eventsByType.get(type) ?? 0) + 1);

    if (ev.event === "page_view" && ev.path) {
      pages.set(ev.path, (pages.get(ev.path) ?? 0) + 1);
    }

    if (ev.event === "subscription_attempt") {
      subscriptions.push({
        path: ev.path,
        productId: ev.meta?.productId,
        appSlug: ev.meta?.appSlug,
        ts: ev.ts,
        country: ev.geo?.country ?? ev.meta?.country,
      });
    }

    if (["login", "enroll", "search", "subscription_attempt"].includes(ev.event)) {
      actions.push({
        event: ev.event,
        path: ev.path,
        meta: ev.meta,
        ts: ev.ts,
        country: ev.geo?.country ?? ev.meta?.country,
      });
    }

    const cc = ev.geo?.country ?? ev.meta?.country;
    if (cc) {
      const key = String(cc).toUpperCase();
      visitorsByCountry.set(key, (visitorsByCountry.get(key) ?? 0) + 1);
    }
  }

  const topPages = [...pages.entries()]
    .map(([_id, count]) => ({ _id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const eventBreakdown = [...eventsByType.entries()]
    .map(([_id, count]) => ({ _id, count }))
    .sort((a, b) => b.count - a.count);

  const trafficSeries = [...trafficByDay.entries()]
    .map(([_id, count]) => ({ _id, count }))
    .sort((a, b) => a._id.localeCompare(b._id))
    .slice(-14);

  const mapMarkers = [...visitorsByCountry.entries()]
    .map(([country, count]) => {
      const geo = enrichGeoForAggregate(country);
      return geo ? { ...geo, count } : { country, name: country, lat: null, lng: null, count };
    })
    .filter((m) => m.lat != null)
    .sort((a, b) => b.count - a.count);

  const recentEvents = [...events]
    .sort((a, b) => new Date(b.ts) - new Date(a.ts))
    .slice(0, 30)
    .map((ev) => ({
      _id: ev._id,
      event: ev.event,
      path: ev.path,
      meta: ev.meta,
      geo: ev.geo,
      sessionId: ev.sessionId,
      ts: ev.ts,
    }));

  const searchQueries = events
    .filter((e) => e.event === "search" && e.meta?.q)
    .reduce((acc, e) => {
      const q = e.meta.q;
      acc.set(q, (acc.get(q) ?? 0) + 1);
      return acc;
    }, new Map());
  const topSearches = [...searchQueries.entries()]
    .map(([_id, count]) => ({ _id, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  actions.sort((a, b) => new Date(b.ts) - new Date(a.ts));

  return {
    totalEvents: events.length,
    uniqueSessions: sessions.size,
    pageViews: eventsByType.get("page_view") ?? 0,
    subscriptionAttempts: subscriptions.length,
    topPages,
    topSearches,
    eventBreakdown,
    trafficSeries,
    mapMarkers,
    recentEvents,
    recentActions: actions.slice(0, 20),
    subscriptionAttemptsList: subscriptions.slice(-15).reverse(),
    counts: {
      users: counts.users ?? 0,
      courses: counts.courses ?? 0,
      resources: counts.resources ?? 0,
      enrollments: counts.enrollments ?? 0,
      memberAccess: counts.memberAccess ?? 0,
    },
  };
}
