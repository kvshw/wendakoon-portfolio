import { Resend } from "resend";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }
  return new Resend(apiKey);
}

const CANONICAL_URL = "https://kavishwa.com";

/**
 * Resolves the public base URL for links in emails. A localhost URL is
 * useless in an inbox, so we prefer a real production domain whenever one
 * is available and only fall back to localhost as a last resort.
 */
export function getAppBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (explicit && !explicit.includes("localhost")) return explicit;

  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercelProd) return `https://${vercelProd.replace(/\/$/, "")}`;

  return CANONICAL_URL;
}

export type ContentDraftEmail = {
  title: string;
  reviewUrl: string;
  summary?: string | null;
  excerpt?: string | null;
  tags?: string[] | null;
  coverImage?: string | null;
  linkedinCount?: number;
};

export async function sendContentDraftCreatedEmail({
  title,
  reviewUrl,
  summary,
  excerpt,
  tags,
  coverImage,
  linkedinCount = 0,
}: ContentDraftEmail) {
  const to = process.env.NOTIFY_TO_EMAIL;
  const from = process.env.NOTIFY_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!to) {
    console.warn("[notify] NOTIFY_TO_EMAIL not set; skipping email.");
    return;
  }

  const resend = getResend();
  const blurb = (excerpt || summary || "").trim();
  const tagList = (tags ?? []).filter(Boolean);

  const subject = `New draft ready to review: ${title}`;

  const text = [
    `A new AI-generated blog draft is ready for your review.`,
    ``,
    `Title: ${title}`,
    blurb ? `\n${blurb}` : ``,
    tagList.length ? `\nTags: ${tagList.join(", ")}` : ``,
    linkedinCount
      ? `\nIncludes ${linkedinCount} LinkedIn variation${linkedinCount === 1 ? "" : "s"}.`
      : ``,
    ``,
    `Review it here: ${reviewUrl}`,
  ]
    .filter((line) => line !== ``)
    .join("\n");

  await resend.emails.send({
    from,
    to,
    subject,
    text,
    html: renderHtml({ title, reviewUrl, blurb, tagList, coverImage, linkedinCount }),
  });
}

function renderHtml({
  title,
  reviewUrl,
  blurb,
  tagList,
  coverImage,
  linkedinCount,
}: {
  title: string;
  reviewUrl: string;
  blurb: string;
  tagList: string[];
  coverImage?: string | null;
  linkedinCount: number;
}): string {
  const fontStack =
    "'Space Grotesk',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

  const tagPills = tagList
    .map(
      (t) =>
        `<span style="display:inline-block;background:rgba(40,189,174,0.12);color:#7AF7E5;font-size:12px;font-weight:600;letter-spacing:0.02em;padding:5px 11px;border-radius:999px;margin:0 6px 6px 0;border:1px solid rgba(40,189,174,0.25);">${escapeHtml(
          t
        )}</span>`
    )
    .join("");

  const cover = coverImage
    ? `<tr><td style="padding:0 0 28px;"><img src="${escapeHtml(
        coverImage
      )}" alt="" width="100%" style="display:block;width:100%;max-width:536px;border-radius:14px;border:1px solid #1f2a30;" /></td></tr>`
    : "";

  const linkedinNote = linkedinCount
    ? `<p style="margin:18px 0 0;color:#62696F;font-size:13px;line-height:1.6;">Includes <span style="color:#B8C0C8;">${linkedinCount} LinkedIn variation${
        linkedinCount === 1 ? "" : "s"
      }</span> to review.</p>`
    : "";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#0A0D10;font-family:${fontStack};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A0D10;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#11171B;border-radius:18px;overflow:hidden;border:1px solid #1b242a;">
            <tr>
              <td style="padding:26px 32px 22px;border-bottom:1px solid #1b242a;">
                <div style="color:#28BDAE;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Content Engine</div>
                <div style="color:#F5F6F7;font-size:16px;font-weight:600;margin-top:6px;letter-spacing:-0.01em;">A new AI draft is ready for review</div>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${cover}
                  <tr>
                    <td>
                      <h1 style="margin:0 0 14px;color:#F5F6F7;font-size:25px;line-height:1.3;font-weight:700;letter-spacing:-0.02em;">${escapeHtml(
                        title
                      )}</h1>
                      ${
                        blurb
                          ? `<p style="margin:0 0 20px;color:#B8C0C8;font-size:15px;line-height:1.65;">${escapeHtml(
                              blurb
                            )}</p>`
                          : ""
                      }
                      ${tagPills ? `<div style="margin:0 0 28px;">${tagPills}</div>` : ""}
                      <a href="${escapeHtml(
                        reviewUrl
                      )}" style="display:inline-block;background:#28BDAE;background-image:linear-gradient(90deg,#28BDAE,#7AF7E5);color:#0A0D10;text-decoration:none;font-size:15px;font-weight:700;padding:13px 26px;border-radius:10px;letter-spacing:0.01em;">Review draft &rarr;</a>
                      ${linkedinNote}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 30px;">
                <p style="margin:0;color:#62696F;font-size:12px;line-height:1.65;border-top:1px solid #1b242a;padding-top:18px;">
                  This draft is unpublished. Review, edit, and approve it from your admin dashboard before it goes live.
                </p>
                <p style="margin:14px 0 0;color:#3f464c;font-size:11px;letter-spacing:0.04em;">KAVISHWA WENDAKOON &middot; DOCTORAL RESEARCHER &middot; SOFTWARE ENGINEER</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export type ContactSubmission = {
  name: string;
  email: string;
  context?: string | null;
  message: string;
};

/**
 * Notifies the site owner that a visitor submitted the contact form.
 * Reply-to is the visitor so the owner can respond directly.
 */
export async function sendContactNotificationToOwner(submission: ContactSubmission) {
  const to = process.env.NOTIFY_TO_EMAIL;
  const from = process.env.NOTIFY_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!to) {
    console.warn("[notify] NOTIFY_TO_EMAIL not set; skipping owner email.");
    return;
  }

  const resend = getResend();
  const { name, email, context, message } = submission;

  const subject = `New message from ${name}`;
  const text = [
    `New contact form submission.`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    context ? `Context: ${context}` : ``,
    ``,
    `Message:`,
    message,
  ]
    .filter((line) => line !== ``)
    .join("\n");

  await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject,
    text,
    html: renderOwnerHtml({ name, email, context, message }),
  });
}

/**
 * Sends the visitor a friendly confirmation that their message was received.
 * Reply-to points at the owner's real inbox.
 */
export async function sendContactAutoReply(submission: ContactSubmission) {
  const from = process.env.NOTIFY_FROM_EMAIL ?? "onboarding@resend.dev";
  const replyTo = process.env.NOTIFY_TO_EMAIL ?? undefined;
  const { name, email, message } = submission;

  const resend = getResend();
  const firstName = name.trim().split(/\s+/)[0] || "there";
  const subject = `Thanks for reaching out, I've got your message`;

  const text = [
    `Hi ${firstName},`,
    ``,
    `Thanks for getting in touch through kavishwa.com. Your message has landed and I read everything personally. Expect a reply within about 48 hours.`,
    ``,
    `For your records, here's what you sent:`,
    `"${message}"`,
    ``,
    `Kavishwa Wendakoon`,
    `Doctoral Researcher · Software Engineer`,
  ].join("\n");

  await resend.emails.send({
    from,
    to: email,
    replyTo,
    subject,
    text,
    html: renderAutoReplyHtml({ firstName, message }),
  });
}

function renderOwnerHtml({
  name,
  email,
  context,
  message,
}: {
  name: string;
  email: string;
  context?: string | null;
  message: string;
}): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:0.06em;width:90px;vertical-align:top;">${label}</td><td style="padding:6px 0;color:#111827;font-size:14px;">${value}</td></tr>`;

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr><td style="background:#0f172a;padding:20px 32px;">
            <span style="color:#5eead4;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">Contact Form</span>
            <div style="color:#ffffff;font-size:15px;font-weight:600;margin-top:4px;">New message from your website</div>
          </td></tr>
          <tr><td style="padding:28px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${row("Name", escapeHtml(name))}
              ${row("Email", `<a href="mailto:${escapeHtml(email)}" style="color:#0d9488;">${escapeHtml(email)}</a>`)}
              ${context ? row("Context", escapeHtml(context)) : ""}
            </table>
            <div style="margin-top:20px;padding:18px 20px;background:#f9fafb;border-radius:12px;border:1px solid #f0f1f3;color:#374151;font-size:15px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(
              message
            )}</div>
            <a href="mailto:${escapeHtml(
              email
            )}" style="display:inline-block;margin-top:22px;background:#0f766e;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:10px;">Reply to ${escapeHtml(
              name
            )}</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function renderAutoReplyHtml({
  firstName,
  message,
}: {
  firstName: string;
  message: string;
}): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
          <tr><td style="background:#0f172a;padding:24px 32px;">
            <div style="color:#ffffff;font-size:18px;font-weight:700;">Kavishwa Wendakoon</div>
            <div style="color:#94a3b8;font-size:13px;margin-top:2px;">Doctoral Researcher · Software Engineer</div>
          </td></tr>
          <tr><td style="padding:32px;">
            <p style="margin:0 0 16px;color:#111827;font-size:16px;line-height:1.6;">Hi ${escapeHtml(
              firstName
            )},</p>
            <p style="margin:0 0 16px;color:#4b5563;font-size:15px;line-height:1.7;">Thanks for getting in touch through <strong>kavishwa.com</strong>. Your message has landed safely and I read everything personally. You can expect a reply within about <strong>48 hours</strong>.</p>
            <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">For your records, here's what you sent:</p>
            <div style="padding:16px 18px;background:#f9fafb;border-left:3px solid #0d9488;border-radius:8px;color:#374151;font-size:14px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(
              message
            )}</div>
            <p style="margin:24px 0 0;color:#4b5563;font-size:15px;line-height:1.7;">Talk soon,<br/><strong style="color:#111827;">Kavishwa</strong></p>
          </td></tr>
          <tr><td style="padding:0 32px 28px;">
            <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;border-top:1px solid #f3f4f6;padding-top:16px;">You're receiving this because you submitted the contact form at kavishwa.com. If that wasn't you, you can safely ignore this email.</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
