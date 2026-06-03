"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Post, LinkedinPost } from "@/db/schema";
import {
  updatePostDraft,
  updateLinkedinDraft,
  approvePost,
  rejectPost,
} from "@/lib/content/actions";

type Props = {
  post: Post;
  linkedin: LinkedinPost[];
};

export function ReviewPanel({ post, linkedin }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post.title);
  const [summary, setSummary] = useState(post.summary);
  const [content, setContent] = useState(post.content);
  const [linkedinContents, setLinkedinContents] = useState(
    linkedin.map((l) => ({ id: l.id, content: l.content }))
  );
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const saveEdits = () => {
    startTransition(async () => {
      try {
        await updatePostDraft(post.id, { title, summary, content });
        for (const row of linkedinContents) {
          await updateLinkedinDraft(row.id, row.content);
        }
        setMessage("Saved.");
        router.refresh();
      } catch {
        setMessage("Save failed.");
      }
    });
  };

  const handleApprove = () => {
    startTransition(async () => {
      try {
        await approvePost(post.id);
        setMessage("Approved and published timestamp set.");
        router.refresh();
      } catch {
        setMessage("Approve failed.");
      }
    });
  };

  const handleReject = () => {
    startTransition(async () => {
      try {
        await rejectPost(post.id);
        setMessage("Rejected.");
        router.refresh();
      } catch {
        setMessage("Reject failed.");
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
        <h2 className="text-lg font-semibold truncate">{title}</h2>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={saveEdits}
            disabled={pending}
            className="px-3 py-1.5 text-sm rounded border border-white/20 hover:bg-white/5 disabled:opacity-50"
          >
            Save edits
          </button>
          <button
            type="button"
            onClick={handleReject}
            disabled={pending}
            className="px-3 py-1.5 text-sm rounded border border-red-500/40 text-red-300 hover:bg-red-500/10 disabled:opacity-50"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={handleApprove}
            disabled={pending}
            className="px-3 py-1.5 text-sm rounded bg-[#28BDAE] text-[#0A0D10] font-medium hover:bg-[#7AF7E5] disabled:opacity-50"
          >
            Accept
          </button>
        </div>
      </div>

      {message && (
        <p className="px-6 py-2 text-sm text-[#7AF7E5]">{message}</p>
      )}

      <div className="flex-1 overflow-auto grid lg:grid-cols-2 gap-0 divide-x divide-white/10">
        <section className="p-6 space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-[#B8C0C8]">
            Blog draft
          </h3>
          <label className="block text-sm">
            <span className="text-[#B8C0C8]">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded border border-white/15 bg-[#11171B] px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm">
            <span className="text-[#B8C0C8]">Summary</span>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded border border-white/15 bg-[#11171B] px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm flex-1">
            <span className="text-[#B8C0C8]">Markdown</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="mt-1 w-full rounded border border-white/15 bg-[#11171B] px-3 py-2 text-sm font-mono"
            />
          </label>
        </section>

        <section className="p-6 space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-[#B8C0C8]">
            LinkedIn variations ({linkedinContents.length})
          </h3>
          {linkedinContents.map((row, i) => (
            <label key={row.id} className="block text-sm">
              <span className="text-[#B8C0C8]">Variation {i + 1}</span>
              <textarea
                value={row.content}
                onChange={(e) => {
                  const next = [...linkedinContents];
                  next[i] = { ...next[i], content: e.target.value };
                  setLinkedinContents(next);
                }}
                rows={8}
                className="mt-1 w-full rounded border border-white/15 bg-[#11171B] px-3 py-2 text-sm"
              />
            </label>
          ))}
        </section>
      </div>
    </div>
  );
}
