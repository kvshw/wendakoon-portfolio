"use client";

import { useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Link,
  Code,
  Quote,
  List,
} from "lucide-react";
import { tokens } from "@/lib/admin/tokens";

type Props = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  minHeight?: number;
  placeholder?: string;
};

function wrapSelection(
  textarea: HTMLTextAreaElement,
  before: string,
  after = ""
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end);
  const next =
    textarea.value.slice(0, start) +
    before +
    selected +
    after +
    textarea.value.slice(end);
  return { next, cursor: start + before.length + selected.length + after.length };
}

export function MarkdownEditor({
  id = "markdown-editor",
  value,
  onChange,
  minHeight = 420,
  placeholder = "Write markdown…",
}: Props) {
  const applyWrap = useCallback(
    (before: string, after = "") => {
      const ta = document.getElementById(id) as HTMLTextAreaElement | null;
      if (!ta) return;
      const { next, cursor } = wrapSelection(ta, before, after);
      onChange(next);
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(cursor, cursor);
      });
    },
    [id, onChange]
  );

  const toolbarBtn = (icon: React.ReactNode, action: () => void, label: string) => (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="rounded p-1.5 transition-colors duration-150 hover:bg-[#1A1F25]"
      style={{ color: tokens.inkDim }}
      onClick={action}
    >
      {icon}
    </button>
  );

  return (
    <div className="admin-card overflow-hidden">
      <div
        className="flex flex-wrap gap-1 border-b px-2 py-1.5"
        style={{ borderColor: tokens.line }}
      >
        {toolbarBtn(<Bold size={16} />, () => applyWrap("**", "**"), "Bold")}
        {toolbarBtn(<Italic size={16} />, () => applyWrap("_", "_"), "Italic")}
        {toolbarBtn(<Heading2 size={16} />, () => applyWrap("## ", ""), "Heading 2")}
        {toolbarBtn(<Heading3 size={16} />, () => applyWrap("### ", ""), "Heading 3")}
        {toolbarBtn(<Link size={16} />, () => applyWrap("[", "](url)"), "Link")}
        {toolbarBtn(<Code size={16} />, () => applyWrap("```\n", "\n```"), "Code block")}
        {toolbarBtn(<Quote size={16} />, () => applyWrap("> ", ""), "Quote")}
        {toolbarBtn(<List size={16} />, () => applyWrap("- ", ""), "List item")}
      </div>

      <div
        className="grid grid-cols-1 lg:grid-cols-2"
        style={{ minHeight }}
      >
        <textarea
          id={id}
          className="resize-y border-0 bg-transparent p-4 font-mono text-sm outline-none"
          style={{
            color: tokens.ink,
            borderRight: `1px solid ${tokens.line}`,
            minHeight,
          }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <div
          className="blog-prose overflow-y-auto p-4"
          style={{ minHeight, background: tokens.surfaceRaised }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {value || "*Preview will appear here*"}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
