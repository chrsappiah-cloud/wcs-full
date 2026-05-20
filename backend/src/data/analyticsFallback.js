/** Demo analytics when MongoDB is unavailable (Vercel fallback mode). */
const now = Date.now();
const day = 86400000;

function ev(event, path, meta, daysAgo = 0, country = "GB") {
  return {
    event,
    path,
    meta: { ...meta, country },
    geo: { country, city: meta?.city ?? null, region: null },
    sessionId: `demo-${country}-${daysAgo}`,
    ts: new Date(now - daysAgo * day - Math.random() * day * 0.8),
  };
}

export const fallbackAnalyticsEvents = [
  ev("page_view", "/", {}, 6, "GB"),
  ev("page_view", "/library", {}, 5, "US"),
  ev("search", "/library", { q: "trauma care" }, 5, "US"),
  ev("page_view", "/courses", {}, 4, "NG"),
  ev("page_view", "/about", {}, 4, "GH"),
  ev("page_view", "/digital-marketing", {}, 3, "GB"),
  ev("subscription_attempt", "/account", { productId: "wcs_premium_monthly" }, 3, "US"),
  ev("page_view", "/marketing", { tab: "app-store" }, 2, "CA"),
  ev("subscription_attempt", "/marketing", { productId: "wcs_ai_tutor_pack_10", appSlug: "wcs-commerce" }, 2, "DE"),
  ev("page_view", "/podcasts", {}, 2, "AU"),
  ev("login", "/login", { success: true }, 1, "GB"),
  ev("enroll", "/my-courses", { courseSlug: "trauma-informed-care" }, 1, "NG"),
  ev("page_view", "/digital-advertising", {}, 1, "IE"),
  ev("page_view", "/library", {}, 0, "GB"),
  ev("search", "/library", { q: "dementia" }, 0, "KE"),
  ev("subscription_attempt", "/account", { productId: "wcs_exam_pack_unlock" }, 0, "FR"),
  ev("page_view", "/account", {}, 0, "US"),
];

/** In-memory buffer for events recorded during a warm serverless instance. */
export const runtimeEvents = [];

export function appendRuntimeEvent(doc) {
  runtimeEvents.push(doc);
  if (runtimeEvents.length > 500) runtimeEvents.shift();
}

export function allFallbackEvents() {
  return [...fallbackAnalyticsEvents, ...runtimeEvents];
}
