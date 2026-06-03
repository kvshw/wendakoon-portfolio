"use client";

import { useEffect } from "react";

/** Keep /links on dark theme even when the main site is in light mode. */
export function LinkHubTheme({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.getAttribute("data-theme");
    root.setAttribute("data-theme", "dark");
    document.body.style.background = "#0a0d10";
    return () => {
      document.body.style.background = "";
      if (prev) root.setAttribute("data-theme", prev);
      else root.removeAttribute("data-theme");
    };
  }, []);

  return children;
}
