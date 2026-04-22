import { getDb } from "../config/db.js";
import { ObjectId } from "mongodb";

const col = () => getDb().collection("enrollments");
const courses = () => getDb().collection("courses");

export async function enroll(req, res, next) {
  try {
    const { courseSlug } = req.body ?? {};
    if (!courseSlug) return res.status(400).json({ error: "courseSlug required" });

    const course = await courses().findOne({ slug: courseSlug });
    if (!course) return res.status(404).json({ error: "Course not found" });

    const userId = req.user.sub;
    const existing = await col().findOne({ userId, courseSlug });
    if (existing) return res.status(409).json({ error: "Already enrolled", enrollment: existing });

    const doc = {
      userId,
      userEmail: req.user.email,
      userName: req.user.name,
      courseSlug,
      courseTitle: course.title,
      progress: 0,
      enrolledAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await col().insertOne(doc);
    res.status(201).json({ ...doc, _id: result.insertedId });
  } catch (err) { next(err); }
}

export async function myEnrollments(req, res, next) {
  try {
    const enrollments = await col()
      .find({ userId: req.user.sub })
      .sort({ enrolledAt: -1 })
      .toArray();
    res.json(enrollments);
  } catch (err) { next(err); }
}

export async function updateProgress(req, res, next) {
  try {
    const { progress } = req.body ?? {};
    if (progress === undefined) return res.status(400).json({ error: "progress required" });

    const _id = new ObjectId(req.params.id);
    const doc = await col().findOneAndUpdate(
      { _id, userId: req.user.sub },
      { $set: { progress: Math.min(100, Math.max(0, Number(progress))), updatedAt: new Date() } },
      { returnDocument: "after" }
    );
    if (!doc) return res.status(404).json({ error: "Enrollment not found" });
    res.json(doc);
  } catch (err) { next(err); }
}
