/**
 * Sends a test notification email using the same code path the AI
 * blog generator uses, so you can confirm delivery works.
 *
 * Run from the project root:
 *   npx tsx --env-file=.env.local scripts/test-notify-email.ts
 *
 * Requires RESEND_API_KEY and NOTIFY_TO_EMAIL in your .env.local.
 */

import { sendContentDraftCreatedEmail, getAppBaseUrl } from "@/lib/notify/email";

async function main() {
  const to = process.env.NOTIFY_TO_EMAIL;
  const from = process.env.NOTIFY_FROM_EMAIL ?? "onboarding@resend.dev";
  const appUrl = getAppBaseUrl();

  console.log(`Sending test notification…`);
  console.log(`  from: ${from}`);
  console.log(`  to:   ${to ?? "(NOT SET)"}`);
  console.log(`  link base: ${appUrl}`);

  await sendContentDraftCreatedEmail({
    title: "Governed Adaptive Clinical AI: From Theory to Runnable Guardrails",
    reviewUrl: `${appUrl}/admin/content-engine`,
    summary:
      "A walkthrough of how constrained adaptation turns clinical AI safety from a static checklist into something you can actually run and audit in production.",
    excerpt:
      "A walkthrough of how constrained adaptation turns clinical AI safety from a static checklist into something you can actually run and audit in production.",
    tags: ["Clinical AI", "Governance", "Research"],
    coverImage: null,
    linkedinCount: 3,
  });

  console.log("✅  Email request sent. Check your inbox (and spam folder).");
}

main().catch((err) => {
  console.error("❌  Failed to send test email:", err);
  process.exit(1);
});
