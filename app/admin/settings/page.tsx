import { requireAdmin } from "@/lib/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { tokens } from "@/lib/admin/tokens";

export default async function SettingsPage() {
  const { email } = await requireAdmin();

  const rows = [
    { label: "Signed in as", value: email },
    { label: "App URL", value: process.env.NEXT_PUBLIC_APP_URL ?? "Not set" },
    {
      label: "Database",
      value: process.env.DATABASE_URL ? "Configured" : "Not configured",
    },
    { label: "Admin allowlist", value: "ADMIN_EMAILS environment variable" },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Environment and access configuration for this admin workspace"
      />

      <div className="admin-card max-w-xl overflow-hidden">
        <div className="admin-card-header">
          <p className="text-sm font-semibold" style={{ color: tokens.ink }}>
            Configuration
          </p>
        </div>
        <dl className="divide-y" style={{ borderColor: tokens.line }}>
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >
              <dt className="admin-label mb-0">{row.label}</dt>
              <dd
                className="admin-mono text-sm sm:text-right"
                style={{ color: tokens.inkDim }}
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
