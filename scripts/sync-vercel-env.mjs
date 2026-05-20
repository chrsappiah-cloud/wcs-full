#!/usr/bin/env node
/**
 * Sync env vars from backend/.env + backend/.env.production to Vercel.
 * Skips localhost-only values. Never prints secret values.
 */
import { readFileSync, existsSync } from "fs";
import { spawnSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { randomBytes } from "crypto";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const backend = join(root, "backend");

function parseEnvFile(path) {
  if (!existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 1) continue;
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return out;
}

const env = {
  ...parseEnvFile(join(backend, ".env")),
  ...parseEnvFile(join(backend, ".env.production")),
  ...Object.fromEntries(
    Object.entries(process.env).filter(([k]) =>
      /^(MONGODB_URI|RESEND_API_KEY|SMTP_|JWT_SECRET|WCS_COMMERCE|STRIPE_|EMAIL_|NOTIFY_)/.test(k)
    )
  ),
};

const SKIP_LOCAL = (v) =>
  !v ||
  v.includes("127.0.0.1") ||
  v.includes("localhost") ||
  v === "wcs-dev-secret" ||
  v === "wcs-dev-secret-change-in-production";

const SYNC_KEYS = [
  "MONGODB_URI",
  "MONGODB_NS",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "OPEN_LIBRARY_BASE",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "NOTIFY_EMAIL",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_SECURE",
  "WCS_COMMERCE_BASE_URL",
  "STRIPE_SECRET_KEY",
  "VITE_SITE_URL",
];

if (!env.JWT_SECRET || SKIP_LOCAL(env.JWT_SECRET)) {
  env.JWT_SECRET = randomBytes(32).toString("hex");
  console.log("Generated new JWT_SECRET for Vercel sync.");
}

const targets = ["production", "preview"];
let synced = 0;
let skipped = 0;

for (const key of SYNC_KEYS) {
  const value = env[key];
  if (!value || SKIP_LOCAL(value)) {
    skipped++;
    continue;
  }
  const sensitive = /SECRET|KEY|PASS|URI/i.test(key);
  for (const target of targets) {
    const args = [
      "env",
      "add",
      key,
      target,
      "--value",
      value,
      "--yes",
      "--force",
      ...(sensitive ? ["--sensitive"] : []),
    ];
    const r = spawnSync("vercel", args, { cwd: root, encoding: "utf8", timeout: 120000 });
    if (r.status === 0) synced++;
    else if (r.stderr) console.warn(`[skip] ${key}@${target}:`, r.stderr.split("\n")[0]);
  }
  console.log(`Synced: ${key}`);
}

console.log(`\nDone. ${synced} Vercel env entries updated, ${skipped} keys missing or local-only.`);
console.log("Add secrets to backend/.env.production then re-run: npm run sync:vercel");
console.log("Redeploy: npx vercel --prod");
