"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Post } from "@/db/schema";
import { DraftsQueue } from "./DraftsQueue";
import { ReviewPanel } from "./ReviewPanel";
import type { LinkedinPost } from "@/db/schema";
import type { ContentEngineStatus } from "@/lib/content/queries";
import { tokens } from "@/lib/admin/tokens";

type Detail = {
  post: Post;
  linkedin: LinkedinPost[];
} | null;

type Props = {
  posts: Post[];
  detail: Detail;
  status: ContentEngineStatus;
  appUrl?: string;
};

const STATUS_TABS: { id: ContentEngineStatus; label: string }[] = [
  { id: "draft", label: "Drafts" },
  { id: "approved", label: "Published" },
  { id: "rejected", label: "Rejected" },
  { id: "all", label: "All" },
];

export function ContentEngineClient({ posts, detail, status, appUrl }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("post");

  const selectPost = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("post", id);
    router.push(`/admin/content-engine?${params.toString()}`);
  };

  const setStatus = (next: ContentEngineStatus) => {
    const params = new URLSearchParams();
    params.set("status", next);
    router.push(`/admin/content-engine?${params.toString()}`);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <aside
        className="w-full max-w-sm border-r overflow-y-auto shrink-0 flex flex-col"
        style={{ borderColor: tokens.line }}
      >
        <div className="px-4 py-3 border-b" style={{ borderColor: tokens.line }}>
          <h2
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: tokens.inkDim }}
          >
            Content queue
          </h2>
          <p className="text-xs mt-1" style={{ color: tokens.inkFaint }}>
            {posts.length} {status === "all" ? "total" : status}
          </p>
        </div>

        <div
          className="flex gap-1 px-3 py-2 border-b overflow-x-auto"
          style={{ borderColor: tokens.line }}
        >
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatus(tab.id)}
              className="px-2.5 py-1 text-[10px] font-mono uppercase rounded whitespace-nowrap transition-colors"
              style={{
                color: status === tab.id ? tokens.accent : tokens.inkFaint,
                background: status === tab.id ? tokens.accentFaint : "transparent",
                border: `1px solid ${status === tab.id ? tokens.accent : tokens.line}`,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          <DraftsQueue
            drafts={posts}
            selectedId={selectedId}
            onSelect={selectPost}
          />
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        {detail ? (
          <ReviewPanel
            post={detail.post}
            linkedin={detail.linkedin}
            appUrl={appUrl}
          />
        ) : (
          <div
            className="flex h-full items-center justify-center text-sm"
            style={{ color: tokens.inkDim }}
          >
            Select a post to review
          </div>
        )}
      </main>
    </div>
  );
}
