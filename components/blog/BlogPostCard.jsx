import Link from "next/link";
import { Arrow } from "@/components/primitives/Arrow";
import { Reveal } from "@/components/primitives/Reveal";
import { TiltCard } from "@/components/primitives/TiltCard";

const CardBody = ({ post }) => {
  const inner = (
    <>
      {post.coverImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt=""
          className="mb-4 h-36 w-full rounded object-cover"
        />
      )}
      <div className="date">[ {post.date} ]</div>
      <h3>{post.title}</h3>
      {post.excerpt ? <p>{post.excerpt}</p> : null}
      <span className="link">
        Read post <Arrow size={12} />
      </span>
    </>
  );

  if (!post.slug) {
    return (
      <TiltCard className="blog-card" strength={3} aria-disabled="true">
        {inner}
      </TiltCard>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="blog-card-link">
      <TiltCard className="blog-card" strength={3}>
        {inner}
      </TiltCard>
    </Link>
  );
};

export const BlogPostCard = ({ post, index = 0, reveal = true }) => {
  if (!reveal) return <CardBody post={post} />;
  return (
    <Reveal delay={index * 80}>
      <CardBody post={post} />
    </Reveal>
  );
};
