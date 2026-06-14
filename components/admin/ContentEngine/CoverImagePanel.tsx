"use client";

import { useRef, useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Link2, RefreshCw, Trash2 } from "lucide-react";
import {
  regeneratePostCover,
  updatePostCover,
} from "@/lib/content/actions";
import { tokens } from "@/lib/admin/tokens";

type Props = {
  postId?: string;
  coverImage: string | null;
  onCoverChange: (url: string | null) => void;
  /** When true (default if postId), uploads and URL changes save to the database immediately. */
  persist?: boolean;
};

export function CoverImagePanel({
  postId,
  coverImage,
  onCoverChange,
  persist = Boolean(postId),
}: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();
  const [urlInput, setUrlInput] = useState(coverImage ?? "");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setUrlInput(coverImage ?? "");
  }, [coverImage]);

  const persistCover = async (url: string | null) => {
    onCoverChange(url);
    setUrlInput(url ?? "");

    if (!persist || !postId) {
      setMessage(url ? "Cover set. Save the post to keep it." : "Cover cleared.");
      return;
    }

    await updatePostCover(postId, url);
    router.refresh();
    setMessage(url ? "Cover saved." : "Cover removed.");
  };

  const uploadCover = async (file: File) => {
    setMessage(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (!res.ok) {
      setMessage("Upload failed.");
      return;
    }
    const { url } = await res.json();
    startTransition(async () => {
      try {
        await persistCover(url);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Failed to save cover.");
      }
    });
  };

  const applyUrl = () => {
    const url = urlInput.trim();
    if (!url) {
      setMessage("Enter an image URL.");
      return;
    }
    startTransition(async () => {
      try {
        await persistCover(url);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Failed to save cover.");
      }
    });
  };

  const regenerate = () => {
    if (!postId) {
      setMessage("Save the post first, then you can generate a cover.");
      return;
    }
    setMessage(null);
    startTransition(async () => {
      try {
        const url = await regeneratePostCover(postId);
        onCoverChange(url);
        setUrlInput(url);
        router.refresh();
        setMessage("New cover generated and saved.");
      } catch (err) {
        setMessage(
          err instanceof Error ? err.message : "Cover generation failed."
        );
      }
    });
  };

  const removeCover = () => {
    startTransition(async () => {
      try {
        await persistCover(null);
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Failed to remove cover.");
      }
    });
  };

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{ borderColor: tokens.line, background: tokens.surfaceRaised }}
    >
      <div
        className="flex items-center justify-between gap-3 px-4 py-3 border-b"
        style={{ borderColor: tokens.line }}
      >
        <div>
          <h4 className="text-sm font-medium" style={{ color: tokens.ink }}>
            Cover image
          </h4>
          <p className="text-xs mt-0.5" style={{ color: tokens.inkFaint }}>
            {postId
              ? "Upload, paste a URL, or generate. Saves immediately."
              : "Upload or paste a URL. Save the post to keep the cover."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0 justify-end">
          {postId && (
            <button
              type="button"
              onClick={regenerate}
              disabled={pending}
              className="btn-ghost inline-flex items-center gap-1.5 text-xs"
            >
              <RefreshCw size={14} className={pending ? "animate-spin" : undefined} />
              {pending ? "Working…" : "Generate"}
            </button>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={pending}
            className="btn-ghost inline-flex items-center gap-1.5 text-xs"
          >
            <ImagePlus size={14} />
            Upload
          </button>
          {coverImage && (
            <button
              type="button"
              onClick={removeCover}
              disabled={pending}
              className="btn-ghost inline-flex items-center gap-1.5 text-xs"
              style={{ color: tokens.red }}
            >
              <Trash2 size={14} />
              Remove
            </button>
          )}
        </div>
      </div>

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

      <div className="px-4 py-3 border-b flex gap-2" style={{ borderColor: tokens.line }}>
        <input
          className="admin-input flex-1 text-xs font-mono"
          placeholder="/blog/covers/… or https://…"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              applyUrl();
            }
          }}
        />
        <button
          type="button"
          onClick={applyUrl}
          disabled={pending}
          className="btn-primary inline-flex items-center gap-1 text-xs shrink-0"
        >
          <Link2 size={14} />
          Apply URL
        </button>
      </div>

      {coverImage ? (
        <div className="p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt="Post cover preview"
            className="w-full rounded-lg object-cover aspect-[1200/630]"
            style={{ border: `1px solid ${tokens.line}` }}
          />
          <p className="text-[10px] font-mono mt-2 truncate" style={{ color: tokens.inkFaint }}>
            {coverImage}
          </p>
        </div>
      ) : (
        <div
          className="m-4 flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-center px-4"
          style={{ borderColor: tokens.line, color: tokens.inkFaint }}
        >
          No cover yet. Upload an image, paste a URL, or generate one.
        </div>
      )}

      {message && (
        <p className="px-4 pb-3 text-xs" style={{ color: tokens.accent }}>
          {message}
        </p>
      )}
    </div>
  );
}
