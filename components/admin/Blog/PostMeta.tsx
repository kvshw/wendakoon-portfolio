"use client";

import { useRef, useState } from "react";
import { slugify } from "@/lib/content/slug";
import { tokens } from "@/lib/admin/tokens";

export type PostMetaValues = {
  slug: string;
  tags: string[];
  status: "draft" | "approved" | "rejected";
  coverImage: string;
};

type Props = {
  title: string;
  values: PostMetaValues;
  onChange: (values: PostMetaValues) => void;
  slugManual: boolean;
  onSlugManualChange: (manual: boolean) => void;
};

export function PostMeta({
  title,
  values,
  onChange,
  slugManual,
  onSlugManualChange,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [tagInput, setTagInput] = useState("");
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const suggestSlug = () => {
    if (!slugManual && title) {
      onChange({ ...values, slug: slugify(title) });
    }
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (!t || values.tags.includes(t)) return;
    onChange({ ...values, tags: [...values.tags, t] });
    setTagInput("");
  };

  const uploadCover = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (!res.ok) return;
    const { url } = await res.json();
    onChange({ ...values, coverImage: url });
  };

  const setStatus = (status: PostMetaValues["status"]) => {
    if (status === "approved" && values.status !== "approved") {
      setShowPublishConfirm(true);
      return;
    }
    onChange({ ...values, status });
  };

  return (
    <aside className="admin-card w-full shrink-0 space-y-5 p-4 lg:w-72">
      <div>
        <label className="admin-label">Slug</label>
        <input
          className="admin-input font-mono text-xs"
          value={values.slug}
          onChange={(e) => {
            onSlugManualChange(true);
            onChange({ ...values, slug: e.target.value });
          }}
          onBlur={suggestSlug}
        />
        <button
          type="button"
          className="mt-1 text-[10px] font-mono uppercase"
          style={{ color: tokens.accent }}
          onClick={() => {
            onSlugManualChange(false);
            onChange({ ...values, slug: slugify(title) });
          }}
        >
          Regenerate from title
        </button>
      </div>

      <div>
        <label className="admin-label">Status</label>
        <div className="flex gap-2">
          {(["draft", "approved"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className="admin-mono flex-1 rounded border px-2 py-1.5 text-[10px] transition-all duration-150"
              style={{
                borderColor: values.status === s ? tokens.accent : tokens.line,
                color: values.status === s ? tokens.accent : tokens.inkDim,
                background:
                  values.status === s ? tokens.accentFaint : "transparent",
              }}
            >
              {s === "approved" ? "Published" : "Draft"}
            </button>
          ))}
        </div>
      </div>

      {showPublishConfirm && (
        <div
          className="rounded border p-3 text-xs"
          style={{ borderColor: tokens.line, background: tokens.surfaceHover }}
        >
          <p className="mb-2" style={{ color: tokens.inkDim }}>
            Publish this post? It will be visible on the public site.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-primary flex-1 text-xs"
              onClick={() => {
                onChange({ ...values, status: "approved" });
                setShowPublishConfirm(false);
              }}
            >
              Confirm
            </button>
            <button
              type="button"
              className="btn-ghost flex-1 text-xs"
              onClick={() => setShowPublishConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div>
        <label className="admin-label">Cover image</label>
        <input
          className="admin-input mb-2 text-xs"
          placeholder="URL or upload"
          value={values.coverImage}
          onChange={(e) => onChange({ ...values, coverImage: e.target.value })}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) uploadCover(f);
          }}
        />
        <button
          type="button"
          className="btn-ghost w-full text-xs"
          onClick={() => fileRef.current?.click()}
        >
          Upload to /public/blog
        </button>
      </div>

      <div>
        <label className="admin-label">Tags</label>
        <div className="mb-2 flex flex-wrap gap-1">
          {values.tags.map((tag) => (
            <span
              key={tag}
              className="admin-mono flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px]"
              style={{ background: tokens.accentFaint, color: tokens.accent }}
            >
              {tag}
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...values,
                    tags: values.tags.filter((t) => t !== tag),
                  })
                }
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <input
          className="admin-input text-xs"
          placeholder="Add tag, press Enter"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
        />
      </div>
    </aside>
  );
}
