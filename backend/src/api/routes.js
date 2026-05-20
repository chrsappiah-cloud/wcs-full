import { Router } from "express";
import * as content from "../controllers/contentController.js";
import * as library from "../controllers/libraryController.js";
import * as auth from "../controllers/authController.js";
import * as analytics from "../controllers/analyticsController.js";
import * as enrollment from "../controllers/enrollmentController.js";
import * as commerce from "../controllers/commerceController.js";
import * as access from "../controllers/accessController.js";
import * as contact from "../controllers/contactController.js";
import * as payments from "../controllers/paymentsController.js";
import * as system from "../controllers/systemController.js";
import { requireAuth, requireAdmin } from "../middleware/requireAuth.js";

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

// ── Apple commerce & TestFlight beta data ─────────────────────────────────────
router.get("/commerce/apple",     commerce.getAppleCommerce);
router.get("/commerce/beta-manifest", commerce.getBetaManifest);

// ── Subscriptions & access (works with MongoDB or fallback) ───────────────────
router.get("/access/catalog", access.getCatalog);
router.get("/access/me", requireAuth, access.getMyAccess);
router.get("/access/admin/records", requireAdmin, access.listAllAccess);
router.get("/access/admin/users/:userId", requireAdmin, access.getUserAccess);
router.patch("/access/admin/users/:userId", requireAdmin, access.updateUserAccess);
router.post("/access/admin/users/:userId/subscriptions", requireAdmin, access.grantSubscription);
router.patch(
  "/access/admin/users/:userId/subscriptions/:productId",
  requireAdmin,
  access.patchSubscription
);
router.delete(
  "/access/admin/users/:userId/subscriptions/:productId",
  requireAdmin,
  access.revokeSubscription
);

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post("/auth/register", auth.register);
router.post("/auth/login",    auth.login);
router.get("/auth/me",        requireAuth, auth.me);

// ── Contact & enquiries ───────────────────────────────────────────────────────
router.get("/contact", contact.getEmails);
router.post("/contact", contact.submit);
router.get("/contact/admin/messages", requireAdmin, contact.listAdmin);
router.patch("/contact/admin/messages/:id", requireAdmin, contact.patchAdmin);

// ── System, payments & integrations (admin) ───────────────────────────────────
router.get("/admin/system", requireAdmin, system.getStatus);
router.post("/admin/system/test-email", requireAdmin, system.testEmail);
router.post("/admin/system/test-database", requireAdmin, system.testDatabase);
router.post("/admin/system/activate", requireAdmin, system.activateServices);
router.get("/payments/admin/dashboard", requireAdmin, payments.getPaymentsDashboard);
router.post("/payments/admin/activate-integrations", requireAdmin, payments.activateIntegrations);
router.post("/payments/admin/events", requireAdmin, payments.recordPaymentEvent);

// ── Analytics ─────────────────────────────────────────────────────────────────
router.post("/analytics/track", analytics.track);
router.get("/analytics/dashboard", requireAdmin, analytics.getDashboard);

// ── Enrollments (authenticated) ───────────────────────────────────────────────
router.post("/enrollments",          requireAuth, enrollment.enroll);
router.get("/enrollments/mine",      requireAuth, enrollment.myEnrollments);
router.patch("/enrollments/:id",     requireAuth, enrollment.updateProgress);

export default router;
