export const storeProducts = [
  {
    productId: "wcs_premium_monthly",
    name: "WCS Premium Monthly",
    type: "Auto-renewable subscription",
    entitlement: "premium_membership",
    appSlug: "wcs-commerce",
  },
  {
    productId: "wcs_ai_tutor_pack_10",
    name: "AI Tutor Pack (10)",
    type: "Consumable",
    entitlement: "ai_tutor_credits",
    appSlug: "wcs-commerce",
  },
  {
    productId: "wcs_exam_pack_unlock",
    name: "Exam Pack Unlock",
    type: "Non-consumable",
    entitlement: "specialist_tool_unlock",
    appSlug: "wcs-commerce",
  },
];

export const iosApps = [
  {
    slug: "wcs-commerce",
    name: "WCS Commerce",
    bundleId: "wcs.wcs-ios",
    testFlightCode: null,
    testFlightUrl: null,
    appStoreSearchUrl: "https://apps.apple.com/search?term=WCS+Commerce",
    products: storeProducts,
  },
  {
    slug: "wcs-agentic",
    name: "WCS Agentic",
    bundleId: "wcs.WCS-Agentic",
    testFlightCode: null,
    testFlightUrl: null,
    appStoreSearchUrl: "https://apps.apple.com/search?term=WCS+Agentic",
    products: [],
  },
  {
    slug: "wcs-goldtest",
    name: "WCS Gold Test",
    bundleId: "wcs.WCS-GoldTest",
    testFlightCode: "WCSGOLDTEST",
    testFlightUrl: "https://testflight.apple.com/join/WCSGOLDTEST",
    appStoreSearchUrl: "https://apps.apple.com/search?term=WCS+Gold",
    products: [],
  },
  {
    slug: "wcs-care",
    name: "WCS Care",
    bundleId: "wcs.care",
    testFlightCode: "WCSCare",
    testFlightUrl: "https://testflight.apple.com/join/WCSCare",
    appStoreSearchUrl: "https://apps.apple.com/search?term=WCS+Care",
    products: [],
  },
];

export const commerceApiEndpoints = [
  { method: "GET", path: "/v1/catalog", purpose: "Pilot product catalog" },
  { method: "POST", path: "/v1/purchases/app-account-token", purpose: "App account token for StoreKit" },
  { method: "POST", path: "/v1/purchases/ingest", purpose: "Ingest signed App Store transaction" },
  { method: "GET", path: "/v1/entitlements/me", purpose: "Current entitlements" },
  { method: "POST", path: "/v1/purchases/reconcile", purpose: "Restore purchases" },
  { method: "POST", path: "/v1/apple/notifications", purpose: "App Store Server Notifications webhook" },
  { method: "GET", path: "/v1/offers/eligibility", purpose: "Promotional offer eligibility" },
  { method: "POST", path: "/v1/offers/signature", purpose: "Signed offer for StoreKit" },
];
