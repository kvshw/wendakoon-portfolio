import { desc, eq, sql } from "drizzle-orm";
import { contactMessages } from "@/db/schema";
import { db, requireDb } from "@/lib/db/drizzle";

export async function getAllMessages() {
  const database = requireDb();
  return database
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));
}

export async function getMessageCounts() {
  if (!db) return { total: 0, new: 0, read: 0, archived: 0 };
  const database = requireDb();
  const rows = await database
    .select({
      status: contactMessages.status,
      count: sql<number>`count(*)::int`,
    })
    .from(contactMessages)
    .groupBy(contactMessages.status);

  const counts = { new: 0, read: 0, archived: 0 };
  for (const row of rows) {
    counts[row.status] = row.count;
  }
  return {
    total: counts.new + counts.read + counts.archived,
    ...counts,
  };
}

export async function getUnreadMessageCount() {
  if (!db) return 0;
  const database = requireDb();
  const [row] = await database
    .select({ count: sql<number>`count(*)::int` })
    .from(contactMessages)
    .where(eq(contactMessages.status, "new"));
  return row?.count ?? 0;
}
