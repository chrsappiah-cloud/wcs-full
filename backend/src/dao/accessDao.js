import { ObjectId } from "mongodb";
import { getDb } from "../config/db.js";
import {
  defaultEntitlementsForProduct,
  featureFlags,
  subscriptionProducts,
} from "../data/accessCatalog.js";

const col = () => getDb().collection("memberAccess");

function emptyAccess(userId, email, name, role) {
  return {
    userId: String(userId),
    email: email?.toLowerCase() ?? "",
    name: name ?? "",
    role: role ?? "user",
    subscriptions: [],
    entitlements: [],
    features: [],
    paymentStatus: "none",
    paymentNote: "",
    updatedAt: new Date(),
  };
}

export async function findByUserId(userId) {
  return col().findOne({ userId: String(userId) });
}

export async function findByEmail(email) {
  return col().findOne({ email: email.toLowerCase() });
}

export async function ensureForUser({ userId, email, name, role }) {
  const existing = await findByUserId(userId);
  if (existing) return existing;
  const doc = emptyAccess(userId, email, name, role);
  const result = await col().insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function listAll() {
  return col().find({}).sort({ updatedAt: -1 }).toArray();
}

export async function upsert(doc) {
  const userId = String(doc.userId);
  const payload = {
    ...doc,
    userId,
    email: doc.email?.toLowerCase(),
    updatedAt: new Date(),
  };
  delete payload._id;
  await col().updateOne({ userId }, { $set: payload }, { upsert: true });
  return findByUserId(userId);
}

export async function updateSubscription(userId, productId, patch) {
  const doc = await findByUserId(userId);
  if (!doc) return null;
  const subs = [...(doc.subscriptions ?? [])];
  const idx = subs.findIndex((s) => s.productId === productId);
  if (idx < 0) return null;
  subs[idx] = { ...subs[idx], ...patch, updatedAt: new Date().toISOString() };
  return upsert({ ...doc, subscriptions: subs });
}

export async function grantSubscription(userId, productId, source = "manual") {
  const product = subscriptionProducts.find((p) => p.productId === productId);
  if (!product) return null;
  const doc = await findByUserId(userId);
  if (!doc) return null;
  const subs = [...(doc.subscriptions ?? [])];
  const existing = subs.findIndex((s) => s.productId === productId);
  const entry = {
    productId: product.productId,
    name: product.name,
    type: product.type,
    status: "active",
    source,
    entitlement: product.entitlement,
    priceLabel: product.priceLabel,
    renewedAt: new Date().toISOString(),
    expiresAt: null,
  };
  if (existing >= 0) subs[existing] = entry;
  else subs.push(entry);
  const entitlements = mergeEntitlements(doc.entitlements, defaultEntitlementsForProduct(productId));
  const features = mergeFeatures(doc.features, featuresForProduct(productId));
  return upsert({
    ...doc,
    subscriptions: subs,
    entitlements,
    features,
    paymentStatus: doc.paymentStatus === "none" ? "paid" : doc.paymentStatus,
  });
}

export async function revokeSubscription(userId, productId) {
  const doc = await findByUserId(userId);
  if (!doc) return null;
  const subs = (doc.subscriptions ?? []).map((s) =>
    s.productId === productId ? { ...s, status: "cancelled", updatedAt: new Date().toISOString() } : s
  );
  return upsert({ ...doc, subscriptions: subs });
}

function mergeEntitlements(current, added) {
  const map = new Map((current ?? []).map((e) => [e.code, e]));
  for (const e of added) map.set(e.code, e);
  return [...map.values()];
}

function featuresForProduct(productId) {
  if (productId === "wcs_premium_monthly") {
    return ["library_premium", "courses_all", "ios_commerce", "podcast_referrals"];
  }
  if (productId === "wcs_exam_pack_unlock") return ["ios_commerce"];
  return [];
}

export function getCatalog() {
  return { products: subscriptionProducts, featureFlags };
}

export async function syncUserFromProfile(user) {
  return ensureForUser({
    userId: user.sub,
    email: user.email,
    name: user.name,
    role: user.role,
  });
}

export async function findUserById(userId) {
  if (!ObjectId.isValid(userId)) return null;
  return getDb().collection("users").findOne(
    { _id: new ObjectId(userId) },
    { projection: { passwordHash: 0 } }
  );
}

export async function listAllUsers() {
  return getDb()
    .collection("users")
    .find({}, { projection: { passwordHash: 0 } })
    .sort({ createdAt: -1 })
    .toArray();
}
