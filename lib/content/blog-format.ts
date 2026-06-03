import type { Post } from "@/db/schema";
import { getPostExcerpt } from "@/lib/db/queries/posts";
import { slugify } from "@/lib/content/slug";

/** Matches homepage cards: `4/14/2026` */
export function formatBlogDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

export type BlogTeaser = {
  date: string;
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string | null;
  tags?: string[] | null;
};

export type BlogHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

/** Rough reading time at ~220 wpm. */
export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 220));
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function extractHeadings(content: string): BlogHeading[] {
  const headings: BlogHeading[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/\s+#+\s*$/, "").trim();
    if (!text) continue;

    headings.push({
      id: slugifyHeading(text),
      text,
      level,
    });
  }

  return headings;
}

export function postToTeaser(post: Post): BlogTeaser {
  const date = post.publishedAt ?? post.createdAt;
  return {
    date: formatBlogDate(date),
    title: post.title,
    excerpt: getPostExcerpt(post),
    slug: post.slug,
    coverImage: post.coverImage,
    tags: post.tags,
  };
}
