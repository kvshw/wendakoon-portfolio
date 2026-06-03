"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1279px)");
    const update = () => {
      setNarrow(mq.matches);
      if (mq.matches) setCollapsed(true);
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--admin-bg)", color: "var(--admin-ink)" }}
    >
      <Sidebar
        collapsed={collapsed || narrow}
        onToggle={() => setCollapsed((c) => !c)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="admin-main-bg admin-fade-in flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
