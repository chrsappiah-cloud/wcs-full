import { emailConfigStatus } from "./mailer.js";

export function getSystemStatus(req) {
  const jwtConfigured = !!(process.env.JWT_SECRET || "").trim();
  const mongoConfigured = !!(process.env.MONGODB_URI || "").trim();
  const commerceConfigured = !!(process.env.WCS_COMMERCE_BASE_URL || "").trim();

  return {
    jwt: {
      configured: jwtConfigured,
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
    database: {
      configured: mongoConfigured,
      mode: req?.fallbackMode ? "fallback" : mongoConfigured ? "mongodb" : "fallback",
    },
    email: emailConfigStatus(),
    commerce: {
      configured: commerceConfigured,
      baseUrl: commerceConfigured ? process.env.WCS_COMMERCE_BASE_URL : null,
    },
    environment: process.env.VERCEL ? "vercel" : process.env.NODE_ENV || "development",
  };
}
