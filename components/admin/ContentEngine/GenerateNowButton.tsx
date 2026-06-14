"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { generateContentNow } from "@/lib/content/actions";
import { tokens } from "@/lib/admin/tokens";

const GENERATION_STEPS = [
  "Fetching AI news and trending topics…",
  "Drafting blog post and LinkedIn variants…",
  "Generating cover image…",
  "Saving draft to your queue…",
] as const;

export function GenerateNowButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [stepIndex, setStepIndex] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pending) return;

    setStepIndex(0);
    const interval = window.setInterval(() => {
      setStepIndex((current) =>
        current < GENERATION_STEPS.length - 1 ? current + 1 : current
      );
    }, 12000);

    return () => window.clearInterval(interval);
  }, [pending]);

  const handleGenerate = () => {
    setMessage(null);
    setError(null);
    setStepIndex(0);

    startTransition(async () => {
      try {
        const result = await generateContentNow();
        setMessage(`Draft created: ${result.title}`);
        router.push(
          `/admin/content-engine?status=draft&post=${result.postId}`
        );
        router.refresh();
      } catch (err) {
        setMessage(null);
        setError(
          err instanceof Error ? err.message : "Generation failed. Try again."
        );
      }
    });
  };

  const progress =
    pending && !error
      ? Math.min(
          95,
          Math.round(((stepIndex + 1) / GENERATION_STEPS.length) * 100)
        )
      : 0;

  return (
    <div className="flex flex-col items-end gap-2 w-full max-w-xs">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={pending}
        className="btn-primary inline-flex items-center gap-2 text-sm disabled:opacity-60"
      >
        <Sparkles size={16} className={pending ? "animate-pulse" : undefined} />
        {pending ? "Generating…" : "Generate now"}
      </button>
      {pending && !error && (
        <div className="w-full space-y-2">
          <div
            className="h-1.5 w-full overflow-hidden rounded-full"
            style={{ background: tokens.surfaceHover }}
          >
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                background: tokens.accent,
              }}
            />
          </div>
          <p className="text-xs text-right" style={{ color: tokens.accent }}>
            {GENERATION_STEPS[stepIndex]}
          </p>
          <p className="text-[10px] text-right" style={{ color: tokens.inkFaint }}>
            Keep this tab open. Generation usually takes 1–3 minutes.
          </p>
        </div>
      )}
      {message && !error && !pending && (
        <p className="text-xs max-w-xs text-right" style={{ color: tokens.accent }}>
          {message}
        </p>
      )}
      {error && (
        <p className="text-xs max-w-xs text-right" style={{ color: tokens.red }}>
          {error}
        </p>
      )}
    </div>
  );
}
