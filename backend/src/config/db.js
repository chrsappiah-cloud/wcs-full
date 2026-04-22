import { MongoClient } from "mongodb";

let client;
let db;

export async function connectDb(uri, dbName) {
  if (db) return db;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error("Database not initialized. Call connectDb first.");
  }
  return db;
}

export async function closeDb() {
  if (client) {
    await client.close();
    client = undefined;
    db = undefined;
  }
}
