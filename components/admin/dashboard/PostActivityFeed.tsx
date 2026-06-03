import Link from "next/link";
import { FileText } from "lucide-react";
import { tokens } from "@/lib/admin/tokens";
import { getPostExcerpt } from "@/lib/db/queries/posts";
import type { Post } from "@/db/schema";

function relativeTime(date: Date | null) {
  if (!date) return "-";
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString("en-GB", { month: "short", day: "numeric" });
}

function StatusBadge({ status }: { status: Post["status"] }) {
  const published = status === "approved";
  const rejected = status === "rejected";
  const className = published
    ? "admin-badge-success"
    : rejected
      ? "admin-badge-muted"
      : "admin-badge-warning";

  const label = published ? "Published" : rejected ? "Rejected" : "Draft";

  return <span className={`admin-badge ${className}`}>{label}</span>;
}

export function PostActivityFeed({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="admin-card flex flex-col items-center justify-center px-6 py-16 text-center">
        <div
          className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl"
          style={{ background: tokens.accentFaint, color: tokens.accent }}
        >
          <FileText size={28} strokeWidth={1.5} />
        </div>
        <p className="text-base font-medium" style={{ color: tokens.ink }}>
          No posts yet
        </p>
        <p className="mt-1.5 max-w-xs text-sm" style={{ color: tokens.inkDim }}>
          Create your first blog post to see activity here.
        </p>
        <Link href="/admin/blog/new" className="btn-primary mt-6 text-sm">
          New blog post
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-card overflow-hidden">
      <div className="admin-card-header">
        <p className="text-sm font-semibold" style={{ color: tokens.ink }}>
          Recent activity
        </p>
        <Link
          href="/admin/blog"
          className="text-xs font-medium transition-colors duration-150"
          style={{ color: tokens.accent }}
        >
          View all
        </Link>
      </div>
      <ul>
        {posts.map((post, i) => (
          <li
            key={post.id}
            className={i > 0 ? "admin-divider" : ""}
          >
            <Link
              href={`/admin/blog/${post.id}/edit`}
              className="flex items-start justify-between gap-4 px-5 py-4 transition-colors duration-150 hover:bg-[var(--admin-surface-hover)]"
              style={{ color: tokens.ink }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={post.status} />
                  <span className="truncate text-sm font-medium">{post.title}</span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed" style={{ color: tokens.inkFaint }}>
                  {getPostExcerpt(post)}
                </p>
              </div>
              <span
                className="admin-mono shrink-0 text-[11px] tabular-nums"
                style={{ color: tokens.inkFaint }}
              >
                {relativeTime(post.updatedAt ?? post.createdAt)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
