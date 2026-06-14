import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="auth-page">
      <div className="hero-orb o1" aria-hidden="true" />
      <div className="hero-orb o2" aria-hidden="true" />
      <div className="grid-lines" aria-hidden="true" />
      <div className="auth-page__card">{children}</div>
    </div>
  );
}
