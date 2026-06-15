import { BlogPostCard } from "@/components/blog/BlogPostCard";

export const BlogPostGrid = ({ posts, reveal = true, variant }) => (
  <div className={`blog-grid${variant === "featured" ? " blog-grid--featured" : ""}`}>
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
