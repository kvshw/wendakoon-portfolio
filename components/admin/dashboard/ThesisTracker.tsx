"use client";

import { useEffect, useState } from "react";
import { tokens } from "@/lib/admin/tokens";

export type ThesisPaper = {
  id: string;
  title: string;
  subtitle: string;
  status: "accepted" | "in_progress" | "planned";
};

const DEFAULT_PAPERS: ThesisPaper[] = [
  {
    id: "I",
    title: "Paper I",
    subtitle: "SLR · Self-adaptive AI in CDSS",
    status: "accepted",
  },
  {
    id: "II",
    title: "Paper II",
    subtitle: "DSR Architecture · Safety-Constrained CDSS",
    status: "accepted",
  },
  {
    id: "III",
    title: "Paper III",
    subtitle: "Prototype + Simulation",
    status: "in_progress",
  },
  {
    id: "IV",
    title: "Paper IV",
    subtitle: "Mixed-Methods Clinician Study",
    status: "planned",
  },
];

const STATUS_CONFIG = {
  accepted: { label: "Accepted", className: "admin-badge-success" },
  in_progress: { label: "In progress", className: "admin-badge-warning" },
  planned: { label: "Planned", className: "admin-badge-muted" },
};

export function ThesisTracker({ papers = DEFAULT_PAPERS }: { papers?: ThesisPaper[] }) {
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 50);
    return () => clearTimeout(t);
  }, []);

  const acceptedCount = papers.filter((p) => p.status === "accepted").length;

  return (
    <div className="admin-card overflow-hidden">
      <div className="admin-card-header">
        <div>
          <p className="text-sm font-semibold" style={{ color: tokens.ink }}>
            Thesis progress
          </p>
          <p className="mt-0.5 text-xs" style={{ color: tokens.inkFaint }}>
            {acceptedCount} of {papers.length} papers accepted
          </p>
        </div>
      </div>
      <div className="space-y-0 p-2">
        {papers.map((paper, index) => {
          const config = STATUS_CONFIG[paper.status];
          const isLast = index === papers.length - 1;

          return (
            <div
              key={paper.id}
              className={`relative flex gap-4 rounded-lg px-4 py-4 ${!isLast ? "" : ""}`}
            >
              {!isLast && (
                <div
                  className="absolute bottom-0 left-[2.125rem] top-12 w-px"
                  style={{
                    background: tokens.line,
                    transform: drawn ? "scaleY(1)" : "scaleY(0)",
                    transformOrigin: "top",
                    transition: `transform 500ms ease ${index * 100}ms`,
                  }}
                  aria-hidden
                />
              )}

              <div
                className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  background:
                    paper.status === "accepted"
                      ? tokens.accentFaint
                      : paper.status === "in_progress"
                        ? tokens.amberFaint
                        : tokens.surfaceHover,
                  color:
                    paper.status === "accepted"
                      ? tokens.accent
                      : paper.status === "in_progress"
                        ? tokens.amber
                        : tokens.inkFaint,
                  border: `1px solid ${
                    paper.status === "accepted"
                      ? "rgba(40, 189, 174, 0.3)"
                      : paper.status === "in_progress"
                        ? "rgba(245, 158, 11, 0.3)"
                        : tokens.lineStrong
                  }`,
                }}
              >
                {paper.id}
              </div>

              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium" style={{ color: tokens.ink }}>
                      {paper.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed" style={{ color: tokens.inkDim }}>
                      {paper.subtitle}
                    </p>
                  </div>
                  <span className={`admin-badge shrink-0 ${config.className}`}>
                    {config.label}
                  </span>
                </div>

                {paper.status === "in_progress" && (
                  <div
                    className="mt-3 h-1 overflow-hidden rounded-full"
                    style={{ background: tokens.surfaceHover }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: drawn ? "45%" : "0%",
                        background: `linear-gradient(90deg, ${tokens.accent}, ${tokens.accentBright})`,
                        transitionDelay: `${index * 100 + 200}ms`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
