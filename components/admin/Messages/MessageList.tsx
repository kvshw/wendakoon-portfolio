"use client";

import { useState, useTransition } from "react";
import { tokens } from "@/lib/admin/tokens";
import {
  setMessageStatus,
  deleteMessage,
} from "@/lib/content/message-actions";
import type { ContactMessage } from "@/db/schema";

type Filter = "all" | "new" | "read" | "archived";

const STATUS_STYLE: Record<
  ContactMessage["status"],
  { bg: string; color: string; label: string }
> = {
  new: { bg: "rgba(40,189,174,0.15)", color: tokens.accent, label: "NEW" },
  read: { bg: "rgba(255,255,255,0.06)", color: tokens.inkDim, label: "READ" },
  archived: {
    bg: "rgba(255,255,255,0.04)",
    color: tokens.inkFaint,
    label: "ARCHIVED",
  },
};

function formatDate(value: Date | string) {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function MessageList({ messages }: { messages: ContactMessage[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const filtered =
    filter === "all" ? messages : messages.filter((m) => m.status === filter);

  const toggle = (msg: ContactMessage) => {
    const next = openId === msg.id ? null : msg.id;
    setOpenId(next);
    if (next && msg.status === "new") {
      startTransition(() => setMessageStatus(msg.id, "read"));
    }
  };

  const act = (id: string, fn: () => Promise<void>) => {
    startTransition(async () => {
      await fn();
    });
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {(["all", "new", "read", "archived"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className="admin-mono rounded px-2 py-1 text-[10px] transition-all duration-150"
            style={{
              color: filter === f ? tokens.accent : tokens.inkFaint,
              background: filter === f ? tokens.accentFaint : "transparent",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="admin-card divide-y" style={{ borderColor: tokens.line }}>
        {filtered.length === 0 ? (
          <p className="p-6 text-sm" style={{ color: tokens.inkDim }}>
            No messages in this filter.
          </p>
        ) : (
          filtered.map((msg) => {
            const open = openId === msg.id;
            const badge = STATUS_STYLE[msg.status];
            return (
              <div key={msg.id} className="px-4 py-3">
                <button
                  type="button"
                  onClick={() => toggle(msg)}
                  className="flex w-full flex-wrap items-center justify-between gap-3 text-left"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="admin-mono rounded px-1.5 py-0.5 text-[9px]"
                      style={{ background: badge.bg, color: badge.color }}
                    >
                      {badge.label}
                    </span>
                    <span
                      className="font-medium truncate"
                      style={{
                        color: msg.status === "new" ? tokens.ink : tokens.inkDim,
                      }}
                    >
                      {msg.name}
                    </span>
                    {msg.context && (
                      <span
                        className="hidden sm:inline truncate text-xs"
                        style={{ color: tokens.inkFaint }}
                      >
                        · {msg.context}
                      </span>
                    )}
                  </div>
                  <span
                    className="font-mono text-[11px] shrink-0"
                    style={{ color: tokens.inkFaint }}
                  >
                    {formatDate(msg.createdAt)}
                  </span>
                </button>

                {open && (
                  <div className="mt-3 space-y-3">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                      <a
                        href={`mailto:${msg.email}?subject=Re: your message`}
                        className="font-mono"
                        style={{ color: tokens.accent }}
                      >
                        {msg.email}
                      </a>
                      <span style={{ color: tokens.inkFaint }}>
                        Consent: {msg.consent ? "given" : "not recorded"}
                      </span>
                    </div>
                    <p
                      className="whitespace-pre-wrap rounded-lg p-3 text-sm leading-relaxed"
                      style={{
                        background: tokens.surface,
                        color: tokens.inkDim,
                        border: `1px solid ${tokens.line}`,
                      }}
                    >
                      {msg.message}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`mailto:${msg.email}?subject=Re: your message`}
                        className="btn-primary text-xs"
                      >
                        Reply
                      </a>
                      {msg.status !== "archived" ? (
                        <button
                          type="button"
                          disabled={pending}
                          className="btn-ghost text-xs"
                          onClick={() =>
                            act(msg.id, () =>
                              setMessageStatus(msg.id, "archived")
                            )
                          }
                        >
                          Archive
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={pending}
                          className="btn-ghost text-xs"
                          onClick={() =>
                            act(msg.id, () => setMessageStatus(msg.id, "read"))
                          }
                        >
                          Unarchive
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={pending}
                        className="btn-ghost text-xs"
                        style={{ color: tokens.red }}
                        onClick={() => {
                          if (
                            window.confirm(
                              "Delete this message permanently? This cannot be undone."
                            )
                          ) {
                            act(msg.id, () => deleteMessage(msg.id));
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
