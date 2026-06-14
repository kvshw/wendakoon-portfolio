"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { generateContentNow } from "@/lib/content/actions";
import { tokens } from "@/lib/admin/tokens";

export function GenerateNowButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    setMessage(null);
    setError(null);
    setMessage("Fetching AI news and drafting content. This may take a minute…");

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

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={handleGenerate}
        disabled={pending}
        className="btn-primary inline-flex items-center gap-2 text-sm disabled:opacity-60"
      >
        <Sparkles size={16} className={pending ? "animate-pulse" : undefined} />
        {pending ? "Generating…" : "Generate now"}
      </button>
      {message && !error && (
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
