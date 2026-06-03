import { LinkHubTheme } from "@/components/LinkHubTheme";
import { LINKS_CRITICAL_CSS } from "./critical-css";
import "./links.css";

export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LinkHubTheme>
      <style dangerouslySetInnerHTML={{ __html: LINKS_CRITICAL_CSS }} />
      <div className="lh-root">{children}</div>
    </LinkHubTheme>
  );
}
