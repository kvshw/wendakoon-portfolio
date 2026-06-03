"use client";

import { useEffect, useRef, useState } from "react";

export const Reveal = ({ children, delay = 0, as = "div", className = "", ...rest }) => {
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const [shown, setShown] = useState(false);
  const blur = useRef(
    typeof window !== "undefined" &&
    !window.matchMedia("(max-width: 720px)").matches
  ).current;

  useEffect(() => {
    setReady(true);
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as;
  const EASE = "cubic-bezier(.21,.6,.18,1)";
  const hidden = ready && !shown;
  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        ...(rest.style || {}),
        opacity: hidden ? 0 : 1,
        transform: hidden ? "translateY(22px)" : "translateY(0)",
        filter: hidden ? (blur ? "blur(6px)" : "none") : "none",
        transition: ready
          ? `opacity 0.8s ${EASE} ${delay}ms, transform 0.9s ${EASE} ${delay}ms, filter 0.8s ${EASE} ${delay}ms`
          : undefined,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
};
