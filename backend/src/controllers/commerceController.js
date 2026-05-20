import {
  commerceApiEndpoints,
  iosApps,
  storeProducts,
} from "../lib/iosCommerce.js";

const COMMERCE_BASE = (process.env.WCS_COMMERCE_BASE_URL || "").trim().replace(/\/$/, "");

async function fetchCommerce(path) {
  if (!COMMERCE_BASE) {
    return { configured: false, data: null };
  }
  const response = await fetch(`${COMMERCE_BASE}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Commerce backend ${response.status}`);
  }
  return { configured: true, data: await response.json() };
}

export async function getAppleCommerce(_req, res) {
  try {
    const [catalogResult, healthResult] = await Promise.allSettled([
      fetchCommerce("/v1/catalog"),
      fetchCommerce("/v1/system/health"),
    ]);

    const catalog =
      catalogResult.status === "fulfilled" ? catalogResult.value : { configured: false, data: null };
    const health =
      healthResult.status === "fulfilled" ? healthResult.value : { configured: false, data: null };

    res.json({
      commerceBaseUrl: COMMERCE_BASE || null,
      configured: Boolean(COMMERCE_BASE),
      apps: iosApps,
      storeProducts,
      endpoints: commerceApiEndpoints,
      live: {
        catalog: catalog.data,
        health: health.data,
        catalogError:
          catalogResult.status === "rejected" ? catalogResult.reason?.message : null,
        healthError: healthResult.status === "rejected" ? healthResult.reason?.message : null,
      },
    });
  } catch (error) {
    res.status(502).json({
      error: error.message,
      commerceBaseUrl: COMMERCE_BASE || null,
      configured: Boolean(COMMERCE_BASE),
      apps: iosApps,
      storeProducts,
      endpoints: commerceApiEndpoints,
    });
  }
}

export function getBetaManifest(_req, res) {
  res.json({
    schema: "wcs-ios-beta-manifest/1.0",
    generatedAt: new Date().toISOString(),
    apps: iosApps,
    storeProducts,
    endpoints: commerceApiEndpoints,
  });
}
