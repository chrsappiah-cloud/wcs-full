import axios from "axios";

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

  // Analytics
  track: (event, path, meta = {}) =>
    client.post("/analytics/track", { event, path, meta }).catch(() => {}),

  // Auth
  login:    (email, password) => client.post("/auth/login",    { email, password }).then(r => r.data),
  register: (name, email, password) => client.post("/auth/register", { name, email, password }).then(r => r.data),
  me:       () => client.get("/auth/me", { headers: authHeader() }).then(r => r.data),

  // Enrollments
  enroll:         (courseSlug) => client.post("/enrollments", { courseSlug }, { headers: authHeader() }).then(r => r.data),
  myEnrollments:  () => client.get("/enrollments/mine", { headers: authHeader() }).then(r => r.data),
  updateProgress: (id, progress) => client.patch(`/enrollments/${id}`, { progress }, { headers: authHeader() }).then(r => r.data),
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
