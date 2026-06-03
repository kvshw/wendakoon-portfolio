import { Resend } from "resend";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }
  return new Resend(apiKey);
}

export async function sendContentDraftCreatedEmail({
  title,
  reviewUrl,
}: {
  title: string;
  reviewUrl: string;
}) {
  const to = process.env.NOTIFY_TO_EMAIL;
  const from =
    process.env.NOTIFY_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!to) {
    console.warn("[notify] NOTIFY_TO_EMAIL not set; skipping email.");
    return;
  }

  const resend = getResend();
  const subject = `New AI Content Drafts Generated: ${title}`;
  const text = `New AI Content Drafts Generated: ${title}. Please log into your dashboard to review.\n\n${reviewUrl}`;

  await resend.emails.send({
    from,
    to,
    subject,
    text,
    html: `<p>New AI Content Drafts Generated: <strong>${escapeHtml(title)}</strong>. Please log into your dashboard to review.</p><p><a href="${escapeHtml(reviewUrl)}">Open review dashboard</a></p>`,
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
