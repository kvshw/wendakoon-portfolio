import type { LinkedinPost, Post } from "@/db/schema";

function toIso(value: Date | string | null | undefined): string | null {
  if (value == null) return null;
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

export type ClientPost = Omit<
  Post,
  "createdAt" | "updatedAt" | "publishedAt"
> & {
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type ClientLinkedinPost = Omit<
  LinkedinPost,
  "createdAt" | "scheduledFor"
> & {
  createdAt: string;
  scheduledFor: string | null;
};

export function serializePost(post: Post): ClientPost {
  return {
    ...post,
    createdAt: toIso(post.createdAt) ?? new Date(0).toISOString(),
    updatedAt: toIso(post.updatedAt) ?? new Date(0).toISOString(),
    publishedAt: toIso(post.publishedAt),
  };
}

export function serializeLinkedinPost(post: LinkedinPost): ClientLinkedinPost {
  return {
    ...post,
    createdAt: toIso(post.createdAt) ?? new Date(0).toISOString(),
    scheduledFor: toIso(post.scheduledFor),
  };
}
