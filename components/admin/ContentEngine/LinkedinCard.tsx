"use client";

import { useState, useTransition } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { updateLinkedinDraft, updateLinkedinStatus } from "@/lib/content/actions";
import { tokens } from "@/lib/admin/tokens";

type Props = {
  id: string;
  index: number;
  content: string;
  status: "draft" | "ready" | "posted";
  onContentChange: (content: string) => void;
  onStatusChange: (status: "draft" | "ready" | "posted") => void;
  onSaved?: () => void;
};

export function LinkedinCard({
  id,
  index,
  content,
  status,
  onContentChange,
  onStatusChange,
  onSaved,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const charCount = content.length;
  const charOk = charCount <= 2800;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setMessage("Copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setMessage("Copy failed. Select text manually.");
    }
  };

  const saveContent = () => {
    startTransition(async () => {
      try {
        await updateLinkedinDraft(id, content);
        setMessage("Saved.");
        onSaved?.();
      } catch {
        setMessage("Save failed.");
      }
    });
  };

  const markStatus = (next: "draft" | "ready" | "posted") => {
    startTransition(async () => {
      try {
        await updateLinkedinStatus(id, next);
        onStatusChange(next);
        setMessage(next === "posted" ? "Marked as posted." : "Status updated.");
      } catch {
        setMessage("Status update failed.");
      }
    });
  };

  const statusStyles = {
    draft: { color: tokens.inkDim, bg: tokens.surfaceHover },
    ready: { color: tokens.accent, bg: tokens.accentFaint },
    posted: { color: tokens.amber, bg: tokens.amberFaint },
  };

  const style = statusStyles[status];

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: tokens.line, background: tokens.surfaceRaised }}
    >
      <div
        className="flex items-center justify-between gap-2 px-4 py-2 border-b"
        style={{ borderColor: tokens.line }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium" style={{ color: tokens.ink }}>
            Variation {index + 1}
          </span>
          <span
            className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded"
            style={{ color: style.color, background: style.bg }}
          >
            {status}
          </span>
        </div>
        <span
          className="text-[10px] font-mono"
          style={{ color: charOk ? tokens.inkFaint : tokens.red }}
        >
          {charCount} / 2800
        </span>
      </div>

      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        rows={10}
        className="w-full resize-y border-0 bg-transparent px-4 py-3 text-sm outline-none"
        style={{ color: tokens.ink }}
        placeholder="LinkedIn post copy…"
      />

      <div
        className="flex flex-wrap items-center gap-2 px-4 py-3 border-t"
        style={{ borderColor: tokens.line }}
      >
        <button
          type="button"
          onClick={copyToClipboard}
          className="btn-ghost inline-flex items-center gap-1.5 text-xs"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          type="button"
          onClick={saveContent}
          disabled={pending}
          className="btn-primary text-xs"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => markStatus("ready")}
          disabled={pending || status === "ready"}
          className="btn-ghost text-xs"
        >
          Mark ready
        </button>
        <button
          type="button"
          onClick={() => markStatus("posted")}
          disabled={pending || status === "posted"}
          className="btn-ghost text-xs"
        >
          Mark posted
        </button>
        <a
          href="https://www.linkedin.com/feed/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost inline-flex items-center gap-1 text-xs ml-auto"
        >
          Open LinkedIn
          <ExternalLink size={12} />
        </a>
      </div>

      {message && (
        <p className="px-4 pb-3 text-xs" style={{ color: tokens.accent }}>
          {message}
        </p>
      )}
    </div>
  );
}
