import { BlogPostGrid } from "@/components/blog/BlogPostGrid";
import { BlogPostList } from "@/components/blog/BlogPostList";
import { MagneticButton } from "@/components/primitives/MagneticButton";
import { SectionHead } from "@/components/primitives/SectionHead";
import { getAllBlogTeasers } from "@/lib/content/blog-public";

export default async function BlogIndexPage() {
  const posts = await getAllBlogTeasers();
  const featured = posts.slice(0, 4);
  const older = posts.slice(4);

  return (
    <section className="section" style={{ paddingTop: "calc(var(--nav-h, 72px) + 48px)" }}>
      <div className="container">
        <SectionHead
          label="Writing"
          title={<>All<br />writing.</>}
          sub="Notes from research and engineering practice, with a focus on trustworthy AI and real-world systems."
        />

        <BlogPostGrid posts={featured} reveal={false} variant="featured" />

        {older.length > 0 && (
          <div className="blog-archive">
            <div className="blog-archive-head">
              <span className="blog-archive-label">Archive</span>
              <span className="blog-archive-meta">
                {older.length} earlier {older.length === 1 ? "post" : "posts"}
              </span>
            </div>
            <BlogPostList posts={older} />
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "center", marginTop: 56 }}>
          <MagneticButton href="/">Back to portfolio</MagneticButton>
        </div>
      </div>
    </section>
  );
}
