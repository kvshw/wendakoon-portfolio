import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { ContentSectionsEditor } from "@/components/admin/ContentSections/ContentSectionsEditor";
import { PageHeader } from "@/components/admin/PageHeader";

export default async function AdminContentPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Website sections"
        description="Edit portfolio copy stored in the database"
      />
      <Suspense
        fallback={
          <p className="text-sm" style={{ color: "var(--admin-ink-dim)" }}>
            Loading editor…
          </p>
        }
      >
        <ContentSectionsEditor />
      </Suspense>
    </div>
  );
}
