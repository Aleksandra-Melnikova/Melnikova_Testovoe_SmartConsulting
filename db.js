import { MongoClient } from "mongodb";
import process from "node:process";

const MONGODB_URI = "mongodb://localhost:27017";
const DB_NAME = "testovoeMelnikova";

let client;
let db;

export async function connectDB() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log("Connected to MongoDB");
  }
  return db;
}

export function getUsersCollection() {
  if (!db) throw new Error("Database not initialized");
  return db.collection("users");
}

process.on("SIGINT", async () => {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
  process.exit(0);
});
