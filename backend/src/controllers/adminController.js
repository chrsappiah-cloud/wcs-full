import { getDb } from "../config/db.js";
import { ObjectId } from "mongodb";
import * as userDao from "../dao/userDao.js";

const col = (name) => getDb().collection(name);

function toOid(id) {
  try { return new ObjectId(id); } catch { return null; }
}

// ── Generic CRUD helpers ──────────────────────────────────────────────────────

async function listCollection(name, res, next) {
  try { res.json(await col(name).find({}).sort({ order: 1, createdAt: -1 }).toArray()); }
  catch (err) { next(err); }
}

async function createDoc(name, req, res, next) {
  try {
    const doc = { ...req.body, createdAt: new Date(), updatedAt: new Date() };
    const result = await col(name).insertOne(doc);
    res.status(201).json({ ...doc, _id: result.insertedId });
  } catch (err) { next(err); }
}

async function updateDoc(name, req, res, next) {
  try {
    const _id = toOid(req.params.id);
    if (!_id) return res.status(400).json({ error: "Invalid id" });
    const update = { ...req.body, updatedAt: new Date() };
    delete update._id;
    const result = await col(name).findOneAndUpdate(
      { _id },
      { $set: update },
      { returnDocument: "after" }
    );
    if (!result) return res.status(404).json({ error: "Not found" });
    res.json(result);
  } catch (err) { next(err); }
}

async function deleteDoc(name, req, res, next) {
  try {
    const _id = toOid(req.params.id);
    if (!_id) return res.status(400).json({ error: "Invalid id" });
    const result = await col(name).deleteOne({ _id });
    if (!result.deletedCount) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) { next(err); }
}

// ── Resources ─────────────────────────────────────────────────────────────────
export const listResources   = (req, res, next) => listCollection("resources", res, next);
export const createResource  = (req, res, next) => createDoc("resources", req, res, next);
export const updateResource  = (req, res, next) => updateDoc("resources", req, res, next);
export const deleteResource  = (req, res, next) => deleteDoc("resources", req, res, next);

// ── Courses ───────────────────────────────────────────────────────────────────
export const listCoursesAdmin  = (req, res, next) => listCollection("courses", res, next);
export const createCourse      = (req, res, next) => createDoc("courses", req, res, next);
export const updateCourse      = (req, res, next) => updateDoc("courses", req, res, next);
export const deleteCourse      = (req, res, next) => deleteDoc("courses", req, res, next);

// ── Labs ──────────────────────────────────────────────────────────────────────
export const listLabsAdmin  = (req, res, next) => listCollection("labs", res, next);
export const createLab      = (req, res, next) => createDoc("labs", req, res, next);
export const updateLab      = (req, res, next) => updateDoc("labs", req, res, next);
export const deleteLab      = (req, res, next) => deleteDoc("labs", req, res, next);

// ── Art Collections ───────────────────────────────────────────────────────────
export const listArtAdmin  = (req, res, next) => listCollection("artCollections", res, next);
export const createArt     = (req, res, next) => createDoc("artCollections", req, res, next);
export const updateArt     = (req, res, next) => updateDoc("artCollections", req, res, next);
export const deleteArt     = (req, res, next) => deleteDoc("artCollections", req, res, next);

// ── Users ─────────────────────────────────────────────────────────────────────
export async function listUsers(req, res, next) {
  try { res.json(await userDao.listUsers()); } catch (err) { next(err); }
}

// ── Enrollments ───────────────────────────────────────────────────────────────
export async function listEnrollments(req, res, next) {
  try {
    res.json(await col("enrollments").find({}).sort({ enrolledAt: -1 }).toArray());
  } catch (err) { next(err); }
}

// ── Publishing toggle ─────────────────────────────────────────────────────────
export async function togglePublish(req, res, next) {
  try {
    const _id = toOid(req.params.id);
    if (!_id) return res.status(400).json({ error: "Invalid id" });
    const doc = await col("resources").findOne({ _id });
    if (!doc) return res.status(404).json({ error: "Not found" });
    const updated = await col("resources").findOneAndUpdate(
      { _id },
      { $set: { published: !doc.published, updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    res.json(updated);
  } catch (err) { next(err); }
}

// ── API status ────────────────────────────────────────────────────────────────
export async function apiStatus(req, res, next) {
  try {
    const db = getDb();
    const endpoints = [
      { path: "/api/v1/platform",           collection: "platform" },
      { path: "/api/v1/about",              collection: "pages" },
      { path: "/api/v1/courses",            collection: "courses" },
      { path: "/api/v1/labs",               collection: "labs" },
      { path: "/api/v1/art-verse",          collection: "artCollections" },
      { path: "/api/v1/resources/featured", collection: "resources" },
      { path: "/api/v1/library/search",     collection: "resources" },
    ];

    const status = await Promise.all(
      endpoints.map(async (ep) => {
        const count = await db.collection(ep.collection).countDocuments();
        return { ...ep, count, status: count > 0 ? "live" : "empty" };
      })
    );

    res.json({ uptime: process.uptime(), status });
  } catch (err) { next(err); }
}
