"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import type { ClientLinkedinPost, ClientPost } from "@/lib/db/serialize";
import { DraftsQueue } from "./DraftsQueue";
import { ReviewPanel } from "./ReviewPanel";
import type { ContentEngineStatus } from "@/lib/content/queries";
import { tokens } from "@/lib/admin/tokens";

type Detail = {
  post: ClientPost;
  linkedin: ClientLinkedinPost[];
} | null;

type Props = {
  posts: ClientPost[];
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
  const activePostId = selectedId ?? detail?.post.id ?? null;

  const [mobileView, setMobileView] = useState<"list" | "detail">(
    activePostId ? "detail" : "list"
  );

  const selectPost = (id: string) => {
    if (id === activePostId) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("post", id);
    router.replace(`/admin/content-engine?${params.toString()}`);
    router.refresh();
    setMobileView("detail");
  };

  const setStatus = (next: ContentEngineStatus) => {
    if (next === status) return;
    const params = new URLSearchParams();
    params.set("status", next);
    router.replace(`/admin/content-engine?${params.toString()}`);
    router.refresh();
    setMobileView("list");
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden md:flex-row flex-col">
      <aside
        className={`md:flex md:max-w-sm md:border-r md:border-b-0 border-b w-full shrink-0 flex-col overflow-y-auto ${
          mobileView === "detail" ? "hidden md:flex" : "flex"
        }`}
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
            selectedId={activePostId}
            onSelect={selectPost}
          />
        </div>
      </aside>

      <main
        className={`flex-1 min-w-0 overflow-y-auto flex-col ${
          mobileView === "list" ? "hidden md:flex" : "flex"
        }`}
      >
        <button
          type="button"
          onClick={() => setMobileView("list")}
          className="md:hidden flex items-center gap-2 px-4 py-3 text-sm font-medium border-b shrink-0"
          style={{ color: tokens.inkDim, borderColor: tokens.line }}
        >
          <ArrowLeft size={16} />
          Back to queue
        </button>

        {detail ? (
          <ReviewPanel
            key={detail.post.id}
            post={detail.post}
            linkedin={detail.linkedin}
            appUrl={appUrl}
          />
        ) : (
          <div
            className="flex flex-1 items-center justify-center text-sm"
            style={{ color: tokens.inkDim }}
          >
            Select a post to review
          </div>
        )}
      </main>
    </div>
  );
}
