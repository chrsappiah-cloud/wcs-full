import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as userDao from "../dao/userDao.js";

function sign(user) {
  return jwt.sign(
    { sub: user._id, email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" }
  );
}

export async function register(req, res, next) {
  try {
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

    const user = await userDao.findByEmail(email);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = sign(user);
    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
}

export async function me(req, res) {
  res.json({ name: req.user.name, email: req.user.email, role: req.user.role });
}
