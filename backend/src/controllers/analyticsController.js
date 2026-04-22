import { getDb } from "../config/db.js";

const col = () => getDb().collection("analytics");

export async function track(req, res, next) {
  try {
    const { event, path, meta } = req.body ?? {};
    if (!event) return res.status(400).json({ error: "event is required" });
    await col().insertOne({ event, path, meta: meta ?? {}, ts: new Date() });
    res.status(201).json({ ok: true });
  } catch (err) { next(err); }
}

export async function getStats(req, res, next) {
  try {
    const db = getDb();

    const [totalEvents, topPages, searchQueries, recentEvents] = await Promise.all([
      col().countDocuments(),

      col().aggregate([
        { $match: { event: "page_view" } },
        { $group: { _id: "$path", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]).toArray(),

      col().aggregate([
        { $match: { event: "search" } },
        { $group: { _id: "$meta.q", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]).toArray(),

      col().find({}).sort({ ts: -1 }).limit(20).toArray(),
    ]);

    const counts = await Promise.all([
      db.collection("users").countDocuments(),
      db.collection("courses").countDocuments(),
      db.collection("resources").countDocuments(),
      db.collection("enrollments").countDocuments(),
    ]);

    res.json({
      totalEvents,
      topPages,
      searchQueries,
      recentEvents,
      counts: {
        users: counts[0],
        courses: counts[1],
        resources: counts[2],
        enrollments: counts[3],
      },
    });
  } catch (err) { next(err); }
}
