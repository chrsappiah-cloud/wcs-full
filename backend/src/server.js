import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import routes from "./api/routes.js";
import adminRoutes from "./api/adminRoutes.js";

const PORT = Number(process.env.PORT) || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_NS = process.env.MONGODB_NS || "wcs";

if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI. Copy .env.example to .env and configure.");
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/v1", routes);
app.use("/api/admin", adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

await connectDb(MONGODB_URI, MONGODB_NS);

app.listen(PORT, () => {
  console.log(`WCS API listening on http://localhost:${PORT}`);
});
