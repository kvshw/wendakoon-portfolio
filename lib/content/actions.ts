"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { posts, linkedinPosts } from "@/db/schema";
import { requireDb } from "@/lib/db/drizzle";
import { requireAdmin } from "@/lib/auth";
import { validateSlug } from "@/lib/content/blog-utils";
import { isSlugTaken } from "@/lib/db/queries/posts";
import { runContentGeneration } from "@/lib/content/generate";
import { generateAndSaveCover } from "@/lib/content/cover-image";

export type GenerateContentResult = {
  postId: string;
  title: string;
  slug: string;
  linkedinCount: number;
  coverImage?: string | null;
};

export async function generateContentNow(): Promise<GenerateContentResult> {
  await requireAdmin();

  try {
    const result = await runContentGeneration();
    revalidatePaths();
    return result;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Content generation failed.";
    throw new Error(message);
  }
}

export type PostDraftUpdate = {
  title: string;
  summary: string;
  excerpt: string;
  content: string;
  slug: string;
  tags: string[];
  coverImage?: string | null;
};

export async function updatePostDraft(postId: string, data: PostDraftUpdate) {
  await requireAdmin();
  const db = requireDb();

  const slug = data.slug.trim().toLowerCase();
  if (!validateSlug(slug)) {
    throw new Error("Slug must be lowercase letters, numbers, and hyphens only.");
  }
  if (await isSlugTaken(slug, postId)) {
    throw new Error("Slug is already in use.");
  }

  await db
    .update(posts)
    .set({
      title: data.title,
      summary: data.summary,
      excerpt: data.excerpt,
      content: data.content,
      slug,
      tags: data.tags,
      ...(data.coverImage !== undefined ? { coverImage: data.coverImage } : {}),
      updatedAt: new Date(),
    })
    .where(eq(posts.id, postId));

  revalidatePaths(slug);
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

  revalidatePaths();
}

export async function updateLinkedinStatus(
  linkedinId: string,
  status: "draft" | "ready" | "posted"
) {
  await requireAdmin();
  const db = requireDb();

  await db
    .update(linkedinPosts)
    .set({ status })
    .where(eq(linkedinPosts.id, linkedinId));

  revalidatePaths();
}

export async function approvePost(postId: string) {
  await requireAdmin();
  const db = requireDb();

  const [post] = await db
    .update(posts)
    .set({
      status: "approved",
      publishedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(posts.id, postId))
    .returning({ slug: posts.slug });

  await db
    .update(linkedinPosts)
    .set({ status: "ready" })
    .where(eq(linkedinPosts.postId, postId));

  revalidatePaths(post?.slug);
}

export async function updatePostCover(
  postId: string,
  coverImage: string | null
): Promise<string | null> {
  await requireAdmin();
  const db = requireDb();

  const [post] = await db
    .update(posts)
    .set({ coverImage, updatedAt: new Date() })
    .where(eq(posts.id, postId))
    .returning({ slug: posts.slug });

  if (!post) {
    throw new Error("Post not found.");
  }

  revalidatePaths(post.slug);
  return coverImage;
}

export async function regeneratePostCover(postId: string): Promise<string> {
  await requireAdmin();
  const db = requireDb();

  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  if (!post) {
    throw new Error("Post not found.");
  }

  const cover = await generateAndSaveCover({
    title: post.title,
    slug: post.slug,
    tags: post.tags ?? [],
    topicAngle: post.summary,
    imagePrompt: post.excerpt ?? post.summary,
  });

  await db
    .update(posts)
    .set({ coverImage: cover.url, updatedAt: new Date() })
    .where(eq(posts.id, postId));

  revalidatePaths(post.slug);
  return cover.url;
}

export async function rejectPost(postId: string) {
  await requireAdmin();
  const db = requireDb();

  await db
    .update(posts)
    .set({ status: "rejected" })
    .where(eq(posts.id, postId));

  revalidatePaths();
}

function revalidatePaths(slug?: string) {
  revalidatePath("/admin/content-engine");
  revalidatePath("/admin");
  revalidatePath("/admin/blog");
  revalidatePath("/");
  revalidatePath("/blog");
  if (slug) revalidatePath(`/blog/${slug}`);
}
