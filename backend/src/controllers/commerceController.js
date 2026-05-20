import {
  commerceApiEndpoints,
  iosApps,
  storeProducts,
} from "../lib/iosCommerce.js";
import { simulationCatalog, simulationHealth } from "../lib/commerceSimulation.js";

const COMMERCE_BASE = (process.env.WCS_COMMERCE_BASE_URL || "").trim().replace(/\/$/, "");

async function fetchCommerce(path) {
  if (!COMMERCE_BASE) {
    return { configured: false, source: "simulation", data: null };
  }
  const response = await fetch(`${COMMERCE_BASE}${path}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new Error(`Commerce backend ${response.status}`);
  }
  return { configured: true, source: "live", data: await response.json() };
}

function simulationPayload() {
  return {
    commerceBaseUrl: null,
    configured: false,
    mode: "simulation",
    apps: iosApps,
    storeProducts,
    endpoints: commerceApiEndpoints,
    live: {
      catalog: simulationCatalog,
      health: simulationHealth,
      catalogError: null,
      healthError: null,
    },
  };
}

export async function getAppleCommerce(_req, res) {
  if (!COMMERCE_BASE) {
    return res.json(simulationPayload());
  }

  try {
    const [catalogResult, healthResult] = await Promise.allSettled([
      fetchCommerce("/v1/catalog"),
      fetchCommerce("/v1/system/health"),
    ]);

    const catalog =
      catalogResult.status === "fulfilled" && catalogResult.value.data
        ? catalogResult.value
        : { configured: true, source: "simulation", data: simulationCatalog };
    const health =
      healthResult.status === "fulfilled" && healthResult.value.data
        ? healthResult.value
        : { configured: true, source: "simulation", data: simulationHealth };

    res.json({
      commerceBaseUrl: COMMERCE_BASE,
      configured: true,
      mode: "live",
      apps: iosApps,
      storeProducts,
      endpoints: commerceApiEndpoints,
      live: {
        catalog: catalog.data ?? simulationCatalog,
        health: health.data ?? simulationHealth,
        catalogError:
          catalogResult.status === "rejected" ? catalogResult.reason?.message : null,
        healthError:
          healthResult.status === "rejected" ? healthResult.reason?.message : null,
      },
    });
  } catch (error) {
    res.status(200).json({
      ...simulationPayload(),
      mode: "simulation-fallback",
      fallbackReason: error.message,
      commerceBaseUrl: COMMERCE_BASE,
    });
  }
}

export function getBetaManifest(_req, res) {
  res.json({
    schema: "wcs-ios-beta-manifest/1.0",
    generatedAt: new Date().toISOString(),
    commerceBaseUrl: COMMERCE_BASE || null,
    apps: iosApps,
    storeProducts,
    endpoints: commerceApiEndpoints,
  });
}
