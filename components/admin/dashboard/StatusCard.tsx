"use client";

import { BookOpen, FileText, Layers, Users } from "lucide-react";
import { useCountUp } from "@/lib/admin/hooks/useCountUp";
import { tokens } from "@/lib/admin/tokens";

const ICONS = {
  fileText: FileText,
  bookOpen: BookOpen,
  layers: Layers,
  users: Users,
} as const;

export type StatusCardIcon = keyof typeof ICONS;

type Props = {
  label: string;
  value: number;
  subtext: string;
  icon: StatusCardIcon;
};

export function StatusCard({ label, value, subtext, icon }: Props) {
  const Icon = ICONS[icon];
  const display = useCountUp(value);

  return (
    <div className="admin-stat-card">
      <div className="relative z-10 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className="text-3xl font-semibold tabular-nums tracking-tight"
            style={{ color: tokens.ink }}
          >
            {display}
          </p>
          <p className="mt-3 text-sm font-medium" style={{ color: tokens.ink }}>
            {label}
          </p>
          <p className="mt-1 text-xs leading-relaxed" style={{ color: tokens.inkFaint }}>
            {subtext}
          </p>
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{
            background: tokens.accentFaint,
            color: tokens.accent,
          }}
        >
          <Icon size={20} strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
