import Link from "next/link";
import { ArrowRight, FilePlus, Pencil, Upload, Sparkles } from "lucide-react";
import { tokens } from "@/lib/admin/tokens";

const ACTIONS = [
  {
    href: "/admin/blog/new",
    label: "New blog post",
    description: "Draft or publish",
    icon: FilePlus,
  },
  {
    href: "/admin/content?section=hero",
    label: "Edit hero",
    description: "Homepage headline",
    icon: Pencil,
  },
  {
    href: "/admin/content?section=publications",
    label: "Publications",
    description: "Research output",
    icon: Upload,
  },
  {
    href: "/admin/content-engine",
    label: "Content engine",
    description: "AI-assisted drafts",
    icon: Sparkles,
  },
];

export function QuickActions() {
  return (
    <div className="admin-card overflow-hidden">
      <div className="admin-card-header">
        <p className="text-sm font-semibold" style={{ color: tokens.ink }}>
          Quick actions
        </p>
      </div>
      <div className="space-y-1 p-2">
        {ACTIONS.map(({ href, label, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-150 hover:bg-[var(--admin-surface-hover)]"
            style={{ color: tokens.ink }}
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-150"
              style={{
                background: tokens.accentFaint,
                color: tokens.accent,
              }}
            >
              <Icon size={16} strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs" style={{ color: tokens.inkFaint }}>
                {description}
              </p>
            </div>
            <ArrowRight
              size={16}
              className="shrink-0 opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100"
              style={{ color: tokens.accent }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
