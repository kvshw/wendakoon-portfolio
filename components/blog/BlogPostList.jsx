import Link from "next/link";
import { Arrow } from "@/components/primitives/Arrow";
import { Reveal } from "@/components/primitives/Reveal";

const RowInner = ({ post }) => (
  <>
    <div className="blog-list-date">[ {post.date} ]</div>
    <div className="blog-list-main">
      <h3>{post.title}</h3>
      {post.excerpt ? <p>{post.excerpt}</p> : null}
    </div>
    <span className="blog-list-action" aria-hidden="true">
      <Arrow size={13} />
    </span>
  </>
);

const Row = ({ post }) => {
  if (!post.slug) {
    return (
      <div className="blog-list-row" aria-disabled="true">
        <RowInner post={post} />
      </div>
    );
  }
  return (
    <Link href={`/blog/${post.slug}`} className="blog-list-row">
      <RowInner post={post} />
    </Link>
  );
};

export const BlogPostList = ({ posts, reveal = true }) => (
  <div className="blog-list">
    {posts.map((post, i) =>
      reveal ? (
        <Reveal key={post.slug || `${post.title}-${i}`} delay={i * 50}>
          <Row post={post} />
        </Reveal>
      ) : (
        <Row key={post.slug || `${post.title}-${i}`} post={post} />
      )
    )}
  </div>
);
