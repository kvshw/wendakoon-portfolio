"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { posts, linkedinPosts } from "@/db/schema";
import { requireDb } from "@/lib/db/drizzle";
import { requireAdmin } from "@/lib/auth";

export async function updatePostDraft(
  postId: string,
  data: { title: string; summary: string; content: string }
) {
  await requireAdmin();
  const db = requireDb();

  await db
    .update(posts)
    .set({
      title: data.title,
      summary: data.summary,
      content: data.content,
    })
    .where(eq(posts.id, postId));

  revalidatePath("/admin/content-engine");
  revalidatePath("/admin");
  revalidatePath("/admin/blog");
  revalidatePath("/");
}

export async function updateLinkedinDraft(
  linkedinId: string,
  content: string
) {
  await requireAdmin();
  const db = requireDb();

  await db
    .update(linkedinPosts)
    .set({ content })
    .where(eq(linkedinPosts.id, linkedinId));

  revalidatePath("/admin/content-engine");
  revalidatePath("/admin");
  revalidatePath("/admin/blog");
  revalidatePath("/");
}

export async function approvePost(postId: string) {
  await requireAdmin();
  const db = requireDb();

  await db
    .update(posts)
    .set({
      status: "approved",
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(posts.id, postId));

  await db
    .update(linkedinPosts)
    .set({ status: "ready" })
    .where(eq(linkedinPosts.postId, postId));

  revalidatePath("/admin/content-engine");
  revalidatePath("/admin");
  revalidatePath("/admin/blog");
  revalidatePath("/");
  revalidatePath("/blog");
}

export async function rejectPost(postId: string) {
  await requireAdmin();
  const db = requireDb();

  await db
    .update(posts)
    .set({ status: "rejected" })
    .where(eq(posts.id, postId));

  revalidatePath("/admin/content-engine");
  revalidatePath("/admin");
  revalidatePath("/admin/blog");
}
