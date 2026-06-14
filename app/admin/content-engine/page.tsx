import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import {
  getContentEnginePosts,
  getPostWithLinkedin,
  type ContentEngineStatus,
} from "@/lib/content/queries";
import { ContentEngineClient } from "@/components/admin/ContentEngine/ContentEngineClient";
import { GenerateNowButton } from "@/components/admin/ContentEngine/GenerateNowButton";
import { PageHeader } from "@/components/admin/PageHeader";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ post?: string; status?: string }>;
};

function parseStatus(raw?: string): ContentEngineStatus {
  if (raw === "approved" || raw === "rejected" || raw === "all") return raw;
  return "draft";
}

export default async function ContentEnginePage({ searchParams }: Props) {
  await requireAdmin();

  const params = await searchParams;
  const postId = params.post;
  const status = parseStatus(params.status);

  let posts: Awaited<ReturnType<typeof getContentEnginePosts>> = [];
  let detail = null;

  try {
    posts = await getContentEnginePosts(status);
    if (postId) {
      detail = await getPostWithLinkedin(postId);
    } else if (posts[0]) {
      detail = await getPostWithLinkedin(posts[0].id);
    }
  } catch (err) {
    console.error("[content-engine]", err);
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <div
      className="-mx-6 -mt-6 flex flex-col lg:-mx-8 lg:-mt-8"
      style={{ minHeight: "calc(100vh - 3.25rem)" }}
    >
      <div
        className="border-b px-6 py-5 lg:px-8"
        style={{ borderColor: "var(--admin-line)" }}
      >
        <PageHeader
          title="Content engine"
          description="Review AI-generated blogs, tune SEO, and manage LinkedIn posts"
          action={<GenerateNowButton />}
        />
      </div>
      <Suspense
        fallback={
          <div
            className="p-6 text-sm lg:px-8"
            style={{ color: "var(--admin-ink-dim)" }}
          >
            Loading content…
          </div>
        }
      >
        <ContentEngineClient
          posts={posts}
          detail={detail}
          status={status}
          appUrl={appUrl}
        />
      </Suspense>
    </div>
  );
}
