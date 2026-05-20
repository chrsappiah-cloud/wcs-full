/** StoreKit / WCS Commerce products — shared with iosCommerce.js */
export const subscriptionProducts = [
  {
    productId: "wcs_premium_monthly",
    name: "WCS Premium Monthly",
    type: "subscription",
    entitlement: "premium_membership",
    priceLabel: "$9.99 / month",
    features: ["Full library", "All courses", "Priority support"],
  },
  {
    productId: "wcs_ai_tutor_pack_10",
    name: "AI Tutor Pack (10)",
    type: "consumable",
    entitlement: "ai_tutor_credits",
    priceLabel: "$4.99 one-time",
    features: ["10 AI tutor sessions"],
  },
  {
    productId: "wcs_exam_pack_unlock",
    name: "Exam Pack Unlock",
    type: "unlock",
    entitlement: "specialist_tool_unlock",
    priceLabel: "$19.99 one-time",
    features: ["Specialist tools unlocked"],
  },
];

export const featureFlags = [
  { id: "library_premium", label: "Premium library search" },
  { id: "courses_all", label: "All courses" },
  { id: "ios_commerce", label: "iOS commerce sync" },
  { id: "podcast_referrals", label: "Podcast referral analytics" },
];

export function defaultEntitlementsForProduct(productId) {
  const product = subscriptionProducts.find((p) => p.productId === productId);
  if (!product) return [];
  return [
    {
      code: product.entitlement,
      status: "active",
      detail: product.name,
      expiresAt: null,
    },
  ];
}
