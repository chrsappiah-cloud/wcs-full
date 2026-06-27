import { describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { rateLimit } from "../src/middleware/rateLimit.js";
import { blockSuspiciousPaths, securityHeaders } from "../src/middleware/security.js";
import { validateAnalyticsBody } from "../src/middleware/validate.js";

function listen(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });
}

async function request(server, path, options = {}) {
  const { port } = server.address();
  const res = await fetch(`http://127.0.0.1:${port}${path}`, options);
  const body = await res.json().catch(() => null);
  return { status: res.status, body, headers: res.headers };
}

describe("security middleware", () => {
  it("blocks path traversal probes", async () => {
    const app = express();
    app.use(blockSuspiciousPaths);
    app.get("/ok", (_req, res) => res.json({ ok: true }));
    const server = await listen(app);
    const bad = await request(server, "/../.env");
    server.close();
    assert.equal(bad.status, 404);
  });

  it("sets security headers", async () => {
    const app = express();
    app.use(securityHeaders);
    app.get("/ok", (_req, res) => res.json({ ok: true }));
    const server = await listen(app);
    const res = await request(server, "/ok");
    server.close();
    assert.equal(res.headers.get("x-content-type-options"), "nosniff");
    assert.equal(res.headers.get("x-frame-options"), "DENY");
  });

  it("rate limits repeated requests", async () => {
    const app = express();
    app.get("/hit", rateLimit({ windowMs: 60_000, max: 2 }), (_req, res) => res.json({ ok: true }));
    const server = await listen(app);
    await request(server, "/hit");
    await request(server, "/hit");
    const third = await request(server, "/hit");
    server.close();
    assert.equal(third.status, 429);
    assert.match(third.body.error, /Too many requests/);
  });

  it("rejects analytics without event", async () => {
    const app = express();
    app.use(express.json());
    app.post("/track", validateAnalyticsBody, (_req, res) => res.json({ ok: true }));
    const server = await listen(app);
    const res = await request(server, "/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: "/" }),
    });
    server.close();
    assert.equal(res.status, 400);
  });
});
