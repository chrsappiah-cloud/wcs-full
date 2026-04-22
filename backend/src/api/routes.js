import { Router } from "express";
import * as content from "../controllers/contentController.js";
import * as library from "../controllers/libraryController.js";
import * as auth from "../controllers/authController.js";
import * as analytics from "../controllers/analyticsController.js";
import * as enrollment from "../controllers/enrollmentController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

// ── Public content ────────────────────────────────────────────────────────────
router.get("/platform",           content.getPlatform);
router.get("/about",              content.getAbout);
router.get("/courses",            content.getCourses);
router.get("/labs",               content.getLabs);
router.get("/art-verse",          content.getArtVerse);
router.get("/resources/featured", content.getFeaturedResources);
router.get("/resources/:slug",    content.getResourceBySlug);
router.get("/library/search",     library.librarySearch);

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post("/auth/register", auth.register);
router.post("/auth/login",    auth.login);
router.get("/auth/me",        requireAuth, auth.me);

// ── Analytics (public write, admin read is in adminRoutes) ────────────────────
router.post("/analytics/track", analytics.track);

// ── Enrollments (authenticated) ───────────────────────────────────────────────
router.post("/enrollments",          requireAuth, enrollment.enroll);
router.get("/enrollments/mine",      requireAuth, enrollment.myEnrollments);
router.patch("/enrollments/:id",     requireAuth, enrollment.updateProgress);

export default router;
