import { getAllSiteContentRows } from "@/lib/db/queries/siteContent";
import { db } from "@/lib/db/drizzle";
import { withDbTimeout } from "@/lib/db/timeout";

export type SiteContentBundle = Record<string, Record<string, unknown>>;

function rowsToBundle(
  rows: { section: string; key: string; value: unknown }[]
): SiteContentBundle {
  const bundle: SiteContentBundle = {};
  for (const row of rows) {
    if (!bundle[row.section]) bundle[row.section] = {};
    bundle[row.section][row.key] = row.value;
  }
  return bundle;
}

export async function loadSiteContentBundle(): Promise<SiteContentBundle> {
  if (!db) return {};
  try {
    const rows = await withDbTimeout(getAllSiteContentRows());
    return rowsToBundle(rows);
  } catch (err) {
    console.warn("[site] CMS bundle unavailable, using defaults:", err);
    return {};
  }
}

export function pickFromBundle<T>(
  bundle: SiteContentBundle,
  section: string,
  key: string,
  fallback: T
): T {
  const value = bundle[section]?.[key];
  return (value !== undefined ? value : fallback) as T;
}
