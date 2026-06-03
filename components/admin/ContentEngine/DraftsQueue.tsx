"use client";

import type { Post } from "@/db/schema";

type Props = {
  drafts: Post[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function DraftsQueue({ drafts, selectedId, onSelect }: Props) {
  if (drafts.length === 0) {
    return (
      <p className="text-sm text-[#B8C0C8] p-4">
        No drafts in queue. Run the cron job or trigger generation manually.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-white/10">
      {drafts.map((draft) => (
        <li key={draft.id}>
          <button
            type="button"
            onClick={() => onSelect(draft.id)}
            className={`w-full text-left px-4 py-3 transition-colors hover:bg-white/5 ${
              selectedId === draft.id ? "bg-[#28BDAE]/15 border-l-2 border-[#28BDAE]" : ""
            }`}
          >
            <p className="font-medium text-sm line-clamp-2">{draft.title}</p>
            <p className="text-xs text-[#B8C0C8] mt-1">
              {new Date(draft.createdAt).toLocaleDateString()}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
}
