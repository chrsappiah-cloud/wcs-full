import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userDao from "../dao/userDao.js";
import { verifyFallbackAdmin } from "../data/authFallback.js";

function jwtSecret() {
  const secret = (process.env.JWT_SECRET || "").trim();
  if (secret) return secret;
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    const err = new Error("JWT_SECRET is not configured");
    err.status = 503;
    throw err;
  }
  return "wcs-dev-secret-change-in-production";
}

function sign(user) {
  return jwt.sign(
    { sub: user._id, email: user.email, role: user.role, name: user.name },
    jwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" }
  );
}

export async function register(req, res, next) {
  try {
    if (req.fallbackMode) {
      return res.status(503).json({
        error: "Registration requires a database. Sign in with the admin account or configure MONGODB_URI.",
      });
    }
    const { name, email, password } = req.body ?? {};
    if (!name || !email || !password)
      return res.status(400).json({ error: "name, email and password are required" });

    const existing = await userDao.findByEmail(email);
    if (existing) return res.status(409).json({ error: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await userDao.createUser({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "user",
      createdAt: new Date(),
    });

    const token = sign(user);
    res.status(201).json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password)
      return res.status(400).json({ error: "email and password are required" });

    if (req.fallbackMode) {
      const user = await verifyFallbackAdmin(email, password);
      if (!user) return res.status(401).json({ error: "Invalid credentials" });
      const token = sign(user);
      return res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
    }

    const user = await userDao.findByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = sign(user);
    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    if (err.status === 503) return res.status(503).json({ error: err.message });
    next(err);
  }
}

export async function me(req, res) {
  res.json({
    id: req.user.sub,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
}
