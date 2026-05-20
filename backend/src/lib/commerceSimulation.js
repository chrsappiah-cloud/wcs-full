import { storeProducts } from "./iosCommerce.js";

/** Local simulation when WCS_COMMERCE_BASE_URL is unset or unreachable */
export const simulationCatalog = {
  products: storeProducts.map((p) => ({
    productId: p.productId,
    entitlementCode: p.entitlement,
    type: p.type.toLowerCase().replace(/ /g, "_").replace("auto-renewable", "auto_renewable"),
    description: p.name,
  })),
};

export const simulationHealth = {
  health: {
    backend: "Active",
    middleware: "Active",
    apple_server_api: "Inactive",
    cloudflare: "Inactive",
    cloudkit: "Inactive",
    icloud: "Inactive",
    database: "Active",
    schema_version: "2026.05-commerce-platform",
  },
};
