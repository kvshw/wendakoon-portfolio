import "./admin.css";
import { AdminShell } from "@/components/admin/AdminShell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root min-h-screen font-sans text-[var(--admin-ink)]">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
