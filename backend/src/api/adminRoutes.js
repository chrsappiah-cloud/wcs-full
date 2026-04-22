import { Router } from "express";
import { requireAuth, requireAdmin } from "../middleware/requireAuth.js";
import * as admin from "../controllers/adminController.js";
import * as analytics from "../controllers/analyticsController.js";
import * as enrollment from "../controllers/enrollmentController.js";

const router = Router();

// ── Analytics (admin only) ────────────────────────────────────────────────────
router.get("/analytics",      requireAdmin, analytics.getStats);
router.get("/api-status",     admin.apiStatus);           // public — just infra info

// ── Resources CRUD ────────────────────────────────────────────────────────────
router.get("/resources",              requireAdmin, admin.listResources);
router.post("/resources",             requireAdmin, admin.createResource);
router.put("/resources/:id",          requireAdmin, admin.updateResource);
router.delete("/resources/:id",       requireAdmin, admin.deleteResource);
router.patch("/resources/:id/toggle", requireAdmin, admin.togglePublish);

// ── Courses CRUD ──────────────────────────────────────────────────────────────
router.get("/courses",          requireAdmin, admin.listCoursesAdmin);
router.post("/courses",         requireAdmin, admin.createCourse);
router.put("/courses/:id",      requireAdmin, admin.updateCourse);
router.delete("/courses/:id",   requireAdmin, admin.deleteCourse);

// ── Labs CRUD ─────────────────────────────────────────────────────────────────
router.get("/labs",          requireAdmin, admin.listLabsAdmin);
router.post("/labs",         requireAdmin, admin.createLab);
router.put("/labs/:id",      requireAdmin, admin.updateLab);
router.delete("/labs/:id",   requireAdmin, admin.deleteLab);

// ── Art Collections CRUD ──────────────────────────────────────────────────────
router.get("/art",          requireAdmin, admin.listArtAdmin);
router.post("/art",         requireAdmin, admin.createArt);
router.put("/art/:id",      requireAdmin, admin.updateArt);
router.delete("/art/:id",   requireAdmin, admin.deleteArt);

// ── Users ─────────────────────────────────────────────────────────────────────
router.get("/users",  requireAdmin, admin.listUsers);

// ── Enrollments ───────────────────────────────────────────────────────────────
router.get("/enrollments",  requireAdmin, admin.listEnrollments);

export default router;
