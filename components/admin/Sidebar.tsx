"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  Sparkles,
  FileText,
  Layers,
  BarChart3,
  Settings,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  Inbox,
} from "lucide-react";
import { useEffect, useState } from "react";
import { tokens } from "@/lib/admin/tokens";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
};

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/content-engine", label: "Content Engine", icon: Sparkles },
      { href: "/admin/blog", label: "Blog", icon: FileText },
      { href: "/admin/content", label: "Website Sections", icon: Layers },
    ],
  },
  {
    label: "Engage",
    items: [{ href: "/admin/messages", label: "Inbox", icon: Inbox }],
  },
  {
    label: "Insights",
    items: [
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

type Props = {
  collapsed: boolean;
  isMobile?: boolean;
  mobileOpen?: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
};

export function Sidebar({ collapsed, isMobile, mobileOpen, onToggle, onMobileClose }: Props) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleNavClick = () => {
    if (isMobile) onMobileClose?.();
  };

  if (isMobile) {
    return (
      <aside
        className="fixed left-0 top-0 z-50 flex h-full w-[252px] flex-col border-r transition-transform duration-250 ease-out"
        style={{
          borderColor: tokens.line,
          background: tokens.bg,
          boxShadow: "4px 0 32px rgba(0, 0, 0, 0.4)",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div
          className="flex items-center justify-between border-b px-4 py-5"
          style={{ borderColor: tokens.line }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold tracking-tight"
              style={{
                background: tokens.accentFaint,
                color: tokens.accent,
                border: `1px solid rgba(40, 189, 174, 0.25)`,
              }}
            >
              KW
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight" style={{ color: tokens.ink }}>
                Kavishwa Wendakoon
              </p>
              <p className="mt-0.5 text-[11px] font-medium" style={{ color: tokens.inkFaint }}>
                Portfolio CMS
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onMobileClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-150"
            style={{ color: tokens.inkFaint }}
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="2" y1="2" x2="14" y2="14" />
              <line x1="14" y1="2" x2="2" y2="14" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="admin-section-label mb-2 px-3">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href, item.exact);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavClick}
                      className={`admin-nav-item ${active ? "admin-nav-item-active" : ""}`}
                    >
                      <Icon size={18} className="shrink-0" strokeWidth={active ? 2.25 : 1.75} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="space-y-2 border-t p-3" style={{ borderColor: tokens.line }}>
          <div
            className="flex items-center gap-2 rounded-lg px-2 py-2"
            style={{ background: tokens.surface }}
          >
            <UserButton afterSignOutUrl="/" />
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => signOut({ redirectUrl: "/" })}
                className="flex w-full items-center gap-1.5 text-xs font-medium transition-colors duration-150"
                style={{ color: tokens.inkDim }}
                onMouseEnter={(e) => { e.currentTarget.style.color = tokens.ink; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = tokens.inkDim; }}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          </div>
          <p className="px-2 text-center text-[10px]" style={{ color: tokens.inkFaint }}>
            v2026.1
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="flex h-screen shrink-0 flex-col border-r transition-[width] duration-200 ease-out"
      style={{
        width: collapsed ? 72 : 252,
        borderColor: tokens.line,
        background: tokens.bg,
        boxShadow: "4px 0 24px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div
        className="flex items-center gap-3 border-b px-4 py-5"
        style={{ borderColor: tokens.line }}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold tracking-tight"
          style={{
            background: tokens.accentFaint,
            color: tokens.accent,
            border: `1px solid rgba(40, 189, 174, 0.25)`,
          }}
        >
          KW
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-tight" style={{ color: tokens.ink }}>
              Kavishwa Wendakoon
            </p>
            <p className="mt-0.5 text-[11px] font-medium" style={{ color: tokens.inkFaint }}>
              Portfolio CMS
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p
                className="admin-section-label mb-2 px-3"
                style={{ opacity: mounted ? 1 : 0 }}
              >
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`admin-nav-item ${active ? "admin-nav-item-active" : ""}`}
                    style={{ opacity: mounted ? 1 : 0 }}
                  >
                    <Icon size={18} className="shrink-0" strokeWidth={active ? 2.25 : 1.75} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div
        className="space-y-2 border-t p-3"
        style={{ borderColor: tokens.line }}
      >
        <button
          type="button"
          onClick={onToggle}
          className="admin-nav-item w-full justify-center"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeft size={18} /> : <PanelLeftClose size={18} />}
          {!collapsed && (
            <span className="text-xs font-medium normal-case tracking-normal">Collapse</span>
          )}
        </button>

        <div
          className="flex items-center gap-2 rounded-lg px-2 py-2"
          style={{ background: tokens.surface }}
        >
          <UserButton afterSignOutUrl="/" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <button
                type="button"
                onClick={() => signOut({ redirectUrl: "/" })}
                className="flex w-full items-center gap-1.5 text-xs font-medium transition-colors duration-150"
                style={{ color: tokens.inkDim }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = tokens.ink;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = tokens.inkDim;
                }}
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>

        {!collapsed && (
          <p className="px-2 text-center text-[10px]" style={{ color: tokens.inkFaint }}>
            v2026.1
          </p>
        )}
      </div>
    </aside>
  );
}
