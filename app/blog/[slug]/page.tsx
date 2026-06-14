import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Arrow } from "@/components/primitives/Arrow";
import { BlogArticleContent } from "@/components/blog/BlogArticleContent";
import { getPostBySlug, getPublishedPosts } from "@/lib/db/queries/posts";
import { getPostExcerpt } from "@/lib/db/queries/posts";
import {
  estimateReadingTime,
  extractHeadings,
  formatBlogDate,
} from "@/lib/content/blog-format";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found" };

  return {
    title: `${post.title} · Kavishwa Wendakoon`,
    description: getPostExcerpt(post),
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const date = post.publishedAt ?? post.createdAt;
  const formatted = formatBlogDate(date);
  const readTime = estimateReadingTime(post.content);
  const headings = extractHeadings(post.content);
  const tocItems = headings.filter((h) => h.level === 2);

  return (
    <article className="blog-article">
      <div className="blog-article-wrap">
        <nav className="blog-article-nav" aria-label="Article navigation">
          <Link href="/blog" className="blog-back link">
            ← All posts
          </Link>
        </nav>

        <header className="blog-article-header">
          {post.coverImage && (
            <figure className="blog-article-cover-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt=""
                className="blog-article-cover"
                width={1200}
                height={630}
                decoding="async"
              />
            </figure>
          )}

          <div className="blog-article-meta">
            <time dateTime={date instanceof Date ? date.toISOString() : String(date)}>
              {formatted}
            </time>
            <span className="blog-article-meta-sep" aria-hidden="true">
              ·
            </span>
            <span>{readTime} min read</span>
          </div>

          <h1 className="blog-article-title">{post.title}</h1>

          {post.tags && post.tags.length > 0 && (
            <ul className="blog-article-tags" aria-label="Tags">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <span className="blog-tag">{tag}</span>
                </li>
              ))}
            </ul>
          )}

          <p className="blog-article-dek">{getPostExcerpt(post)}</p>
        </header>

        {tocItems.length >= 2 && (
          <nav className="blog-article-toc" aria-label="Table of contents">
            <p className="blog-article-toc-label">In this article</p>
            <ol>
              {tocItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <BlogArticleContent content={post.content} />

        <footer className="blog-article-footer">
          <Link href="/blog" className="blog-article-footer-link link">
            ← Back to all writing
          </Link>
          <Link href="/" className="blog-article-footer-link link">
            Portfolio <Arrow size={12} />
          </Link>
        </footer>
      </div>
    </article>
  );
}
