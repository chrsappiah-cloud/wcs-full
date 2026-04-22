import { getDb } from "../config/db.js";

const col = (name) => getDb().collection(name);

export async function findPlatform() {
  return col("platform").findOne({});
}

export async function findPageBySlug(slug) {
  return col("pages").findOne({ slug });
}

export async function listCourses() {
  return col("courses").find({}).sort({ order: 1 }).toArray();
}

export async function listLabs() {
  return col("labs").find({}).sort({ order: 1 }).toArray();
}

export async function listArtCollections() {
  return col("artCollections").find({}).sort({ order: 1 }).toArray();
}

export async function listFeaturedResources(limit = 6) {
  return col("resources")
    .find({ featured: true })
    .sort({ order: 1 })
    .limit(limit)
    .toArray();
}

export async function findResourceBySlug(slug) {
  return col("resources").findOne({ slug });
}

export async function searchResources(q, limit = 20) {
  const query = q?.trim();
  if (!query) return [];
  return col("resources")
    .find({ $text: { $search: query } }, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .limit(limit)
    .toArray();
}
