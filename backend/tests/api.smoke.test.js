import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";

const __dirname = dirname(fileURLToPath(import.meta.url));
const backendRoot = join(__dirname, "..");

const BASE = process.env.TEST_API_BASE || "http://127.0.0.1:3001";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const MONGODB_NS = process.env.MONGODB_NS || "wcs_test_smoke";

let adminToken = null;

async function request(path, options = {}) {
  const response = await fetch(`${BASE}${path}`, {
    headers: { Accept: "application/json", ...options.headers },
    ...options,
  });
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { status: response.status, body };
}

describe("WCS API smoke tests", () => {
  before(async () => {
    const seed = spawnSync("node", ["src/utils/seed.js"], {
      cwd: backendRoot,
      env: { ...process.env, MONGODB_URI, MONGODB_NS },
      stdio: "inherit",
    });
    assert.equal(seed.status, 0, "seed must succeed before smoke tests");

    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(MONGODB_NS);
    const passwordHash = await bcrypt.hash("admin123", 12);
    await db.collection("users").updateOne(
      { email: "admin@myworldclass.org" },
      {
        $set: {
          email: "admin@myworldclass.org",
          passwordHash,
          role: "admin",
          name: "WCS Admin",
        },
      },
      { upsert: true }
    );
    await client.close();

    const login = await request("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@myworldclass.org", password: "admin123" }),
    });
    assert.equal(login.status, 200);
    adminToken = login.body.token;
    assert.ok(adminToken);
  });

  it("GET /health returns ok", async () => {
    const { status, body } = await request("/health");
    assert.equal(status, 200);
    assert.equal(body.ok, true);
  });

  it("GET /api/v1/platform", async () => {
    const { status, body } = await request("/api/v1/platform");
    assert.equal(status, 200);
    assert.match(body.name, /World Class Scholars/);
    assert.ok(Array.isArray(body.nav));
    assert.ok(body.nav.some((n) => n.to === "/marketing"));
    assert.ok(body.nav.some((n) => n.to === "/digital-marketing"));
    assert.ok(body.nav.some((n) => n.to === "/digital-advertising"));
    const labels = body.nav.map((n) => n.label);
    assert.ok(labels.includes("Digital Marketing"));
    assert.ok(labels.includes("Digital Advertising"));
  });

  it("GET /api/v1/about", async () => {
    const { status, body } = await request("/api/v1/about");
    assert.equal(status, 200);
    assert.ok(body.founder?.name);
    assert.ok(body.founder.social?.length);
  });

  it("GET /api/v1/courses", async () => {
    const { status, body } = await request("/api/v1/courses");
    assert.equal(status, 200);
    assert.ok(Array.isArray(body));
  });

  it("GET /api/v1/labs", async () => {
    const { status, body } = await request("/api/v1/labs");
    assert.equal(status, 200);
    assert.ok(Array.isArray(body));
  });

  it("GET /api/v1/art-verse", async () => {
    const { status, body } = await request("/api/v1/art-verse");
    assert.equal(status, 200);
    assert.ok(body);
  });

  it("GET /api/v1/resources/featured", async () => {
    const { status, body } = await request("/api/v1/resources/featured");
    assert.equal(status, 200);
    assert.ok(Array.isArray(body));
  });

  it("GET /api/v1/library/search", async () => {
    const { status, body } = await request("/api/v1/library/search?q=care&source=internal");
    assert.equal(status, 200);
    assert.equal(body.query, "care");
    assert.ok(Array.isArray(body.internal));
  });

  it("GET /api/v1/commerce/apple", async () => {
    const { status, body } = await request("/api/v1/commerce/apple");
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.storeProducts));
    assert.ok(body.storeProducts.length >= 3);
    assert.ok(Array.isArray(body.endpoints));
  });

  it("GET /api/v1/commerce/beta-manifest", async () => {
    const { status, body } = await request("/api/v1/commerce/beta-manifest");
    assert.equal(status, 200);
    assert.equal(body.schema, "wcs-ios-beta-manifest/1.0");
    assert.ok(Array.isArray(body.apps));
  });

  it("POST /api/v1/analytics/track", async () => {
    const { status } = await request("/api/v1/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "test_event", path: "/test" }),
    });
    assert.equal(status, 201);
  });

  it("GET /api/admin/api-status", async () => {
    const { status, body } = await request("/api/admin/api-status");
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.status));
    assert.ok(body.status.length > 0);
  });

  it("GET /api/admin/analytics requires admin", async () => {
    const { status, body } = await request("/api/admin/analytics", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(status, 200);
    assert.ok(body);
  });

  it("GET /api/v1/auth/me with token", async () => {
    const { status, body } = await request("/api/v1/auth/me", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(status, 200);
    assert.equal(body.role, "admin");
  });

  it("GET /api/v1/access/catalog", async () => {
    const { status, body } = await request("/api/v1/access/catalog");
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.products));
    assert.ok(body.products.some((p) => p.productId === "wcs_premium_monthly"));
  });

  it("GET /api/v1/access/me requires auth", async () => {
    const { status, body } = await request("/api/v1/access/me", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(status, 200);
    assert.ok(body.access);
    assert.equal(body.access.email, "admin@myworldclass.org");
  });

  it("GET /api/v1/contact returns public emails", async () => {
    const { status, body } = await request("/api/v1/contact");
    assert.equal(status, 200);
    assert.equal(body.adminEmail, "admin@myworldclass.org");
    assert.equal(body.supportEmail, "support@myworldclass.org");
  });

  it("POST /api/v1/contact accepts enquiry", async () => {
    const { status, body } = await request("/api/v1/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Smoke Test",
        email: "smoke@example.com",
        type: "feedback",
        subject: "Test",
        message: "Automated smoke test enquiry.",
      }),
    });
    assert.equal(status, 201);
    assert.equal(body.ok, true);
    assert.ok(body.routedTo);
  });

  it("GET /api/v1/analytics/dashboard requires admin", async () => {
    const { status, body } = await request("/api/v1/analytics/dashboard", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.mapMarkers));
    assert.ok(body.uniqueSessions >= 0);
    assert.ok(body.topPages);
  });

  it("GET /api/v1/access/admin/records requires admin", async () => {
    const { status, body } = await request("/api/v1/access/admin/records", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(status, 200);
    assert.ok(Array.isArray(body.users));
  });
});
