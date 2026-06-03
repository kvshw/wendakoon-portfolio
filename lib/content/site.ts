import {
  getSectionRow,
  upsertSectionKey,
  getSectionBundle,
} from "@/lib/db/queries/siteContent";
import { db } from "@/lib/db/drizzle";

export async function getSectionContent<T>(
  section: string,
  key: string,
  fallback: T
): Promise<T> {
  if (!db) return fallback;
  try {
    const row = await getSectionRow(section, key);
    if (!row) return fallback;
    return row.value as T;
  } catch {
    return fallback;
  }
}

export async function setSectionContent(
  section: string,
  key: string,
  value: unknown
) {
  await upsertSectionKey(section, key, value);
}

export async function getSectionContentBundle(section: string) {
  if (!db) return {};
  try {
    const rows = await getSectionBundle(section);
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  } catch {
    return {};
  }
}
