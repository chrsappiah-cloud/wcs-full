import bcrypt from "bcryptjs";

/** Demo admin when MongoDB is unavailable (matches seed credentials). */
export const fallbackAdmin = {
  _id: "fallback-admin",
  name: "Dr Christopher Appiah-Thompson",
  email: "admin@myworldclass.org",
  role: "admin",
  password: "admin123",
};

let passwordHashPromise = null;

export async function verifyFallbackAdmin(email, password) {
  if (email?.toLowerCase() !== fallbackAdmin.email) return null;
  if (!passwordHashPromise) {
    passwordHashPromise = bcrypt.hash(fallbackAdmin.password, 12);
  }
  const hash = await passwordHashPromise;
  const ok = await bcrypt.compare(password, hash);
  return ok ? fallbackAdmin : null;
}
