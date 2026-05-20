import { getDb } from "../config/db.js";
import * as accessDao from "../dao/accessDao.js";
import {
  fallbackAccessByEmail,
  getFallbackAccess,
  setFallbackAccess,
} from "../data/accessFallback.js";
import { subscriptionProducts } from "../data/accessCatalog.js";

export function getCatalog(_req, res) {
  res.json(accessDao.getCatalog());
}

export async function getMyAccess(req, res, next) {
  try {
    if (req.fallbackMode) {
      const access = getFallbackAccess(req.user.email, req.user);
      return res.json({ access, enrollments: [], catalog: accessDao.getCatalog() });
    }
    await accessDao.syncUserFromProfile(req.user);
    const access = await accessDao.findByUserId(req.user.sub);
    const enrollments = await getDb()
      .collection("enrollments")
      .find({ userId: req.user.sub })
      .sort({ enrolledAt: -1 })
      .toArray();
    res.json({
      access: access ?? {
        userId: req.user.sub,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        subscriptions: [],
        entitlements: [],
        features: [],
        paymentStatus: "none",
      },
      enrollments,
      catalog: accessDao.getCatalog(),
    });
  } catch (err) {
    next(err);
  }
}

export async function listAllAccess(req, res, next) {
  try {
    if (req.fallbackMode) {
      return res.json({
        records: Object.values(fallbackAccessByEmail),
        users: [
          {
            _id: "fallback-admin",
            email: "admin@myworldclass.org",
            name: "WCS Admin",
            role: "admin",
          },
        ],
      });
    }
    const [records, users] = await Promise.all([
      accessDao.listAll(),
      accessDao.listAllUsers(),
    ]);
    res.json({ records, users });
  } catch (err) {
    next(err);
  }
}

export async function getUserAccess(req, res, next) {
  try {
    const userId = req.params.userId;
    if (req.fallbackMode) {
      const email = userId === "fallback-admin" ? "admin@myworldclass.org" : req.user?.email;
      const user = {
        _id: userId,
        email,
        name: "WCS Admin",
        role: "admin",
      };
      return res.json({ access: getFallbackAccess(email, { sub: userId, ...user }), user });
    }
    const user = await accessDao.findUserById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    let access = await accessDao.findByUserId(userId);
    if (!access) {
      access = await accessDao.ensureForUser({
        userId: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
      });
    }
    res.json({ access, user });
  } catch (err) {
    next(err);
  }
}

export async function updateUserAccess(req, res, next) {
  try {
    const userId = req.params.userId;
    const { paymentStatus, paymentNote, features, entitlements } = req.body ?? {};

    if (req.fallbackMode) {
      const email = userId === "fallback-admin" ? "admin@myworldclass.org" : null;
      if (!email || !fallbackAccessByEmail[email]) {
        return res.status(404).json({ error: "Access record not found" });
      }
      const access = setFallbackAccess(email, {
        ...(paymentStatus !== undefined && { paymentStatus }),
        ...(paymentNote !== undefined && { paymentNote }),
        ...(features !== undefined && { features }),
        ...(entitlements !== undefined && { entitlements }),
      });
      return res.json({ access });
    }

    const existing = await accessDao.findByUserId(userId);
    if (!existing) return res.status(404).json({ error: "Access record not found" });
    const access = await accessDao.upsert({
      ...existing,
      ...(paymentStatus !== undefined && { paymentStatus }),
      ...(paymentNote !== undefined && { paymentNote }),
      ...(features !== undefined && { features }),
      ...(entitlements !== undefined && { entitlements }),
    });
    res.json({ access });
  } catch (err) {
    next(err);
  }
}

export async function grantSubscription(req, res, next) {
  try {
    const { productId, source } = req.body ?? {};
    if (!productId) return res.status(400).json({ error: "productId required" });
    if (!subscriptionProducts.some((p) => p.productId === productId)) {
      return res.status(400).json({ error: "Unknown productId" });
    }

    if (req.fallbackMode) {
      const email = "admin@myworldclass.org";
      const product = subscriptionProducts.find((p) => p.productId === productId);
      const current = getFallbackAccess(email);
      const subs = [...(current.subscriptions ?? [])];
      const idx = subs.findIndex((s) => s.productId === productId);
      const entry = {
        productId: product.productId,
        name: product.name,
        type: product.type,
        status: "active",
        source: source ?? "manual",
        entitlement: product.entitlement,
        priceLabel: product.priceLabel,
        renewedAt: new Date().toISOString(),
        expiresAt: null,
      };
      if (idx >= 0) subs[idx] = entry;
      else subs.push(entry);
      const access = setFallbackAccess(email, {
        subscriptions: subs,
        paymentStatus: "paid",
      });
      return res.json({ access });
    }

    const user = await accessDao.findUserById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    await accessDao.ensureForUser({
      userId: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
    });
    const access = await accessDao.grantSubscription(String(user._id), productId, source ?? "manual");
    if (!access) return res.status(400).json({ error: "Could not grant subscription" });
    res.json({ access });
  } catch (err) {
    next(err);
  }
}

export async function patchSubscription(req, res, next) {
  try {
    const { status } = req.body ?? {};
    if (!status) return res.status(400).json({ error: "status required" });

    if (req.fallbackMode) {
      const email = "admin@myworldclass.org";
      const current = getFallbackAccess(email);
      const subs = (current.subscriptions ?? []).map((s) =>
        s.productId === req.params.productId
          ? { ...s, status, updatedAt: new Date().toISOString() }
          : s
      );
      const access = setFallbackAccess(email, { subscriptions: subs });
      return res.json({ access });
    }

    const access = await accessDao.updateSubscription(
      req.params.userId,
      req.params.productId,
      { status }
    );
    if (!access) return res.status(404).json({ error: "Subscription not found" });
    res.json({ access });
  } catch (err) {
    next(err);
  }
}

export async function revokeSubscription(req, res, next) {
  try {
    if (req.fallbackMode) {
      const email = "admin@myworldclass.org";
      const current = getFallbackAccess(email);
      const subs = (current.subscriptions ?? []).map((s) =>
        s.productId === req.params.productId
          ? { ...s, status: "cancelled", updatedAt: new Date().toISOString() }
          : s
      );
      const access = setFallbackAccess(email, { subscriptions: subs });
      return res.json({ access });
    }

    const access = await accessDao.revokeSubscription(req.params.userId, req.params.productId);
    if (!access) return res.status(404).json({ error: "Subscription not found" });
    res.json({ access });
  } catch (err) {
    next(err);
  }
}
