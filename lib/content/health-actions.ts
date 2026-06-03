"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { getMetadata, setMetadata } from "@/lib/db/queries/siteMetadata";

export async function markHealthReviewed(checkId: string) {
  await requireAdmin();
  const key = `health_${checkId}_reviewed_at`;
  const at = new Date().toISOString();
  await setMetadata(key, at);
  revalidatePath("/admin");
  return new Date(at).toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function getHealthReviewedAt(checkId: string) {
  const val = await getMetadata<string>(`health_${checkId}_reviewed_at`);
  if (!val) return null;
  return new Date(val).toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
