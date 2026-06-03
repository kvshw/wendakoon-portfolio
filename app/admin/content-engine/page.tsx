import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { getDraftPosts, getPostWithLinkedin } from "@/lib/content/queries";
import { ContentEngineClient } from "@/components/admin/ContentEngine/ContentEngineClient";
import { PageHeader } from "@/components/admin/PageHeader";

type Props = {
  searchParams: Promise<{ post?: string }>;
};

export default async function ContentEnginePage({ searchParams }: Props) {
  await requireAdmin();

  const params = await searchParams;
  const postId = params.post;

  let drafts: Awaited<ReturnType<typeof getDraftPosts>> = [];
  let detail = null;

  try {
    drafts = await getDraftPosts();
    if (postId) {
      detail = await getPostWithLinkedin(postId);
    } else if (drafts[0]) {
      detail = await getPostWithLinkedin(drafts[0].id);
    }
  } catch (err) {
    console.error("[content-engine]", err);
  }

  return (
    <div className="-mx-6 -mt-6 flex flex-col lg:-mx-8 lg:-mt-8" style={{ minHeight: "calc(100vh - 3.25rem)" }}>
      <div className="border-b px-6 py-5 lg:px-8" style={{ borderColor: "var(--admin-line)" }}>
        <PageHeader
          title="Content engine"
          description="Review AI-generated blog and LinkedIn drafts"
        />
      </div>
      <Suspense
        fallback={
          <div className="p-6 text-sm lg:px-8" style={{ color: "var(--admin-ink-dim)" }}>
            Loading drafts…
          </div>
        }
      >
        <ContentEngineClient drafts={drafts} detail={detail} />
      </Suspense>
    </div>
  );
}
