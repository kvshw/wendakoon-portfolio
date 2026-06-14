"use client";

import type { ClientPost } from "@/lib/db/serialize";
import { countWords } from "@/lib/content/seo";
import { tokens } from "@/lib/admin/tokens";

type Props = {
  drafts: ClientPost[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const statusBadge: Record<ClientPost["status"], { label: string; color: string; bg: string }> = {
  draft: { label: "Draft", color: tokens.inkDim, bg: tokens.surfaceHover },
  approved: { label: "Published", color: tokens.accent, bg: tokens.accentFaint },
  rejected: { label: "Rejected", color: tokens.red, bg: tokens.redFaint },
};

export function DraftsQueue({ drafts, selectedId, onSelect }: Props) {
  if (drafts.length === 0) {
    return (
      <p className="text-sm p-4" style={{ color: tokens.inkDim }}>
        No posts in this view. Run the cron job or trigger generation manually.
      </p>
    );
  }

  return (
    <ul className="divide-y" style={{ borderColor: tokens.line }}>
      {drafts.map((draft) => {
        const badge = statusBadge[draft.status];
        const words = countWords(draft.content);

        return (
          <li key={draft.id}>
            <button
              type="button"
              onClick={() => onSelect(draft.id)}
              className="w-full text-left px-4 py-3 transition-colors hover:bg-white/5"
              style={{
                background:
                  selectedId === draft.id ? tokens.accentFaint : undefined,
                borderLeft:
                  selectedId === draft.id
                    ? `2px solid ${tokens.accent}`
                    : "2px solid transparent",
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-sm line-clamp-2" style={{ color: tokens.ink }}>
                  {draft.title}
                </p>
                <span
                  className="shrink-0 text-[9px] uppercase font-mono px-1 py-0.5 rounded"
                  style={{ color: badge.color, background: badge.bg }}
                >
                  {badge.label}
                </span>
              </div>
              <p className="text-xs mt-1 line-clamp-2" style={{ color: tokens.inkFaint }}>
                {draft.excerpt ?? draft.summary}
              </p>
              <div
                className="flex items-center gap-2 mt-2 text-[10px] font-mono"
                style={{ color: tokens.inkFaint }}
              >
                <span>{new Date(draft.createdAt).toLocaleDateString()}</span>
                <span>·</span>
                <span>{words} words</span>
                {draft.tags && draft.tags.length > 0 && (
                  <>
                    <span>·</span>
                    <span className="truncate">{draft.tags.slice(0, 2).join(", ")}</span>
                  </>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
