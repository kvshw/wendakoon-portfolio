import { desc, eq, inArray } from "drizzle-orm";
import { posts, linkedinPosts } from "@/db/schema";
import { requireDb } from "@/lib/db/drizzle";
import type { Post } from "@/db/schema";

export type ContentEngineStatus = "draft" | "approved" | "rejected" | "all";

export async function getDraftPosts() {
  const db = requireDb();
  return db
    .select()
    .from(posts)
    .where(eq(posts.status, "draft"))
    .orderBy(desc(posts.createdAt));
}

export async function getContentEnginePosts(
  status: ContentEngineStatus = "draft"
): Promise<Post[]> {
  const db = requireDb();

  if (status === "all") {
    return db.select().from(posts).orderBy(desc(posts.createdAt));
  }

  return db
    .select()
    .from(posts)
    .where(eq(posts.status, status))
    .orderBy(desc(posts.createdAt));
}

export async function getPostWithLinkedin(postId: string) {
  const db = requireDb();

  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, postId))
    .limit(1);

  if (!post) return null;

  const linkedin = await db
    .select()
    .from(linkedinPosts)
    .where(eq(linkedinPosts.postId, postId))
    .orderBy(desc(linkedinPosts.createdAt));

  return { post, linkedin };
}

export async function getLinkedinByStatus(
  statuses: Array<"draft" | "ready" | "posted">
) {
  const db = requireDb();
  return db
    .select()
    .from(linkedinPosts)
    .where(inArray(linkedinPosts.status, statuses))
    .orderBy(desc(linkedinPosts.createdAt));
}
