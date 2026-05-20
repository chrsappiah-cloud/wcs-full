const KEY = "wcs_analytics_session";

export function getAnalyticsSessionId() {
  try {
    let id = sessionStorage.getItem(KEY);
    if (!id) {
      id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return `sess_${Date.now()}`;
  }
}
