"use client";

import { useMemo } from "react";
import { analyzeSeo, seoStatusLabel } from "@/lib/content/seo";
import { tokens } from "@/lib/admin/tokens";

type Props = {
  title: string;
  description: string;
  slug: string;
  content: string;
  appUrl?: string;
};

function MetricRow({
  label,
  value,
  status,
  hint,
}: {
  label: string;
  value: string;
  status?: "good" | "short" | "long" | "bad";
  hint?: string;
}) {
  const statusColor =
    status === "good"
      ? tokens.accent
      : status === "bad"
        ? tokens.red
        : tokens.amber;

  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b" style={{ borderColor: tokens.line }}>
      <div>
        <p className="text-xs font-medium" style={{ color: tokens.inkDim }}>
          {label}
        </p>
        {hint && (
          <p className="text-[10px] mt-0.5" style={{ color: tokens.inkFaint }}>
            {hint}
          </p>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-mono" style={{ color: tokens.ink }}>
          {value}
        </p>
        {status && (
          <p className="text-[10px] font-medium" style={{ color: statusColor }}>
            {status === "bad" ? "Invalid" : seoStatusLabel(status)}
          </p>
        )}
      </div>
    </div>
  );
}

export function SeoPanel({ title, description, slug, content, appUrl }: Props) {
  const analysis = useMemo(
    () => analyzeSeo({ title, description, slug, content }),
    [title, description, slug, content]
  );

  const baseUrl = appUrl ?? (typeof window !== "undefined" ? window.location.origin : "");
  const canonicalUrl = slug ? `${baseUrl}/blog/${slug}` : "";

  const scoreColor =
    analysis.score >= 80
      ? tokens.accent
      : analysis.score >= 60
        ? tokens.amber
        : tokens.red;

  return (
    <div className="space-y-4">
      <div
        className="rounded-lg border p-4"
        style={{ borderColor: tokens.line, background: tokens.surfaceRaised }}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs uppercase tracking-wider font-semibold" style={{ color: tokens.inkDim }}>
            SEO health
          </h4>
          <span
            className="text-2xl font-bold font-mono"
            style={{ color: scoreColor }}
          >
            {analysis.score}
          </span>
        </div>

        <MetricRow
          label="Title"
          value={`${analysis.titleLength} chars`}
          status={analysis.titleStatus}
          hint="30–65 chars"
        />
        <MetricRow
          label="Meta description"
          value={`${analysis.descriptionLength} chars`}
          status={analysis.descriptionStatus}
          hint="120–165 chars"
        />
        <MetricRow
          label="Slug"
          value={slug || "—"}
          status={analysis.slugValid ? "good" : "bad"}
        />
        <MetricRow
          label="Word count"
          value={`${analysis.wordCount}`}
          status={analysis.wordCount >= 800 ? "good" : analysis.wordCount >= 600 ? "short" : "short"}
          hint="800+ ideal"
        />
        <MetricRow
          label="Reading time"
          value={`${analysis.readingTime} min`}
        />
        <MetricRow
          label="Section headings"
          value={`${analysis.headingCount}`}
          status={analysis.headingCount >= 2 ? "good" : "short"}
        />
      </div>

      <div
        className="rounded-lg border p-4 space-y-3"
        style={{ borderColor: tokens.line, background: tokens.surfaceRaised }}
      >
        <h4 className="text-xs uppercase tracking-wider font-semibold" style={{ color: tokens.inkDim }}>
          Search preview
        </h4>
        <div className="space-y-1">
          <p className="text-[#8ab4f8] text-base leading-snug line-clamp-2">
            {title || "Post title"}
          </p>
          <p className="text-[#7AF7E5] text-xs font-mono truncate">
            {canonicalUrl || "yoursite.com/blog/slug"}
          </p>
          <p className="text-[#B8C0C8] text-sm leading-relaxed line-clamp-3">
            {description || "Meta description appears here in search results."}
          </p>
        </div>
      </div>

      {(analysis.issues.length > 0 || analysis.suggestions.length > 0) && (
        <div className="space-y-3">
          {analysis.issues.length > 0 && (
            <div
              className="rounded-lg border p-3"
              style={{ borderColor: tokens.red, background: tokens.redFaint }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: tokens.red }}>
                Issues
              </p>
              <ul className="text-xs space-y-1 list-disc pl-4" style={{ color: tokens.inkDim }}>
                {analysis.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          {analysis.suggestions.length > 0 && (
            <div
              className="rounded-lg border p-3"
              style={{ borderColor: tokens.amber, background: tokens.amberFaint }}
            >
              <p className="text-xs font-semibold mb-2" style={{ color: tokens.amber }}>
                Suggestions
              </p>
              <ul className="text-xs space-y-1 list-disc pl-4" style={{ color: tokens.inkDim }}>
                {analysis.suggestions.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
