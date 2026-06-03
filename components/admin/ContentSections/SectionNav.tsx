"use client";

import {
  Home,
  Compass,
  Users,
  FlaskConical,
  Target,
  Route,
  FolderKanban,
  BookOpen,
  Briefcase,
  Mail,
} from "lucide-react";
import { tokens } from "@/lib/admin/tokens";
import { SECTION_LABELS } from "@/lib/content/section-defaults";

const ICONS: Record<string, React.ComponentType<{ size?: number }>> = {
  hero: Home,
  orientation: Compass,
  perspectives: Users,
  research: FlaskConical,
  focus: Target,
  journey: Route,
  projects: FolderKanban,
  publications: BookOpen,
  experience: Briefcase,
  contact: Mail,
};

type Props = {
  active: string;
  onSelect: (section: string) => void;
  dirty: Set<string>;
};

export function SectionNav({ active, onSelect, dirty }: Props) {
  return (
    <nav className="w-full shrink-0 space-y-0.5 lg:w-52">
      {Object.keys(SECTION_LABELS).map((id) => {
        const Icon = ICONS[id] ?? Home;
        const isActive = active === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm transition-all duration-150"
            style={{
              color: isActive ? tokens.accent : tokens.inkDim,
              background: isActive ? tokens.accentFaint : "transparent",
              borderLeft: isActive
                ? `2px solid ${tokens.accent}`
                : "2px solid transparent",
            }}
          >
            <Icon size={16} />
            <span className="flex-1">{SECTION_LABELS[id]}</span>
            {dirty.has(id) && (
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: tokens.amber }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
