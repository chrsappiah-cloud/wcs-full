import { subscriptionProducts, featureFlags } from "./accessCatalog.js";

/** Demo access when MongoDB is unavailable */
export const fallbackAccessByEmail = {
  "admin@myworldclass.org": {
    userId: "fallback-admin",
    email: "admin@myworldclass.org",
    name: "WCS Admin",
    role: "admin",
    subscriptions: subscriptionProducts.map((p) => ({
      productId: p.productId,
      name: p.name,
      type: p.type,
      status: "active",
      source: "manual",
      entitlement: p.entitlement,
      priceLabel: p.priceLabel,
      renewedAt: new Date().toISOString(),
      expiresAt: null,
    })),
    entitlements: [
      { code: "premium_membership", status: "active", detail: "Admin — full access", expiresAt: null },
      { code: "ai_tutor_credits", status: "active", detail: "Unlimited (admin)", expiresAt: null },
      { code: "specialist_tool_unlock", status: "active", detail: "Unlocked", expiresAt: null },
    ],
    features: featureFlags.map((f) => f.id),
    paymentStatus: "paid",
    paymentNote: "Administrator account",
    updatedAt: new Date().toISOString(),
  },
};

export function getFallbackAccess(email, user = {}) {
  const key = email?.toLowerCase();
  if (fallbackAccessByEmail[key]) {
    return { ...fallbackAccessByEmail[key], userId: user.sub ?? fallbackAccessByEmail[key].userId };
  }
  return {
    userId: user.sub ?? "fallback-guest",
    email: key ?? "",
    name: user.name ?? "Member",
    role: user.role ?? "user",
    subscriptions: [],
    entitlements: [],
    features: [],
    paymentStatus: "none",
    paymentNote: "",
    updatedAt: new Date().toISOString(),
  };
}

export function setFallbackAccess(email, patch) {
  const key = email?.toLowerCase();
  if (!fallbackAccessByEmail[key]) return null;
  fallbackAccessByEmail[key] = {
    ...fallbackAccessByEmail[key],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  return { ...fallbackAccessByEmail[key] };
}
