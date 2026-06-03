export const Arrow = ({ size = 14, className = "" }) => (
  <svg className={`arrow ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 19L19 5" />
    <path d="M8 5h11v11" />
  </svg>
);

export const ArrowDown = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14" />
    <path d="M5 12l7 7 7-7" />
  </svg>
);
