import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { buildContextPrompt } from "./profile";

const MODEL = "claude-3-5-sonnet-20241022";

const generationSchema = z.object({
  blog: z.object({
    title: z.string().min(10),
    slug_hint: z.string().min(3),
    summary: z.string().min(20),
    markdown: z.string().min(500),
  }),
  linkedin_variations: z
    .array(z.object({ content: z.string().min(50) }))
    .min(2)
    .max(3),
});

export type GeneratedContent = z.infer<typeof generationSchema>;

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }
  return new Anthropic({ apiKey });
}

export async function generateContentDraft(): Promise<GeneratedContent> {
  const client = getClient();
  const context = buildContextPrompt();

  const system = `You are a senior technical writer creating blog drafts and LinkedIn posts for an engineering researcher.
Output ONLY valid JSON matching this schema (no markdown fences, no commentary):
{
  "blog": { "title": string, "slug_hint": string, "summary": string, "markdown": string },
  "linkedin_variations": [{ "content": string }, ...]
}
Provide exactly 2 or 3 linkedin_variations. Blog markdown should be 800-1500 words, deeply technical.`;

  const user = `${context}

Generate one original blog post on a fresh angle within the author's domains (not a generic listicle).
Pick a topic that would resonate on LinkedIn with senior engineers and health-tech builders.
Return JSON only.`;

  const message = await client.messages.create({
    model: MODEL,
    max_tokens: 8192,
    system,
    messages: [{ role: "user", content: user }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Anthropic.");
  }

  let raw = textBlock.text.trim();
  if (raw.startsWith("```")) {
    raw = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(raw) as unknown;
  return generationSchema.parse(parsed);
}
