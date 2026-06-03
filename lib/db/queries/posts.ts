import { and, desc, eq, sql } from "drizzle-orm";
import { posts } from "@/db/schema";
import { db, requireDb } from "@/lib/db/drizzle";

const TEASER_MAX_LENGTH = 220;

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/^>\s+/gm, "")
    .replace(/^[-*+]\s+/gm, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function excerptFromContent(content: string, maxLength = TEASER_MAX_LENGTH): string {
  const plain = stripMarkdown(content);
  if (!plain) return "";
  if (plain.length <= maxLength) return plain;
  const cut = plain.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 80 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

export function getPostExcerpt(post: {
  excerpt: string | null;
  summary: string;
  content?: string;
}) {
  const manual = post.excerpt?.trim() || post.summary?.trim();
  if (manual) return manual;
  if (post.content?.trim()) return excerptFromContent(post.content);
  return "";
}

export async function getPostCounts() {
  if (!db) return { total: 0, drafts: 0, published: 0, rejected: 0 };
  const database = requireDb();
  const rows = await database
    .select({
      status: posts.status,
      count: sql<number>`count(*)::int`,
    })
    .from(posts)
    .groupBy(posts.status);

  const counts = { draft: 0, approved: 0, rejected: 0 };
  for (const row of rows) {
    counts[row.status] = row.count;
  }
  return {
    total: counts.draft + counts.approved + counts.rejected,
    drafts: counts.draft,
    published: counts.approved,
    rejected: counts.rejected,
  };
}

export async function getRecentPosts(limit = 5) {
  if (!db) return [];
  const database = requireDb();
  return database
    .select()
    .from(posts)
    .orderBy(desc(posts.updatedAt), desc(posts.createdAt))
    .limit(limit);
}

export async function getAllPosts() {
  const database = requireDb();
  return database
    .select()
    .from(posts)
    .orderBy(desc(posts.updatedAt), desc(posts.createdAt));
}

export async function getPostById(id: string) {
  if (!db) return null;
  const database = requireDb();
  const [post] = await database
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);
  return post ?? null;
}

export async function getPublishedPosts(limit?: number) {
  if (!db) return [];
  const database = requireDb();
  const query = database
    .select()
    .from(posts)
    .where(eq(posts.status, "approved"))
    .orderBy(desc(posts.publishedAt), desc(posts.createdAt));

  if (limit) return query.limit(limit);
  return query;
}

export async function getPostBySlug(slug: string) {
  if (!db) return null;
  const database = requireDb();
  const [post] = await database
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.status, "approved")))
    .limit(1);
  return post ?? null;
}

export async function isSlugTaken(slug: string, excludeId?: string) {
  if (!db) return false;
  const database = requireDb();
  const rows = await database
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);
  if (!rows[0]) return false;
  if (excludeId && rows[0].id === excludeId) return false;
  return true;
}
