import { ObjectId } from "mongodb";
import { getDb } from "../config/db.js";
import { inboxForType } from "../data/contactEmails.js";

const col = () => getDb().collection("contactMessages");

export async function insertMessage(doc) {
  const payload = {
    ...doc,
    email: doc.email.toLowerCase(),
    routedTo: inboxForType(doc.type),
    status: "new",
    createdAt: new Date(),
  };
  const result = await col().insertOne(payload);
  return { ...payload, _id: result.insertedId };
}

export async function listMessages({ status, limit = 100 } = {}) {
  const filter = status ? { status } : {};
  return col().find(filter).sort({ createdAt: -1 }).limit(limit).toArray();
}

export async function updateStatus(id, status) {
  if (!ObjectId.isValid(id)) return null;
  const result = await col().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { status, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
  return result;
}

export async function countByStatus() {
  const rows = await col()
    .aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
    .toArray();
  return Object.fromEntries(rows.map((r) => [r._id, r.count]));
}
