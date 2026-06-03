"use client";

import { useRef } from "react";
import { Arrow } from "./Arrow";

export const MagneticButton = ({ children, primary, onClick, href, className = "", ...rest }) => {
  const ref = useRef(null);
  const onMove = (e) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  const Tag = href ? "a" : "button";
  return (
    <Tag
      ref={ref}
      className={`btn ${primary ? "primary" : ""}${className ? ` ${className}` : ""}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onTouchStart={onLeave}
      onClick={onClick}
      href={href}
      {...rest}
    >
      {children}
      <Arrow />
    </Tag>
  );
};
