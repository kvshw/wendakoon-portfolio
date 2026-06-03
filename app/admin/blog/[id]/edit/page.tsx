import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getPostById } from "@/lib/db/queries/posts";
import { PostEditor } from "@/components/admin/Blog/PostEditor";

type Props = { params: Promise<{ id: string }> };

export default async function EditBlogPostPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;

  let post = null;
  try {
    post = await getPostById(id);
  } catch {
    post = null;
  }

  if (!post) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Edit post</h1>
      <PostEditor post={post} />
    </div>
  );
}
