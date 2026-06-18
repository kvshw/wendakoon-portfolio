"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const mqNarrow = window.matchMedia("(max-width: 1279px)");
    const mqMobile = window.matchMedia("(max-width: 767px)");

    const update = () => {
      const mobile = mqMobile.matches;
      setNarrow(mqNarrow.matches);
      setIsMobile(mobile);
      if (mqNarrow.matches) setCollapsed(true);
      if (!mobile) setMobileOpen(false);
    };
    update();
    mqNarrow.addEventListener("change", update);
    mqMobile.addEventListener("change", update);
    return () => {
      mqNarrow.removeEventListener("change", update);
      mqMobile.removeEventListener("change", update);
    };
  }, []);

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--admin-bg)", color: "var(--admin-ink)" }}
    >
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <Sidebar
        collapsed={!isMobile && (collapsed || narrow)}
        isMobile={isMobile}
        mobileOpen={mobileOpen}
        onToggle={() => setCollapsed((c) => !c)}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onMobileMenuOpen={isMobile ? () => setMobileOpen(true) : undefined} />
        <main className="admin-main-bg admin-fade-in flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
