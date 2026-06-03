"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Post } from "@/db/schema";
import { DraftsQueue } from "./DraftsQueue";
import { ReviewPanel } from "./ReviewPanel";
import type { LinkedinPost } from "@/db/schema";

type Detail = {
  post: Post;
  linkedin: LinkedinPost[];
} | null;

type Props = {
  drafts: Post[];
  detail: Detail;
};

export function ContentEngineClient({ drafts, detail }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("post");

  const selectPost = (id: string) => {
    router.push(`/admin/content-engine?post=${id}`);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <aside className="w-full max-w-sm border-r border-white/10 overflow-y-auto shrink-0">
        <div className="px-4 py-3 border-b border-white/10">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#B8C0C8]">
            Drafts queue
          </h2>
          <p className="text-xs text-[#62696F] mt-1">{drafts.length} pending</p>
        </div>
        <DraftsQueue
          drafts={drafts}
          selectedId={selectedId}
          onSelect={selectPost}
        />
      </aside>

      <main className="flex-1 min-w-0">
        {detail ? (
          <ReviewPanel post={detail.post} linkedin={detail.linkedin} />
        ) : (
          <div className="flex h-full items-center justify-center text-[#B8C0C8] text-sm">
            Select a draft to review
          </div>
        )}
      </main>
    </div>
  );
}
