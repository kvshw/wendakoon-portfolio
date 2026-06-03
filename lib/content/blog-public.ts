import { getPublishedPosts } from "@/lib/db/queries/posts";
import { withDbTimeout } from "@/lib/db/timeout";
import { POSTS } from "@/lib/data";
import {
  type BlogTeaser,
  postToTeaser,
} from "@/lib/content/blog-format";

export type { BlogTeaser } from "@/lib/content/blog-format";
export { formatBlogDate, postToTeaser } from "@/lib/content/blog-format";

function staticFallbackTeasers(): BlogTeaser[] {
  return POSTS.map((p) => ({
    date: p.date,
    title: p.title,
    excerpt: p.excerpt,
    slug: "",
    coverImage: null,
    tags: [],
  }));
}

/** Latest N approved posts for the homepage section. */
export async function getBlogTeasers(limit = 3): Promise<BlogTeaser[]> {
  try {
    const posts = await withDbTimeout(getPublishedPosts(limit));
    if (posts.length === 0) return staticFallbackTeasers().slice(0, limit);
    return posts.map(postToTeaser);
  } catch {
    return staticFallbackTeasers().slice(0, limit);
  }
}

/** All approved posts for `/blog`. */
export async function getAllBlogTeasers(): Promise<BlogTeaser[]> {
  try {
    const posts = await withDbTimeout(getPublishedPosts());
    if (posts.length === 0) return staticFallbackTeasers();
    return posts.map(postToTeaser);
  } catch {
    return staticFallbackTeasers();
  }
}
