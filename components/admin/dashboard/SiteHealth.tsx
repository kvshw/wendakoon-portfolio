"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, AlertCircle, ChevronDown } from "lucide-react";
import { tokens } from "@/lib/admin/tokens";
import { markHealthReviewed } from "@/lib/content/health-actions";

export type HealthItem = {
  id: string;
  label: string;
  ok: boolean;
  detail: string;
  reviewedAt: string | null;
};

export function SiteHealth({ items: initial }: { items: HealthItem[] }) {
  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(true);
  const [pending, startTransition] = useTransition();

  const okCount = items.filter((i) => i.ok).length;

  const markReviewed = (id: string) => {
    startTransition(async () => {
      const at = await markHealthReviewed(id);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ok: true, reviewedAt: at } : item
        )
      );
    });
  };

  return (
    <div className="admin-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="admin-card-header w-full transition-colors duration-150"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = tokens.surfaceHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <div className="text-left">
          <p className="text-sm font-semibold" style={{ color: tokens.ink }}>
            Site health
          </p>
          <p className="mt-0.5 text-xs" style={{ color: tokens.inkFaint }}>
            {okCount} of {items.length} checks passing
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="hidden h-1.5 w-24 overflow-hidden rounded-full sm:block"
            style={{ background: tokens.surfaceHover }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(okCount / items.length) * 100}%`,
                background: okCount === items.length ? tokens.accent : tokens.amber,
              }}
            />
          </div>
          <ChevronDown
            size={18}
            className="transition-transform duration-200"
            style={{
              color: tokens.inkFaint,
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
            }}
          />
        </div>
      </button>

      {open && (
        <ul>
          {items.map((item, i) => (
            <li
              key={item.id}
              className={`flex flex-wrap items-center justify-between gap-4 px-5 py-4 ${i > 0 ? "admin-divider" : "border-t"}`}
              style={i === 0 ? { borderColor: tokens.line } : undefined}
            >
              <div className="flex items-start gap-3">
                {item.ok ? (
                  <CheckCircle2
                    size={20}
                    className="shrink-0"
                    style={{ color: tokens.accent }}
                  />
                ) : (
                  <AlertCircle
                    size={20}
                    className="shrink-0"
                    style={{ color: tokens.amber }}
                  />
                )}
                <div>
                  <p className="text-sm font-medium" style={{ color: tokens.ink }}>
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed" style={{ color: tokens.inkFaint }}>
                    {item.detail}
                    {item.reviewedAt && ` · Reviewed ${item.reviewedAt}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() => markReviewed(item.id)}
                className="btn-ghost shrink-0 text-xs"
              >
                Mark reviewed
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
