import { eq } from "drizzle-orm";
import { posts, linkedinPosts } from "@/db/schema";
import { requireDb } from "@/lib/db/drizzle";
import { generateContentDraft } from "./anthropic";
import { slugify, withSlugSuffix } from "./slug";
import { sendContentDraftCreatedEmail, getAppBaseUrl } from "@/lib/notify/email";
import { generateAndSaveCover } from "./cover-image";

export type GenerationResult = {
  postId: string;
  title: string;
  slug: string;
  linkedinCount: number;
  coverImage?: string | null;
};

async function resolveUniqueSlug(baseSlug: string): Promise<string> {
  const db = requireDb();
  let candidate = baseSlug;
  let n = 1;

  while (true) {
    const existing = await db
      .select({ id: posts.id })
      .from(posts)
      .where(eq(posts.slug, candidate))
      .limit(1);

    if (existing.length === 0) return candidate;
    n += 1;
    candidate = withSlugSuffix(baseSlug, n);
  }
}

export async function runContentGeneration(): Promise<GenerationResult> {
  const db = requireDb();
  const generated = await generateContentDraft();

  const baseSlug = slugify(generated.blog.slug_hint || generated.blog.title);
  const slug = await resolveUniqueSlug(baseSlug);

  const now = new Date();
  const excerpt = generated.blog.excerpt ?? generated.blog.summary;

  let coverImage: string | null = null;
  try {
    const cover = await generateAndSaveCover({
      title: generated.blog.title,
      slug,
      tags: generated.blog.tags,
      topicAngle: generated.blog.topic_angle,
      imagePrompt: generated.blog.cover_image_prompt,
    });
    coverImage = cover.url;
  } catch (err) {
    console.error("[generate] Cover image failed:", err);
  }

  const [post] = await db
    .insert(posts)
    .values({
      title: generated.blog.title,
      slug,
      summary: generated.blog.summary,
      excerpt,
      content: generated.blog.markdown,
      coverImage,
      status: "draft",
      tags: generated.blog.tags,
      updatedAt: now,
    })
    .returning({ id: posts.id, title: posts.title, slug: posts.slug });

  if (!post) {
    throw new Error("Failed to insert blog post.");
  }

  const linkedinRows = await db
    .insert(linkedinPosts)
    .values(
      generated.linkedin_variations.map((v) => ({
        postId: post.id,
        content: v.content,
        status: "draft" as const,
      }))
    )
    .returning({ id: linkedinPosts.id });

  const appUrl = getAppBaseUrl();
  const reviewUrl = `${appUrl}/admin/content-engine?post=${post.id}`;

  try {
    await sendContentDraftCreatedEmail({
      title: post.title,
      reviewUrl,
      summary: generated.blog.summary,
      excerpt,
      tags: generated.blog.tags,
      coverImage,
      linkedinCount: linkedinRows.length,
    });
  } catch (err) {
    console.error("[notify] Failed to send draft notification:", err);
  }

  return {
    postId: post.id,
    title: post.title,
    slug: post.slug,
    linkedinCount: linkedinRows.length,
    coverImage,
  };
}
