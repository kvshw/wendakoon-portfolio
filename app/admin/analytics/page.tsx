import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { BarChart3 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { tokens } from "@/lib/admin/tokens";

export default async function AnalyticsPage() {
  await requireAdmin();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics"
        description="Visitor metrics and engagement once a provider is connected"
      />

      <div className="admin-card max-w-lg overflow-hidden">
        <div className="flex flex-col items-center px-8 py-14 text-center">
          <div
            className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl"
            style={{ background: tokens.accentFaint, color: tokens.accent }}
          >
            <BarChart3 size={28} strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-semibold" style={{ color: tokens.ink }}>
            Not connected
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-relaxed" style={{ color: tokens.inkDim }}>
            Connect Plausible, Vercel Analytics, or another provider to see visitor
            trends here. The dashboard shows a placeholder until then.
          </p>
          <Link href="/admin/settings" className="btn-ghost mt-6 text-sm">
            View settings
          </Link>
        </div>
      </div>
    </div>
  );
}
