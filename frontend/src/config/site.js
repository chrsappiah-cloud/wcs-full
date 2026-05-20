/** Canonical public hostname for World Class Scholars (Vercel). */
export const SITE_HOST = "worldclassscholars.vercel.app";

/** Previous deployment hostname — redirects to SITE_HOST in vercel.json. */
export const LEGACY_SITE_HOST = "wcs-full.vercel.app";

export const DEFAULT_SITE_URL = `https://${SITE_HOST}`;
export const LEGACY_SITE_URL = `https://${LEGACY_SITE_HOST}`;

export function resolveSiteUrl(envUrl) {
  const raw = envUrl || DEFAULT_SITE_URL;
  return raw.replace(/\/$/, "");
}
