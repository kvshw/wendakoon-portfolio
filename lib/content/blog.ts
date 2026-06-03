"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { posts } from "@/db/schema";
import { requireDb } from "@/lib/db/drizzle";
import { requireAdmin } from "@/lib/auth";
import { slugify, withSlugSuffix } from "@/lib/content/slug";
import { isSlugTaken } from "@/lib/db/queries/posts";
import { validateSlug } from "@/lib/content/blog-utils";

async function uniqueSlug(base: string, excludeId?: string) {
  let slug = slugify(base);
  if (!slug) slug = "post";
  let suffix = 1;
  while (await isSlugTaken(slug, excludeId)) {
    slug = withSlugSuffix(slugify(base) || "post", suffix++);
  }
  return slug;
}

function revalidateBlogPaths(slug?: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/blog");
  revalidatePath("/");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}

export type PostInput = {
  title: string;
  slug?: string;
  excerpt?: string;
  summary?: string;
  content: string;
  coverImage?: string | null;
  tags?: string[];
  status?: "draft" | "approved" | "rejected";
};

export async function createPost(data: PostInput) {
  await requireAdmin();
  const db = requireDb();

  const slug = data.slug
    ? data.slug.toLowerCase().trim()
    : await uniqueSlug(data.title);

  if (!validateSlug(slug)) {
    throw new Error("Slug must be lowercase letters, numbers, and hyphens only.");
  }
  if (await isSlugTaken(slug)) {
    throw new Error("Slug is already in use.");
  }

  const excerpt = data.excerpt ?? data.summary ?? "";
  const summary = data.summary ?? excerpt;
  const status = data.status ?? "draft";
  const now = new Date();

  const [post] = await db
    .insert(posts)
    .values({
      title: data.title,
      slug,
      summary,
      excerpt,
      content: data.content,
      coverImage: data.coverImage ?? null,
      tags: data.tags ?? [],
      status,
      publishedAt: status === "approved" ? now : null,
      updatedAt: now,
    })
    .returning();

  if (!post) {
    throw new Error(
      "Post was not saved. Apply Supabase migrations (excerpt, updated_at columns) and check database permissions."
    );
  }

  revalidateBlogPaths(slug);
  return post;
}

export async function updatePost(id: string, data: PostInput) {
  await requireAdmin();
  const db = requireDb();

  const slug = data.slug
    ? data.slug.toLowerCase().trim()
    : await uniqueSlug(data.title, id);

  if (!validateSlug(slug)) {
    throw new Error("Slug must be lowercase letters, numbers, and hyphens only.");
  }
  if (await isSlugTaken(slug, id)) {
    throw new Error("Slug is already in use.");
  }

  const excerpt = data.excerpt ?? data.summary ?? "";
  const summary = data.summary ?? excerpt;
  const status = data.status ?? "draft";
  const now = new Date();

  const [existing] = await db
    .select({ publishedAt: posts.publishedAt })
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);

  const [post] = await db
    .update(posts)
    .set({
      title: data.title,
      slug,
      summary,
      excerpt,
      content: data.content,
      coverImage: data.coverImage ?? null,
      tags: data.tags ?? [],
      status,
      publishedAt:
        status === "approved"
          ? existing?.publishedAt ?? now
          : null,
      updatedAt: now,
    })
    .where(eq(posts.id, id))
    .returning();

  revalidateBlogPaths(slug);
  return post;
}

export async function publishPost(id: string) {
  await requireAdmin();
  const db = requireDb();
  const now = new Date();

  const [post] = await db
    .update(posts)
    .set({ status: "approved", publishedAt: now, updatedAt: now })
    .where(eq(posts.id, id))
    .returning();

  revalidateBlogPaths(post?.slug);
  return post;
}

export async function deletePost(id: string) {
  await requireAdmin();
  const db = requireDb();
  await db.delete(posts).where(eq(posts.id, id));
  revalidateBlogPaths();
}
