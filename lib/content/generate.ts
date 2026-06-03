import { eq } from "drizzle-orm";
import { posts, linkedinPosts } from "@/db/schema";
import { requireDb } from "@/lib/db/drizzle";
import { generateContentDraft } from "./anthropic";
import { slugify, withSlugSuffix } from "./slug";
import { sendContentDraftCreatedEmail } from "@/lib/notify/email";

export type GenerationResult = {
  postId: string;
  title: string;
  slug: string;
  linkedinCount: number;
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
  const [post] = await db
    .insert(posts)
    .values({
      title: generated.blog.title,
      slug,
      summary: generated.blog.summary,
      excerpt: generated.blog.summary,
      content: generated.blog.markdown,
      status: "draft",
      tags: [],
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const reviewUrl = `${appUrl}/admin/content-engine?post=${post.id}`;

  try {
    await sendContentDraftCreatedEmail({
      title: post.title,
      reviewUrl,
    });
  } catch (err) {
    console.error("[notify] Failed to send draft notification:", err);
  }

  return {
    postId: post.id,
    title: post.title,
    slug: post.slug,
    linkedinCount: linkedinRows.length,
  };
}
