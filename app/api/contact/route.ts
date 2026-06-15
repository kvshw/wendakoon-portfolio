import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { contactMessages } from "@/db/schema";
import { requireDb } from "@/lib/db/drizzle";
import {
  sendContactNotificationToOwner,
  sendContactAutoReply,
} from "@/lib/notify/email";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("A valid email is required").max(200),
  context: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(5000),
  consent: z.boolean().refine((v) => v === true, {
    message: "Consent is required to send a message.",
  }),
  // Honeypot: real users never fill this hidden field.
  company: z.string().optional(),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message ?? "Invalid submission.";
    return NextResponse.json({ error: first }, { status: 400 });
  }

  const { name, email, context, message, company } = parsed.data;

  // Silently accept bot submissions so they don't retry, but do nothing.
  if (company && company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const cleanContext = context?.trim() ? context.trim() : null;

  try {
    const db = requireDb();
    await db.insert(contactMessages).values({
      name,
      email,
      context: cleanContext,
      message,
      consent: true,
      status: "new",
    });
  } catch (err) {
    console.error("[contact] Failed to store message:", err);
    return NextResponse.json(
      { error: "Something went wrong saving your message. Please try again." },
      { status: 500 }
    );
  }

  // Emails are best-effort: the message is already stored, so a mail failure
  // should not surface as an error to the visitor.
  const submission = { name, email, context: cleanContext, message };
  const [ownerResult, replyResult] = await Promise.allSettled([
    sendContactNotificationToOwner(submission),
    sendContactAutoReply(submission),
  ]);
  if (ownerResult.status === "rejected") {
    console.error("[contact] Owner notification failed:", ownerResult.reason);
  }
  if (replyResult.status === "rejected") {
    console.error("[contact] Auto-reply failed:", replyResult.reason);
  }

  return NextResponse.json({ ok: true });
}
