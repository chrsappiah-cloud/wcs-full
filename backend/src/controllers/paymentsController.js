import { getDb } from "../config/db.js";
import * as accessDao from "../dao/accessDao.js";
import { paymentProviders, paymentStatuses } from "../data/paymentProviders.js";
import { storeProducts } from "../lib/iosCommerce.js";
import { simulationCatalog, simulationHealth } from "../lib/commerceSimulation.js";
import { sendAdminAlert } from "../lib/mailer.js";

const COMMERCE_BASE = (process.env.WCS_COMMERCE_BASE_URL || "").trim().replace(/\/$/, "");

async function commerceFetch(path, options = {}) {
  if (!COMMERCE_BASE) return null;
  const response = await fetch(`${COMMERCE_BASE}${path}`, {
    ...options,
    headers: { Accept: "application/json", "Content-Type": "application/json", ...options.headers },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`Commerce API ${response.status}`);
  return response.json();
}

export async function getPaymentsDashboard(req, res, next) {
  try {
    let integrations = [];
    let health = simulationHealth;
    let transactions = [];
    let commerceMode = "simulation";

    if (COMMERCE_BASE) {
      try {
        const [intRes, healthRes, txRes] = await Promise.allSettled([
          commerceFetch("/v1/integrations/status"),
          commerceFetch("/v1/system/health"),
          commerceFetch("/v1/support/purchase-search?query="),
        ]);
        if (intRes.status === "fulfilled") {
          integrations = intRes.value?.integrations ?? [];
          commerceMode = "live";
        }
        if (healthRes.status === "fulfilled") {
          health = healthRes.value?.health ?? health;
        }
        if (txRes.status === "fulfilled") {
          transactions = txRes.value?.results ?? [];
        }
      } catch (err) {
        commerceMode = "simulation-fallback";
      }
    }

    let accessRecords = [];
    let paymentEvents = [];
    if (!req.fallbackMode) {
      const db = getDb();
      accessRecords = await accessDao.listAll();
      paymentEvents = await db
        .collection("paymentEvents")
        .find({})
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray();
    }

    res.json({
      commerceMode,
      commerceBaseUrl: COMMERCE_BASE || null,
      providers: paymentProviders,
      paymentStatuses,
      products: storeProducts,
      catalog: simulationCatalog,
      health,
      integrations: integrations.length
        ? integrations
        : [
            { service: "apple_server_api", state: "inactive", detail: "Connect WCS commerce backend" },
            { service: "database", state: req.fallbackMode ? "inactive" : "active", detail: "MongoDB" },
            { service: "stripe", state: process.env.STRIPE_SECRET_KEY ? "active" : "inactive", detail: "Stripe" },
          ],
      transactions,
      accessRecords: accessRecords.slice(0, 20),
      paymentEvents,
    });
  } catch (err) {
    next(err);
  }
}

export async function activateIntegrations(req, res, next) {
  try {
    const { service } = req.body ?? {};
    if (!COMMERCE_BASE) {
      return res.status(503).json({
        error: "Commerce backend not configured. Set WCS_COMMERCE_BASE_URL to your WCS commerce API.",
      });
    }
    const result = await commerceFetch("/v1/integrations/activate", {
      method: "POST",
      body: JSON.stringify(service ? { service } : {}),
    });
    await sendAdminAlert({
      subject: "Payment integrations activated",
      body: `Service: ${service || "all"}\nBy: ${req.user.email}`,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function recordPaymentEvent(req, res, next) {
  try {
    const { userId, amount, currency, provider, productId, status, note } = req.body ?? {};
    if (!userId || !provider) {
      return res.status(400).json({ error: "userId and provider are required" });
    }
    const event = {
      userId: String(userId),
      amount: amount ?? null,
      currency: currency ?? "AUD",
      provider,
      productId: productId ?? null,
      status: status ?? "pending",
      note: note ?? "",
      recordedBy: req.user.email,
      createdAt: new Date(),
    };
    if (req.fallbackMode) {
      return res.json({ event, persisted: false });
    }
    const db = getDb();
    const result = await db.collection("paymentEvents").insertOne(event);
    if (status === "paid" && productId) {
      const user = await accessDao.findUserById(userId);
      if (user) {
        await accessDao.ensureForUser({
          userId: String(user._id),
          email: user.email,
          name: user.name,
          role: user.role,
        });
        await accessDao.grantSubscription(String(userId), productId, provider);
        const access = await accessDao.findByUserId(userId);
        if (access) {
          await accessDao.upsert({
            ...access,
            paymentStatus: "paid",
            paymentNote: note || `Paid via ${provider}`,
          });
        }
      }
    }
    res.status(201).json({ event: { ...event, _id: result.insertedId }, persisted: true });
  } catch (err) {
    next(err);
  }
}
