/** Approximate country centroids for map markers (ISO 3166-1 alpha-2). */
export const countryCentroids = {
  US: { lat: 39.8283, lng: -98.5795, name: "United States" },
  GB: { lat: 55.3781, lng: -3.436, name: "United Kingdom" },
  CA: { lat: 56.1304, lng: -106.3468, name: "Canada" },
  AU: { lat: -25.2744, lng: 133.7751, name: "Australia" },
  DE: { lat: 51.1657, lng: 10.4515, name: "Germany" },
  FR: { lat: 46.2276, lng: 2.2137, name: "France" },
  NG: { lat: 9.082, lng: 8.6753, name: "Nigeria" },
  GH: { lat: 7.9465, lng: -1.0232, name: "Ghana" },
  IN: { lat: 20.5937, lng: 78.9629, name: "India" },
  BR: { lat: -14.235, lng: -51.9253, name: "Brazil" },
  JP: { lat: 36.2048, lng: 138.2529, name: "Japan" },
  CN: { lat: 35.8617, lng: 104.1954, name: "China" },
  ZA: { lat: -30.5595, lng: 22.9375, name: "South Africa" },
  KE: { lat: -0.0236, lng: 37.9062, name: "Kenya" },
  IE: { lat: 53.4129, lng: -8.2439, name: "Ireland" },
  NL: { lat: 52.1326, lng: 5.2913, name: "Netherlands" },
  ES: { lat: 40.4637, lng: -3.7492, name: "Spain" },
  IT: { lat: 41.8719, lng: 12.5674, name: "Italy" },
  SE: { lat: 60.1282, lng: 18.6435, name: "Sweden" },
  AE: { lat: 23.4241, lng: 53.8478, name: "UAE" },
  SG: { lat: 1.3521, lng: 103.8198, name: "Singapore" },
  MX: { lat: 23.6345, lng: -102.5528, name: "Mexico" },
  PL: { lat: 51.9194, lng: 19.1451, name: "Poland" },
  PT: { lat: 39.3999, lng: -8.2245, name: "Portugal" },
  NZ: { lat: -40.9006, lng: 174.886, name: "New Zealand" },
};

export function extractGeoFromRequest(req) {
  const country =
    req.headers["x-vercel-ip-country"] ||
    req.headers["cf-ipcountry"] ||
    req.body?.meta?.country ||
    null;
  const city =
    req.headers["x-vercel-ip-city"] ||
    req.body?.meta?.city ||
    null;
  const region =
    req.headers["x-vercel-ip-country-region"] ||
    req.body?.meta?.region ||
    null;
  return {
    country: country ? String(country).toUpperCase() : null,
    city: city ? String(city) : null,
    region: region ? String(region) : null,
  };
}

export function enrichGeoForAggregate(countryCode) {
  if (!countryCode) return null;
  const code = countryCode.toUpperCase();
  const c = countryCentroids[code];
  return {
    country: code,
    name: c?.name ?? code,
    lat: c?.lat ?? null,
    lng: c?.lng ?? null,
  };
}
