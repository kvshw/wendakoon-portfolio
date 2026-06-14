"use client";

import { useCallback, useEffect, useState } from "react";
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
  Image,
} from "lucide-react";
import { PostMeta, type PostMetaValues } from "./PostMeta";
import { CoverImagePanel } from "@/components/admin/ContentEngine/CoverImagePanel";
import { createPost, updatePost, publishPost } from "@/lib/content/blog";
import { validateSlug } from "@/lib/content/blog-utils";
import { slugify } from "@/lib/content/slug";
import { useRouter } from "next/navigation";
import { tokens } from "@/lib/admin/tokens";
import type { Post } from "@/db/schema";

type Props = {
  post?: Post | null;
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

export function PostEditor({ post }: Props) {
  const router = useRouter();
  const isEdit = Boolean(post);

  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? post?.summary ?? "");
  const [body, setBody] = useState(post?.content ?? "");
  const [slugManual, setSlugManual] = useState(false);
  const [meta, setMeta] = useState<PostMetaValues>({
    slug: post?.slug ?? "",
    tags: post?.tags ?? [],
    status: post?.status ?? "draft",
    coverImage: post?.coverImage ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slugManual && title) {
      setMeta((m) => ({ ...m, slug: slugify(title) }));
    }
  }, [title, slugManual]);

  const save = useCallback(
    async (publish = false) => {
      setSaving(true);
      setError("");

      const trimmedTitle = title.trim();
      const slug = meta.slug.trim().toLowerCase();

      if (!trimmedTitle) {
        setError("Title is required.");
        setSaving(false);
        return;
      }
      if (!slug || !validateSlug(slug)) {
        setError("A valid URL slug is required (lowercase letters, numbers, and hyphens).");
        setSaving(false);
        return;
      }

      try {
        const payload = {
          title: trimmedTitle,
          slug,
          excerpt,
          summary: excerpt,
          content: body,
          coverImage: meta.coverImage || null,
          tags: meta.tags,
          status: publish ? ("approved" as const) : meta.status,
        };

        if (isEdit && post) {
          await updatePost(post.id, payload);
          if (publish) await publishPost(post.id);
          router.push("/admin/blog");
          router.refresh();
        } else {
          const created = await createPost(payload);
          if (!created?.id) {
            throw new Error("Post was not saved. Check your database connection.");
          }
          if (publish && created.status !== "approved") {
            await publishPost(created.id);
          }
          router.push("/admin/blog");
          router.refresh();
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Save failed");
      } finally {
        setSaving(false);
      }
    },
    [title, excerpt, body, meta, isEdit, post, router]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        save(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "p") {
        e.preventDefault();
        save(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  const toolbar = (icon: React.ReactNode, action: (ta: HTMLTextAreaElement) => void) => (
    <button
      type="button"
      className="rounded p-1.5 transition-colors duration-150 hover:bg-[#1A1F25]"
      style={{ color: tokens.inkDim }}
      onClick={() => {
        const ta = document.getElementById("post-body") as HTMLTextAreaElement;
        if (!ta) return;
        action(ta);
      }}
    >
      {icon}
    </button>
  );

  const applyWrap = (before: string, after = "") => {
    const ta = document.getElementById("post-body") as HTMLTextAreaElement;
    if (!ta) return;
    const { next, cursor } = wrapSelection(ta, before, after);
    setBody(next);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(cursor, cursor);
    });
  };

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded border px-3 py-2 text-sm" style={{ borderColor: tokens.red, color: tokens.red }}>
          {error}
        </p>
      )}

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1 space-y-4">
          <input
            className="admin-input text-lg font-semibold"
            placeholder="Post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="admin-input min-h-[60px] text-sm"
            placeholder="Excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />

          <CoverImagePanel
            postId={post?.id}
            coverImage={meta.coverImage || null}
            onCoverChange={(url) =>
              setMeta((m) => ({ ...m, coverImage: url ?? "" }))
            }
            persist={Boolean(post?.id)}
          />

          <div className="admin-card overflow-hidden">
            <div
              className="flex flex-wrap gap-1 border-b px-2 py-1.5"
              style={{ borderColor: tokens.line }}
            >
              {toolbar(<Bold size={16} />, () => applyWrap("**", "**"))}
              {toolbar(<Italic size={16} />, () => applyWrap("_", "_"))}
              {toolbar(<Heading2 size={16} />, () => applyWrap("## ", ""))}
              {toolbar(<Heading3 size={16} />, () => applyWrap("### ", ""))}
              {toolbar(<Link size={16} />, () => applyWrap("[", "](url)"))}
              {toolbar(<Code size={16} />, () => applyWrap("```\n", "\n```"))}
              {toolbar(<Quote size={16} />, () => applyWrap("> ", ""))}
              {toolbar(<Image size={16} />, () => applyWrap("![alt](", ")"))}
            </div>

            <div className="grid min-h-[420px] grid-cols-1 md:grid-cols-2">
              <textarea
                id="post-body"
                className="min-h-[420px] resize-none border-0 bg-transparent p-4 font-mono text-sm outline-none"
                style={{ color: tokens.ink, borderRight: `1px solid ${tokens.line}` }}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write markdown…"
              />
              <div className="blog-prose overflow-y-auto p-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{body || "*Preview*"}</ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className="btn-primary"
              disabled={saving}
              onClick={() => save(false)}
            >
              {saving ? "Saving…" : "Save draft"}
            </button>
            <button
              type="button"
              className="btn-ghost"
              disabled={saving}
              onClick={() => save(true)}
            >
              Publish
            </button>
          </div>
          <p className="admin-mono text-[10px]" style={{ color: tokens.inkFaint }}>
            ⌘S save · ⌘⇧P publish
          </p>
        </div>

        <PostMeta
          title={title}
          values={meta}
          onChange={setMeta}
          slugManual={slugManual}
          onSlugManualChange={setSlugManual}
        />
      </div>
    </div>
  );
}
