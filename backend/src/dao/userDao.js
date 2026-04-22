import { getDb } from "../config/db.js";

const col = () => getDb().collection("users");

export async function findByEmail(email) {
  return col().findOne({ email: email.toLowerCase() });
}

export async function createUser(doc) {
  const result = await col().insertOne(doc);
  return { ...doc, _id: result.insertedId };
}

export async function listUsers() {
  return col().find({}, { projection: { passwordHash: 0 } }).sort({ createdAt: -1 }).toArray();
}
