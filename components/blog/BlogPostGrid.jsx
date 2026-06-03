import { BlogPostCard } from "@/components/blog/BlogPostCard";

export const BlogPostGrid = ({ posts, reveal = true }) => (
  <div className="blog-grid">
    {posts.map((post, i) => (
      <BlogPostCard
        key={post.slug || `${post.title}-${i}`}
        post={post}
        index={i}
        reveal={reveal}
      />
    ))}
  </div>
);
