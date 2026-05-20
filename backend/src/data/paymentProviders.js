export const paymentProviders = [
  {
    id: "apple_iap",
    name: "Apple In-App Purchase",
    type: "mobile",
    statusField: "apple_server_api",
    description: "StoreKit subscriptions and consumables via App Store / Apple Pay on iOS.",
    adminActions: ["activate_integration", "reconcile", "grant_entitlement"],
  },
  {
    id: "apple_pay",
    name: "Apple Pay",
    type: "wallet",
    statusField: "apple_server_api",
    description: "Wallet payments on iOS tied to the same Apple commerce pipeline.",
    adminActions: ["activate_integration"],
  },
  {
    id: "bank_transfer",
    name: "Bank transfer / invoice",
    type: "manual",
    statusField: null,
    description: "Manual payment status — mark paid in Access & payments after funds clear.",
    adminActions: ["set_payment_status", "add_note"],
  },
  {
    id: "card_stripe",
    name: "Card payments (Stripe)",
    type: "card",
    statusField: "stripe",
    description: "Placeholder for future Stripe Checkout — configure STRIPE_SECRET_KEY when ready.",
    adminActions: [],
    configured: !!(process.env.STRIPE_SECRET_KEY || "").trim(),
  },
];

export const paymentStatuses = ["none", "pending", "paid", "failed", "refunded"];
