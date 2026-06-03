import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { getAllPosts } from "@/lib/db/queries/posts";
import { PostList } from "@/components/admin/Blog/PostList";
import { PageHeader } from "@/components/admin/PageHeader";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  await requireAdmin();

  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];
  let loadError: string | null = null;

  try {
    posts = await getAllPosts();
  } catch (err) {
    console.error("[admin/blog]", err);
    loadError =
      err instanceof Error
        ? err.message
        : "Could not load posts. Check DATABASE_URL and that migrations are applied.";
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog"
        description="Manage drafts and published posts"
        action={
          <Link href="/admin/blog/new" className="btn-primary text-sm">
            New post
          </Link>
        }
      />
      {loadError && (
        <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {loadError}
        </p>
      )}
      <PostList posts={posts} />
    </div>
  );
}
