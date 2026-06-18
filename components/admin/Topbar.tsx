"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ExternalLink, Menu } from "lucide-react";
import { useClock } from "@/lib/admin/hooks/useClock";
import { tokens } from "@/lib/admin/tokens";

const LABELS: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/content-engine": "Content Engine",
  "/admin/blog": "Blog",
  "/admin/content": "Website Sections",
  "/admin/analytics": "Analytics",
  "/admin/settings": "Settings",
};

function getBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  const crumbs: { label: string; href?: string }[] = [
    { label: "Admin", href: "/admin" },
  ];

  if (pathname === "/admin") {
    crumbs.push({ label: "Dashboard" });
    return crumbs;
  }

  if (pathname.startsWith("/admin/blog/new")) {
    crumbs.push({ label: "Blog", href: "/admin/blog" }, { label: "New post" });
    return crumbs;
  }

  if (pathname.match(/\/admin\/blog\/[^/]+\/edit/)) {
    crumbs.push({ label: "Blog", href: "/admin/blog" }, { label: "Edit post" });
    return crumbs;
  }

  for (const [path, label] of Object.entries(LABELS)) {
    if (path !== "/admin" && (pathname === path || pathname.startsWith(`${path}/`))) {
      crumbs.push({ label });
      return crumbs;
    }
  }

  crumbs.push({ label: "Admin" });
  return crumbs;
}

type TopbarProps = {
  onMobileMenuOpen?: () => void;
};

export function Topbar({ onMobileMenuOpen }: TopbarProps) {
  const pathname = usePathname();
  const time = useClock();
  const crumbs = getBreadcrumbs(pathname);

  return (
    <header
      className="sticky top-0 z-20 flex h-[3.25rem] shrink-0 items-center justify-between border-b px-4 backdrop-blur-md sm:px-6 lg:px-8"
      style={{
        borderColor: tokens.line,
        background: "rgba(8, 11, 14, 0.85)",
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        {onMobileMenuOpen && (
          <button
            type="button"
            onClick={onMobileMenuOpen}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-150"
            style={{ color: tokens.inkDim }}
            aria-label="Open navigation menu"
          >
            <Menu size={18} />
          </button>
        )}
        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <span key={`${crumb.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
                {i > 0 && (
                  <ChevronRight
                    size={14}
                    className="shrink-0"
                    style={{ color: tokens.inkFaint }}
                    aria-hidden
                  />
                )}
                {crumb.href && !isLast ? (
                  <Link
                    href={crumb.href}
                    className="truncate font-medium transition-colors duration-150 hover:underline"
                    style={{ color: tokens.inkDim }}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    className="truncate font-medium"
                    style={{ color: isLast ? tokens.ink : tokens.inkDim }}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {crumb.label}
                  </span>
                )}
              </span>
            );
          })}
        </nav>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 text-xs font-medium transition-colors duration-150 hover:text-[var(--admin-accent)] sm:flex"
          style={{ color: tokens.inkDim }}
        >
          View site
          <ExternalLink size={12} />
        </Link>

        <div
          className="flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium"
          style={{
            borderColor: tokens.lineStrong,
            background: tokens.surface,
            color: tokens.inkDim,
          }}
        >
          <span
            className="relative flex h-2 w-2"
            aria-hidden
          >
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40"
              style={{ background: tokens.accent }}
            />
            <span
              className="relative inline-flex h-2 w-2 rounded-full"
              style={{ background: tokens.accent }}
            />
          </span>
          <span className="admin-mono tabular-nums">{time}</span>
        </div>
      </div>
    </header>
  );
}
