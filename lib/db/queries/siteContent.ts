import { and, eq } from "drizzle-orm";
import { siteContent } from "@/db/schema";
import { db, requireDb } from "@/lib/db/drizzle";

export async function getSectionRow(section: string, key: string) {
  if (!db) return null;
  const database = requireDb();
  const [row] = await database
    .select()
    .from(siteContent)
    .where(and(eq(siteContent.section, section), eq(siteContent.key, key)))
    .limit(1);
  return row ?? null;
}

export async function getSectionBundle(section: string) {
  if (!db) return [];
  const database = requireDb();
  return database
    .select()
    .from(siteContent)
    .where(eq(siteContent.section, section));
}

/** Single round-trip for homepage CMS content */
export async function getAllSiteContentRows() {
  if (!db) return [];
  const database = requireDb();
  return database.select().from(siteContent);
}

export async function upsertSectionKey(
  section: string,
  key: string,
  value: unknown
) {
  const database = requireDb();
  const existing = await getSectionRow(section, key);

  if (existing) {
    await database
      .update(siteContent)
      .set({ value, updatedAt: new Date() })
      .where(eq(siteContent.id, existing.id));
    return;
  }

  await database.insert(siteContent).values({ section, key, value });
}
