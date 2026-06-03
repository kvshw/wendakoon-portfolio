/**
 * Seed script, inserts the first manual blog post.
 *
 * Run from the project root:
 *   npx tsx scripts/seed-blog-post.ts
 *
 * Requires DATABASE_URL in your .env (or .env.local).
 */

import "dotenv/config";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { posts } from "@/db/schema";
import { eq } from "drizzle-orm";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌  DATABASE_URL is not set.");
  process.exit(1);
}

const client = postgres(DATABASE_URL, { prepare: false });
const db = drizzle(client);

// ── Post content ─────────────────────────────────────────────────
const CONTENT = `
Most conversations about AI in healthcare focus on whether a model is accurate enough to deploy. That's the right question to ask before go-live. It's not the right question to stop asking.

Clinical AI doesn't stay in a lab. It goes into hospitals, emergency departments, and outpatient clinics where patient populations shift, drug formularies change, and new guidelines rewrite what "correct" looks like, sometimes overnight. A model trained on last year's data starts to drift. Quietly. In exactly the kind of way that is hardest to catch.

This is what drew me to adaptive AI in healthcare, and the lens through which two of my recent accepted papers are written.

---

## The Field Is Moving Fast

A systematic review I published earlier this year mapped the current landscape of self-adaptive AI in clinical decision support. The picture is striking: the engineering capability to build systems that monitor and update themselves at runtime is advancing rapidly. Architectures are being proposed, pilot deployments are underway, and the academic literature is growing.

What the field hasn't caught up with is the governance side. How do you validate a system that changes itself after validation? How do you maintain regulatory compliance, under MDR in Europe or FDA guidance in the US, when the software is, by design, not the same system it was at release? These questions are genuinely open. They are also genuinely important.

---

## Adaptation Is a Safety Question, Not Just an Engineering One

When a recommendation engine adapts its model, a bad update means someone sees the wrong content. When a clinical decision support system adapts incorrectly, the consequences are direct.

The challenge isn't that adaptive systems are dangerous. It's that the healthcare sector has not yet built the infrastructure, technical, regulatory, or organisational, to deploy them responsibly. The tools that work well in cloud infrastructure and autonomous systems don't translate cleanly into a clinical setting where every change to a system's behaviour is, in principle, a change to a medical device.

My second accepted paper addresses this gap with a concrete architectural proposal: how to build a clinical AI system that can adapt at runtime while remaining bounded, auditable, and safe. The focus is on making adaptation something a clinician and a regulator can reason about, not something the system does invisibly.

---

## What Comes Next for the Field

The interesting work ahead isn't only about making adaptive clinical AI more accurate. It's about making it more *legible*. Clinicians I've spoken with aren't afraid of AI that learns. They're uncomfortable with AI that changes without telling them. That distinction shapes everything about how these systems should be designed.

Regulatory bodies are starting to move. The EU AI Act's treatment of high-risk AI, the FDA's evolving guidance on AI/ML-based software as a medical device, both are heading toward frameworks that require continuous monitoring, change documentation, and post-market surveillance for adaptive systems. The engineering community needs to build toward those requirements.

This is an early and genuinely open space. The foundational work is happening now. It's a good time to be working on it.

---

*Two papers on this topic have recently been accepted for publication. See the research page for details.*
`.trim();

// ── Seed ─────────────────────────────────────────────────────────
async function seed() {
  const SLUG = "adaptive-ai-in-healthcare-the-governance-gap";

  const existing = await db.select().from(posts).where(eq(posts.slug, SLUG));

  const data = {
    title:       "Adaptive AI in Healthcare: The Governance Gap",
    summary:     "Clinical AI that updates itself after deployment sounds like progress. The field is advancing fast, but the governance infrastructure to deploy it safely is lagging behind. Two accepted papers on this.",
    excerpt:     "The engineering capability for adaptive clinical AI is advancing fast. The governance infrastructure to deploy it safely is not.",
    content:     CONTENT,
    tags:        ["Adaptive AI", "Healthcare", "Clinical AI", "Governance", "Research"],
    status:      "approved" as const,
    publishedAt: new Date("2026-06-02"),
    updatedAt:   new Date(),
  };

  if (existing.length > 0) {
    await db.update(posts).set(data).where(eq(posts.slug, SLUG));
    console.log("✅  Post updated:", SLUG);
  } else {
    await db.insert(posts).values({ ...data, slug: SLUG });
    console.log("✅  Post inserted:", SLUG);
  }

  await client.end();
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
