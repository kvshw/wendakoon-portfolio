import { BlogSiteLayout } from "@/components/blog/BlogSiteLayout";

export const metadata = {
  title: "Blog · Kavishwa Wendakoon",
  description:
    "Notes from research and engineering practice, with a focus on trustworthy AI and real-world systems.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BlogSiteLayout>{children}</BlogSiteLayout>;
}
