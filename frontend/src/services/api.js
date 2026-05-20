import axios from "axios";
import { getAnalyticsSessionId } from "../lib/analyticsSession.js";

const client = axios.create({ baseURL: "/api/v1" });
const admin  = axios.create({ baseURL: "/api/admin" });

function authHeader() {
  const token = localStorage.getItem("wcs_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Public content ────────────────────────────────────────────────────────────
export const api = {
  getPlatform:        () => client.get("/platform").then(r => r.data),
  getAbout:           () => client.get("/about").then(r => r.data),
  getCourses:         () => client.get("/courses").then(r => r.data),
  getLabs:            () => client.get("/labs").then(r => r.data),
  getArtVerse:        () => client.get("/art-verse").then(r => r.data),
  getFeaturedResources: () => client.get("/resources/featured").then(r => r.data),
  getResource:        (slug) => client.get(`/resources/${slug}`).then(r => r.data),
  librarySearch:      (params) => client.get("/library/search", { params }).then(r => r.data),
  getAppleCommerce:   () => client.get("/commerce/apple").then(r => r.data),
  getBetaManifest:    () => client.get("/commerce/beta-manifest").then(r => r.data),

  // Analytics
  track: (event, path, meta = {}) =>
    client
      .post("/analytics/track", {
        event,
        path,
        meta,
        sessionId: getAnalyticsSessionId(),
      })
      .catch(() => {}),
  getAnalyticsDashboard: () =>
    client.get("/analytics/dashboard", { headers: authHeader() }).then((r) => r.data),

  getContactConfig: () => client.get("/contact").then((r) => r.data),
  submitContact: (body) => client.post("/contact", body).then((r) => r.data),
  adminListContactMessages: (status) =>
    client
      .get("/contact/admin/messages", {
        params: status ? { status } : {},
        headers: authHeader(),
      })
      .then((r) => r.data),
  adminPatchContactMessage: (id, status) =>
    client
      .patch(`/contact/admin/messages/${id}`, { status }, { headers: authHeader() })
      .then((r) => r.data),

  getAdminSystem: () =>
    client.get("/admin/system", { headers: authHeader() }).then((r) => r.data),
  testAdminEmail: () =>
    client.post("/admin/system/test-email", {}, { headers: authHeader() }).then((r) => r.data),
  testAdminDatabase: () =>
    client.post("/admin/system/test-database", {}, { headers: authHeader() }).then((r) => r.data),
  activateAdminServices: () =>
    client.post("/admin/system/activate", {}, { headers: authHeader() }).then((r) => r.data),
  getPaymentsDashboard: () =>
    client.get("/payments/admin/dashboard", { headers: authHeader() }).then((r) => r.data),
  activatePaymentIntegrations: (service) =>
    client
      .post("/payments/admin/activate-integrations", service ? { service } : {}, {
        headers: authHeader(),
      })
      .then((r) => r.data),
  recordPaymentEvent: (body) =>
    client.post("/payments/admin/events", body, { headers: authHeader() }).then((r) => r.data),

  // Auth
  login:    (email, password) => client.post("/auth/login",    { email, password }).then(r => r.data),
  register: (name, email, password) => client.post("/auth/register", { name, email, password }).then(r => r.data),
  me:       () => client.get("/auth/me", { headers: authHeader() }).then(r => r.data),

  // Enrollments
  enroll:         (courseSlug) => client.post("/enrollments", { courseSlug }, { headers: authHeader() }).then(r => r.data),
  myEnrollments:  () => client.get("/enrollments/mine", { headers: authHeader() }).then(r => r.data),
  updateProgress: (id, progress) => client.patch(`/enrollments/${id}`, { progress }, { headers: authHeader() }).then(r => r.data),

  // Access & subscriptions
  getAccessCatalog: () => client.get("/access/catalog").then(r => r.data),
  getMyAccess:      () => client.get("/access/me", { headers: authHeader() }).then(r => r.data),
  adminListAccess:  () => client.get("/access/admin/records", { headers: authHeader() }).then(r => r.data),
  adminGetUserAccess: (userId) =>
    client.get(`/access/admin/users/${userId}`, { headers: authHeader() }).then(r => r.data),
  adminUpdateUserAccess: (userId, body) =>
    client.patch(`/access/admin/users/${userId}`, body, { headers: authHeader() }).then(r => r.data),
  adminGrantSubscription: (userId, productId, source = "manual") =>
    client
      .post(`/access/admin/users/${userId}/subscriptions`, { productId, source }, { headers: authHeader() })
      .then(r => r.data),
  adminPatchSubscription: (userId, productId, status) =>
    client
      .patch(`/access/admin/users/${userId}/subscriptions/${productId}`, { status }, { headers: authHeader() })
      .then(r => r.data),
  adminRevokeSubscription: (userId, productId) =>
    client
      .delete(`/access/admin/users/${userId}/subscriptions/${productId}`, { headers: authHeader() })
      .then(r => r.data),
};

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminApi = {
  getStats:    () => admin.get("/analytics",  { headers: authHeader() }).then(r => r.data),
  getApiStatus: () => admin.get("/api-status").then(r => r.data),
  getUsers:    () => admin.get("/users",      { headers: authHeader() }).then(r => r.data),
  getEnrollments: () => admin.get("/enrollments", { headers: authHeader() }).then(r => r.data),

  // Resources
  getResources:    () => admin.get("/resources",       { headers: authHeader() }).then(r => r.data),
  createResource:  (doc) => admin.post("/resources",    doc, { headers: authHeader() }).then(r => r.data),
  updateResource:  (id, doc) => admin.put(`/resources/${id}`, doc, { headers: authHeader() }).then(r => r.data),
  deleteResource:  (id) => admin.delete(`/resources/${id}`, { headers: authHeader() }).then(r => r.data),
  togglePublish:   (id) => admin.patch(`/resources/${id}/toggle`, {}, { headers: authHeader() }).then(r => r.data),

  // Courses
  getCourses:   () => admin.get("/courses",            { headers: authHeader() }).then(r => r.data),
  createCourse: (doc) => admin.post("/courses",         doc, { headers: authHeader() }).then(r => r.data),
  updateCourse: (id, doc) => admin.put(`/courses/${id}`, doc, { headers: authHeader() }).then(r => r.data),
  deleteCourse: (id) => admin.delete(`/courses/${id}`, { headers: authHeader() }).then(r => r.data),

  // Labs
  getLabs:   () => admin.get("/labs",                  { headers: authHeader() }).then(r => r.data),
  createLab: (doc) => admin.post("/labs",               doc, { headers: authHeader() }).then(r => r.data),
  updateLab: (id, doc) => admin.put(`/labs/${id}`,      doc, { headers: authHeader() }).then(r => r.data),
  deleteLab: (id) => admin.delete(`/labs/${id}`,        { headers: authHeader() }).then(r => r.data),
};
