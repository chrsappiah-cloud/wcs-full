import "dotenv/config";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import {
  platform,
  aboutPage,
  courses,
  labs,
  artCollections,
  resources,
} from "../data/siteContent.js";
import { subscriptionProducts, defaultEntitlementsForProduct } from "../data/accessCatalog.js";

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_NS = process.env.MONGODB_NS || "wcs";

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI. Copy .env.example to .env and configure.");
  process.exit(1);
}

const client = new MongoClient(MONGODB_URI);


async function run() {
  await client.connect();
  const db = client.db(MONGODB_NS);

  await db.collection("platform").deleteMany({});
  await db.collection("pages").deleteMany({});
  await db.collection("courses").deleteMany({});
  await db.collection("labs").deleteMany({});
  await db.collection("artCollections").deleteMany({});
  await db.collection("resources").deleteMany({});
  await db.collection("resources").dropIndexes();
  await db.collection("users").deleteMany({ role: "admin" });
  await db.collection("memberAccess").deleteMany({});
  await db.collection("contactMessages").deleteMany({});
  await db.collection("enrollments").deleteMany({});
  await db.collection("analytics").deleteMany({});

  await db.collection("platform").insertOne(platform);
  await db.collection("pages").insertOne(aboutPage);
  await db.collection("courses").insertMany(courses);
  await db.collection("labs").insertMany(labs);
  await db.collection("artCollections").insertMany(artCollections);
  await db.collection("resources").insertMany(resources);

  await db.collection("resources").createIndex(
    { title: "text", summary: "text", body: "text" },
    { name: "resources_text" }
  );

  // Admin user
  const passwordHash = await bcrypt.hash("admin123", 12);
  const adminInsert = await db.collection("users").insertOne({
    name: "Dr Christopher Appiah-Thompson",
    email: "admin@myworldclass.org",
    passwordHash,
    role: "admin",
    createdAt: new Date(),
  });
  const adminId = String(adminInsert.insertedId);

  const entitlements = subscriptionProducts.flatMap((p) =>
    defaultEntitlementsForProduct(p.productId)
  );
  await db.collection("memberAccess").insertOne({
    userId: adminId,
    email: "admin@myworldclass.org",
    name: "Dr Christopher Appiah-Thompson",
    role: "admin",
    subscriptions: subscriptionProducts.map((p) => ({
      productId: p.productId,
      name: p.name,
      type: p.type,
      status: "active",
      source: "seed",
      entitlement: p.entitlement,
      priceLabel: p.priceLabel,
      renewedAt: new Date().toISOString(),
      expiresAt: null,
    })),
    entitlements,
    features: ["library_premium", "courses_all", "ios_commerce", "podcast_referrals"],
    paymentStatus: "paid",
    paymentNote: "Seeded administrator",
    updatedAt: new Date(),
  });

  // Seed analytics events for dashboard
  const analyticsEvents = [
    { event: "page_view", path: "/", meta: {}, geo: { country: "GB", city: "London", region: null }, sessionId: "seed-gb-1", ts: new Date(Date.now() - 86400000 * 6) },
    { event: "page_view", path: "/library", meta: {}, geo: { country: "US", city: "New York", region: "NY" }, sessionId: "seed-us-1", ts: new Date(Date.now() - 86400000 * 5) },
    { event: "search", path: "/library", meta: { q: "trauma care" }, geo: { country: "US", city: null, region: null }, sessionId: "seed-us-1", ts: new Date(Date.now() - 86400000 * 5) },
    { event: "page_view", path: "/courses", meta: {}, geo: { country: "NG", city: "Lagos", region: null }, sessionId: "seed-ng-1", ts: new Date(Date.now() - 86400000 * 4) },
    { event: "subscription_attempt", path: "/account", meta: { productId: "wcs_premium_monthly" }, geo: { country: "GH", city: "Accra", region: null }, sessionId: "seed-gh-1", ts: new Date(Date.now() - 86400000 * 4) },
    { event: "page_view", path: "/about", meta: {}, geo: { country: "IE", city: null, region: null }, sessionId: "seed-ie-1", ts: new Date(Date.now() - 86400000 * 3) },
    { event: "search", path: "/library", meta: { q: "open access" }, geo: { country: "DE", city: "Berlin", region: null }, sessionId: "seed-de-1", ts: new Date(Date.now() - 86400000 * 3) },
    { event: "page_view", path: "/digital-marketing", meta: {}, geo: { country: "GB", city: null, region: null }, sessionId: "seed-gb-2", ts: new Date(Date.now() - 86400000 * 2) },
    { event: "login", path: "/login", meta: { success: true }, geo: { country: "GB", city: "London", region: null }, sessionId: "seed-gb-2", ts: new Date(Date.now() - 86400000 * 2) },
    { event: "search", path: "/library", meta: { q: "dementia" }, geo: { country: "AU", city: "Sydney", region: null }, sessionId: "seed-au-1", ts: new Date(Date.now() - 86400000 * 2) },
    { event: "page_view", path: "/digital-advertising", meta: {}, geo: { country: "CA", city: "Toronto", region: null }, sessionId: "seed-ca-1", ts: new Date(Date.now() - 86400000) },
    { event: "subscription_attempt", path: "/marketing", meta: { productId: "wcs_ai_tutor_pack_10" }, geo: { country: "FR", city: null, region: null }, sessionId: "seed-fr-1", ts: new Date(Date.now() - 86400000) },
    { event: "enroll", path: "/my-courses", meta: { courseSlug: "trauma-informed-care" }, geo: { country: "NG", city: null, region: null }, sessionId: "seed-ng-1", ts: new Date(Date.now() - 43200000) },
    { event: "page_view", path: "/library", meta: {}, geo: { country: "KE", city: "Nairobi", region: null }, sessionId: "seed-ke-1", ts: new Date() },
    { event: "search", path: "/library", meta: { q: "trauma care" }, geo: { country: "GB", city: null, region: null }, sessionId: "seed-gb-3", ts: new Date() },
    { event: "page_view", path: "/", meta: {}, geo: { country: "US", city: null, region: null }, sessionId: "seed-us-2", ts: new Date() },
  ];
  await db.collection("analytics").insertMany(analyticsEvents);

  await db.collection("contactMessages").insertMany([
    {
      name: "Sample Visitor",
      email: "visitor@example.com",
      type: "feedback",
      subject: "Great library experience",
      message: "The federated search is very helpful for my research.",
      routedTo: "support@myworldclass.org",
      status: "new",
      createdAt: new Date(Date.now() - 86400000),
    },
  ]);

  console.log(`Seeded "${MONGODB_NS}": ${resources.length} resources, ${courses.length} courses, ${labs.length} labs, ${artCollections.length} art collections, 1 admin user, text index.`);
  await client.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
