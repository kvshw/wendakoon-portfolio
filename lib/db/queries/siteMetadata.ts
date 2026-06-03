import { eq } from "drizzle-orm";
import { siteMetadata } from "@/db/schema";
import { db, requireDb } from "@/lib/db/drizzle";

export async function getMetadata<T = unknown>(key: string): Promise<T | null> {
  if (!db) return null;
  const database = requireDb();
  const [row] = await database
    .select()
    .from(siteMetadata)
    .where(eq(siteMetadata.key, key))
    .limit(1);
  return (row?.value as T) ?? null;
}

export async function setMetadata(key: string, value: unknown) {
  const database = requireDb();
  const existing = await getMetadata(key);

  if (existing !== null) {
    await database
      .update(siteMetadata)
      .set({ value, updatedAt: new Date() })
      .where(eq(siteMetadata.key, key));
    return;
  }

  await database.insert(siteMetadata).values({ key, value });
}

export async function getAllMetadata() {
  if (!db) return [];
  const database = requireDb();
  return database.select().from(siteMetadata);
}
