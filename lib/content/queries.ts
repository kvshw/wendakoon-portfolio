import { desc, eq } from "drizzle-orm";
import { posts, linkedinPosts } from "@/db/schema";
import { requireDb } from "@/lib/db/drizzle";

export async function getDraftPosts() {
  const db = requireDb();
  return db
    .select()
    .from(posts)
    .where(eq(posts.status, "draft"))
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
