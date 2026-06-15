import { HomePage } from "@/components/HomePage";
import { getAllSectionContent } from "@/lib/content/sections";
import { getBlogTeasers } from "@/lib/content/blog-public";

export default async function Page() {
  const [initialContent, blogPosts] = await Promise.all([
    getAllSectionContent(),
    getBlogTeasers(6),
  ]);

  return <HomePage initialContent={initialContent} blogPosts={blogPosts} />;
}
