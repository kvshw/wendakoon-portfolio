import { POSTS } from "@/lib/data";
import { BlogPostGrid } from "@/components/blog/BlogPostGrid";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { SectionHead } from "@/components/primitives/SectionHead";

export const Blog = ({ posts }) => {
  const items = posts?.length ? posts : POSTS.map((p) => ({ ...p, slug: "" }));

  return (
    <section id="blog" className="section" data-screen-label="10 Blog">
      <div className="container">
        <SectionHead
          label="Writing"
          title={<>Latest<br />writing.</>}
          sub="Notes from research and engineering practice, with a focus on trustworthy AI and real-world systems."
        />

        <BlogPostGrid posts={items} />

        <div style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
          <MagneticButton href="/blog">View all blog posts</MagneticButton>
        </div>
      </div>
    </section>
  );
};
