"use client";

import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useMemo, useState, useTransition } from "react";
import type { ClientLinkedinPost, ClientPost } from "@/lib/db/serialize";
import {
  updatePostDraft,
  approvePost,
  rejectPost,
} from "@/lib/content/actions";
import { slugify } from "@/lib/content/slug";
import { tokens } from "@/lib/admin/tokens";
import { MarkdownEditor } from "./MarkdownEditor";
import { SeoPanel } from "./SeoPanel";
import { LinkedinCard } from "./LinkedinCard";
import { CoverImagePanel } from "./CoverImagePanel";

type Tab = "edit" | "seo" | "linkedin" | "preview";

type Props = {
  post: ClientPost;
  linkedin: ClientLinkedinPost[];
  appUrl?: string;
};

export function ReviewPanel({ post, linkedin, appUrl }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("edit");
  const [title, setTitle] = useState(post.title);
  const [summary, setSummary] = useState(post.summary);
  const [excerpt, setExcerpt] = useState(post.excerpt ?? post.summary);
  const [content, setContent] = useState(post.content);
  const [slug, setSlug] = useState(post.slug);
  const [slugManual, setSlugManual] = useState(true);
  const [tags, setTags] = useState<string[]>(post.tags ?? []);
  const [coverImage, setCoverImage] = useState<string | null>(post.coverImage ?? null);
  const [tagInput, setTagInput] = useState("");
  const [linkedinRows, setLinkedinRows] = useState(
    linkedin.map((l) => ({
      id: l.id,
      content: l.content,
      status: l.status,
    }))
  );
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const suggestedSlug = useMemo(() => slugify(title), [title]);

  const saveEdits = () => {
    startTransition(async () => {
      try {
        await updatePostDraft(post.id, {
          title,
          summary,
          excerpt,
          content,
          slug: slugManual ? slug : suggestedSlug,
          tags,
          coverImage,
        });
        setMessage("All changes saved.");
        router.refresh();
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Save failed.");
      }
    });
  };

  const handleApprove = () => {
    startTransition(async () => {
      try {
        await updatePostDraft(post.id, {
          title,
          summary,
          excerpt,
          content,
          slug: slugManual ? slug : suggestedSlug,
          tags,
          coverImage,
        });
        await approvePost(post.id);
        setMessage("Approved and published.");
        router.refresh();
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Approve failed.");
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

  const addTag = () => {
    const t = tagInput.trim();
    if (!t || tags.includes(t)) return;
    setTags([...tags, t]);
    setTagInput("");
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "edit", label: "Edit" },
    { id: "seo", label: "SEO" },
    { id: "linkedin", label: `LinkedIn (${linkedinRows.length})` },
    { id: "preview", label: "Preview" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4"
        style={{ borderColor: tokens.line }}
      >
        <div className="min-w-0">
          <h2 className="text-lg font-semibold truncate" style={{ color: tokens.ink }}>
            {title}
          </h2>
          <p className="text-xs font-mono mt-0.5 truncate" style={{ color: tokens.inkFaint }}>
            /blog/{slugManual ? slug : suggestedSlug}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={saveEdits}
            disabled={pending}
            className="btn-ghost text-sm"
          >
            Save all
          </button>
          {post.status === "draft" && (
            <>
              <button
                type="button"
                onClick={handleReject}
                disabled={pending}
                className="px-3 py-1.5 text-sm rounded border font-medium disabled:opacity-50"
                style={{ borderColor: tokens.red, color: tokens.red }}
              >
                Reject
              </button>
              <button
                type="button"
                onClick={handleApprove}
                disabled={pending}
                className="btn-primary text-sm"
              >
                Accept & publish
              </button>
            </>
          )}
        </div>
      </div>

      {message && (
        <p className="px-6 py-2 text-sm" style={{ color: tokens.accent }}>
          {message}
        </p>
      )}

      <div
        className="flex gap-1 px-6 border-b overflow-x-auto"
        style={{ borderColor: tokens.line }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap"
            style={{
              borderColor: activeTab === tab.id ? tokens.accent : "transparent",
              color: activeTab === tab.id ? tokens.accent : tokens.inkDim,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeTab === "edit" && (
          <div className="max-w-5xl space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm">
                <span className="admin-label">Title</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="admin-input mt-1"
                />
              </label>
              <label className="block text-sm">
                <span className="admin-label">URL slug</span>
                <input
                  value={slugManual ? slug : suggestedSlug}
                  onChange={(e) => {
                    setSlugManual(true);
                    setSlug(e.target.value);
                  }}
                  className="admin-input mt-1 font-mono text-xs"
                />
                <button
                  type="button"
                  className="mt-1 text-[10px] font-mono uppercase"
                  style={{ color: tokens.accent }}
                  onClick={() => {
                    setSlugManual(false);
                    setSlug(suggestedSlug);
                  }}
                >
                  Regenerate from title
                </button>
              </label>
            </div>

            <label className="block text-sm">
              <span className="admin-label">Meta description (summary)</span>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                className="admin-input mt-1"
              />
            </label>

            <label className="block text-sm">
              <span className="admin-label">Excerpt (dek / card hook)</span>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                className="admin-input mt-1"
              />
            </label>

            <div>
              <span className="admin-label">Tags</span>
              <div className="mt-1 flex flex-wrap gap-1 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="admin-mono flex items-center gap-1 rounded px-1.5 py-0.5 text-[9px]"
                    style={{ background: tokens.accentFaint, color: tokens.accent }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => setTags(tags.filter((t) => t !== tag))}
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

            <CoverImagePanel
              postId={post.id}
              coverImage={coverImage}
              onCoverChange={setCoverImage}
            />

            <div>
              <span className="admin-label">Body</span>
              <div className="mt-1">
                <MarkdownEditor
                  id="content-engine-body"
                  value={content}
                  onChange={setContent}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "seo" && (
          <div className="max-w-xl">
            <SeoPanel
              title={title}
              description={summary}
              slug={slugManual ? slug : suggestedSlug}
              content={content}
              appUrl={appUrl}
            />
          </div>
        )}

        {activeTab === "linkedin" && (
          <div className="max-w-2xl space-y-4">
            {linkedinRows.length === 0 ? (
              <p className="text-sm" style={{ color: tokens.inkDim }}>
                No LinkedIn variations for this post.
              </p>
            ) : (
              linkedinRows.map((row, i) => (
                <LinkedinCard
                  key={row.id}
                  id={row.id}
                  index={i}
                  content={row.content}
                  status={row.status}
                  onContentChange={(next) => {
                    const copy = [...linkedinRows];
                    copy[i] = { ...copy[i], content: next };
                    setLinkedinRows(copy);
                  }}
                  onStatusChange={(status) => {
                    const copy = [...linkedinRows];
                    copy[i] = { ...copy[i], status };
                    setLinkedinRows(copy);
                  }}
                />
              ))
            )}
          </div>
        )}

        {activeTab === "preview" && (
          <article className="max-w-3xl">
            <header className="mb-8 space-y-3">
              <p className="text-xs uppercase tracking-wider" style={{ color: tokens.inkFaint }}>
                Preview
              </p>
              {coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverImage}
                  alt=""
                  className="w-full rounded-lg object-cover aspect-[1200/630] mb-4"
                  style={{ border: `1px solid ${tokens.line}` }}
                />
              )}
              <h1 className="text-3xl font-bold" style={{ color: tokens.ink }}>
                {title}
              </h1>
              {tags.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <li key={tag}>
                      <span className="blog-tag">{tag}</span>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-lg" style={{ color: tokens.inkDim }}>
                {excerpt}
              </p>
            </header>
            <div className="blog-prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
