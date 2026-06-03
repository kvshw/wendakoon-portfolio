/** Inlined so /links layout works even if the CSS chunk fails to load in dev. */
export const LINKS_CRITICAL_CSS = `
body:has(.lh-root){margin:0;background:#0a0d10;color:#f5f6f7;overflow-x:hidden}
body:has(.lh-root) .mouse-glow{display:none!important}
.lh-root{min-height:100dvh;min-height:100svh}
.lh{position:relative;min-height:100dvh;padding:max(20px,env(safe-area-inset-top)) 16px max(28px,env(safe-area-inset-bottom));background:#0a0d10;color:#f5f6f7;font-family:var(--font-space-grotesk,"Space Grotesk",system-ui,sans-serif);font-size:16px;line-height:1.5}
.lh *,.lh *::before,.lh *::after{box-sizing:border-box}
.lh-inner{position:relative;z-index:1;width:100%;max-width:400px;margin:0 auto;display:flex;flex-direction:column;gap:28px;align-items:stretch}
.lh-header{display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center}
.lh-logo__img{height:32px;width:auto;max-width:100%}
.lh-profile{display:flex;flex-direction:column;align-items:center;text-align:center;gap:12px;width:100%}
.lh-avatar{position:relative;width:128px;height:160px;flex-shrink:0;overflow:hidden;border:1px solid rgba(255,255,255,.2);background:#11171b}
.lh-avatar__img{display:block;width:128px;height:160px;max-width:128px;max-height:160px;object-fit:cover;object-position:center top}
.lh-name{margin:8px 0 0;font-family:var(--font-anton,"Anton",Impact,sans-serif);font-size:clamp(2rem,10vw,2.75rem);font-weight:400;line-height:.92;letter-spacing:-.02em;text-transform:uppercase}
.lh-name__line{display:block}
.lh-name__accent{color:#28bdae}
.lh-name__line--outline{-webkit-text-stroke:1.5px #f5f6f7;color:transparent}
.lh-role{margin:0;font-size:15px;font-weight:500;color:#b8c0c8;max-width:26ch}
.lh-bio{margin:0;font-size:14px;line-height:1.55;color:#62696f;max-width:30ch}
.lh-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px;width:100%}
.lh-btn{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-height:52px;padding:14px 18px;border:1px solid rgba(255,255,255,.2);border-radius:999px;background:transparent;color:#f5f6f7;font-family:var(--font-jetbrains-mono,"JetBrains Mono",monospace);font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;text-decoration:none}
.lh-btn--primary{background:#28bdae;border-color:#28bdae;color:#0a0d10}
.lh-btn__text{flex:1;min-width:0;display:flex;flex-direction:column;align-items:flex-start;gap:2px;text-align:left}
.lh-btn__sub{font-size:9px;letter-spacing:.06em;text-transform:none;color:#62696f}
.lh-btn--primary .lh-btn__sub{color:rgba(10,13,16,.65)}
.lh-footer{margin-top:8px;padding-top:28px;border-top:1px solid rgba(255,255,255,.1);overflow:hidden;width:100%}
.lh-footer__mega{margin:0 0 20px;font-family:var(--font-anton,"Anton",Impact,sans-serif);font-size:clamp(3.5rem,18vw,4.5rem);line-height:.85;text-transform:uppercase;text-align:center;color:rgba(255,255,255,.04)}
.lh-footer__grid{display:grid;grid-template-columns:1fr 1fr;gap:20px 16px;margin-bottom:24px}
.lh-footer__label{margin:0 0 10px;font-family:var(--font-jetbrains-mono,"JetBrains Mono",monospace);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:#62696f}
.lh-footer__text{margin:0;font-size:12px;line-height:1.65;color:#b8c0c8}
.lh-footer__bar{display:flex;flex-direction:column;align-items:center;gap:8px;padding-top:20px;border-top:1px solid rgba(255,255,255,.1);font-family:var(--font-jetbrains-mono,"JetBrains Mono",monospace);font-size:9px;letter-spacing:.12em;text-transform:uppercase;text-align:center;color:#62696f}
.lh-footer__tag{color:#b8c0c8;max-width:28ch;line-height:1.5}
`;
