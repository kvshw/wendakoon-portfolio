import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn(
    "[db] DATABASE_URL is not set. Database operations will fail at runtime."
  );
}

const client = connectionString
  ? postgres(connectionString, {
      prepare: false,
      /** Avoid 30s+ hangs when Supabase is down or URL is wrong */
      connect_timeout: 5,
      idle_timeout: 20,
      max: 10,
    })
  : null;

export const db = client ? drizzle(client, { schema }) : null;

export function requireDb() {
  if (!db) {
    throw new Error("Database is not configured. Set DATABASE_URL.");
  }
  return db;
}
