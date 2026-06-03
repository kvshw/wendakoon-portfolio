"use client";

import { useEffect, useRef } from "react";

export const ScrollProgress = () => {
  const ref = useRef(null);
  useEffect(() => {
    const fn = () => {
      const h = document.documentElement;
      const s = h.scrollTop || document.body.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      if (ref.current) ref.current.style.width = `${(s / Math.max(1, max)) * 100}%`;
    };
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return <div className="scroll-progress" ref={ref} />;
};
