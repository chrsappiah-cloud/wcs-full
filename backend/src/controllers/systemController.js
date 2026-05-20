import { getDb } from "../config/db.js";
import { getSystemStatus } from "../lib/systemConfig.js";
import { sendAdminAlert, sendMail, emailConfigStatus } from "../lib/mailer.js";

export function getStatus(req, res) {
  res.json(getSystemStatus(req));
}

export async function testEmail(req, res, next) {
  try {
    const status = emailConfigStatus();
    if (!status.enabled) {
      return res.status(503).json({
        ok: false,
        error: "Email not configured. Set RESEND_API_KEY or SMTP_* on Vercel.",
        status,
      });
    }
    const result = await sendMail({
      to: status.notifyEmail,
      subject: "WCS test email — system activated",
      html: `<p>Email delivery is working for World Class Scholars.</p><p>Triggered by ${req.user.email} at ${new Date().toISOString()}</p>`,
      text: "WCS test email — system activated.",
    });
    res.json({ ok: result.sent, result, status });
  } catch (err) {
    next(err);
  }
}

export async function testDatabase(req, res, next) {
  try {
    if (req.fallbackMode) {
      return res.status(503).json({
        ok: false,
        error: "MongoDB not connected. Set MONGODB_URI on Vercel and redeploy.",
        mode: "fallback",
      });
    }
    const db = getDb();
    await db.command({ ping: 1 });
    const counts = {
      users: await db.collection("users").countDocuments(),
      contactMessages: await db.collection("contactMessages").countDocuments(),
      analytics: await db.collection("analytics").countDocuments(),
    };
    res.json({ ok: true, mode: "mongodb", counts });
  } catch (err) {
    next(err);
  }
}

export async function activateServices(req, res, next) {
  try {
    const results = {
      jwt: { ok: !!(process.env.JWT_SECRET || "").trim() },
      email: emailConfigStatus(),
      database: { ok: !req.fallbackMode },
      commerce: { ok: !!(process.env.WCS_COMMERCE_BASE_URL || "").trim() },
    };

    if (results.email.enabled) {
      results.emailTest = await sendAdminAlert({
        subject: "Services activation check",
        body: `Admin ${req.user.email} ran activate at ${new Date().toISOString()}`,
      });
    }

    if (!req.fallbackMode) {
      try {
        await getDb().command({ ping: 1 });
        results.databaseTest = { ok: true };
      } catch (e) {
        results.databaseTest = { ok: false, error: e.message };
      }
    }

    const commerceBase = (process.env.WCS_COMMERCE_BASE_URL || "").trim().replace(/\/$/, "");
    if (commerceBase && !commerceBase.includes("localhost")) {
      try {
        const r = await fetch(`${commerceBase}/v1/integrations/activate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: "{}",
          signal: AbortSignal.timeout(10000),
        });
        results.commerceActivate = { ok: r.ok, status: r.status };
      } catch (e) {
        results.commerceActivate = { ok: false, error: e.message };
      }
    }

    res.json({ ok: true, results });
  } catch (err) {
    next(err);
  }
}
