import { requireAdmin } from "@/lib/auth";
import { PostEditor } from "@/components/admin/Blog/PostEditor";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  await requireAdmin();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">New blog post</h1>
      <PostEditor />
    </div>
  );
}
