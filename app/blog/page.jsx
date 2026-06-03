import { BlogPostGrid } from "@/components/blog/BlogPostGrid";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { SectionHead } from "@/components/primitives/SectionHead";
import { getAllBlogTeasers } from "@/lib/content/blog-public";

export default async function BlogIndexPage() {
  const posts = await getAllBlogTeasers();

  return (
    <section className="section" style={{ paddingTop: "calc(var(--nav-h, 72px) + 48px)" }}>
      <div className="container">
        <SectionHead
          label="Writing"
          title={<>All<br />writing.</>}
          sub="Notes from research and engineering practice, with a focus on trustworthy AI and real-world systems."
        />

        <BlogPostGrid posts={posts} reveal={false} />

        <div style={{ display: "flex", justifyContent: "center", marginTop: 48 }}>
          <MagneticButton href="/">Back to portfolio</MagneticButton>
        </div>
      </div>
    </section>
  );
}
