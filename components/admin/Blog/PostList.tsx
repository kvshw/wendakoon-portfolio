"use client";

import Link from "next/link";
import { useState } from "react";
import { deletePost } from "@/lib/content/blog";
import { tokens } from "@/lib/admin/tokens";
import type { Post } from "@/db/schema";

type Filter = "all" | "draft" | "approved" | "rejected";

export function PostList({ posts }: { posts: Post[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [deleting, setDeleting] = useState(false);

  const filtered =
    filter === "all" ? posts : posts.filter((p) => p.status === filter);

  const target = posts.find((p) => p.id === deleteId);

  const handleDelete = async () => {
    if (!deleteId || !target) return;
    if (target.status === "approved" && confirmTitle !== target.title) return;
    setDeleting(true);
    try {
      await deletePost(deleteId);
      setDeleteId(null);
      setConfirmTitle("");
      window.location.reload();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["all", "draft", "approved", "rejected"] as Filter[]).map((f) => (
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
              {f === "approved" ? "published" : f}
            </button>
          ))}
        </div>
        <Link href="/admin/blog/new" className="btn-primary text-sm">
          New post
        </Link>
      </div>

      <div className="admin-card divide-y" style={{ borderColor: tokens.line }}>
        {filtered.length === 0 ? (
          <p className="p-6 text-sm" style={{ color: tokens.inkDim }}>
            No posts in this filter.
          </p>
        ) : (
          filtered.map((post) => (
            <div
              key={post.id}
              className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="admin-mono rounded px-1.5 py-0.5 text-[9px]"
                    style={{
                      background:
                        post.status === "approved"
                          ? tokens.accentFaint
                          : post.status === "rejected"
                            ? "rgba(255,255,255,0.06)"
                            : "rgba(245,158,11,0.15)",
                      color:
                        post.status === "approved"
                          ? tokens.accent
                          : post.status === "rejected"
                            ? tokens.inkFaint
                            : tokens.amber,
                    }}
                  >
                    {post.status === "approved"
                      ? "PUBLISHED"
                      : post.status.toUpperCase()}
                  </span>
                  <span className="font-medium">{post.title}</span>
                </div>
                <p className="mt-1 font-mono text-xs" style={{ color: tokens.inkFaint }}>
                  /blog/{post.slug}
                </p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/blog/${post.id}/edit`} className="btn-ghost text-xs">
                  Edit
                </Link>
                <button
                  type="button"
                  className="btn-ghost text-xs"
                  style={{ color: tokens.red }}
                  onClick={() => {
                    setDeleteId(post.id);
                    setConfirmTitle("");
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {deleteId && target && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
        >
          <div className="admin-card max-w-md p-6">
            <h3 className="mb-2 font-semibold">Delete post?</h3>
            <p className="mb-4 text-sm" style={{ color: tokens.inkDim }}>
              {target.status === "approved"
                ? `Type "${target.title}" to confirm deletion of a published post.`
                : "This cannot be undone."}
            </p>
            {target.status === "approved" && (
              <input
                className="admin-input mb-4"
                value={confirmTitle}
                onChange={(e) => setConfirmTitle(e.target.value)}
                placeholder={target.title}
              />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                className="btn-ghost flex-1"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary flex-1"
                style={{ background: tokens.red }}
                disabled={
                  deleting ||
                  (target.status === "approved" && confirmTitle !== target.title)
                }
                onClick={handleDelete}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
