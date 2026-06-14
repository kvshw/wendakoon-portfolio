import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { buildContextPrompt } from "./profile";
import { fetchRecentAiNews, formatNewsForPrompt } from "./news-search";

const MODEL = "claude-sonnet-4-6";

const generationSchema = z.object({
  blog: z.object({
    title: z.string().min(10),
    slug_hint: z.string().min(3),
    summary: z.string().min(20),
    excerpt: z.string().min(20).optional(),
    tags: z.array(z.string().min(2)).min(2).max(6),
    topic_angle: z.string().min(10),
    cover_image_prompt: z.string().min(20),
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

function pickTopicFocus(): "work" | "general" {
  return Math.random() < 0.65 ? "work" : "general";
}

export async function generateContentDraft(): Promise<GeneratedContent> {
  const client = getClient();
  const context = buildContextPrompt();
  const news = await fetchRecentAiNews(12);
  const newsBlock = formatNewsForPrompt(news);
  const focus = pickTopicFocus();

  const system = `You are a senior technical writer and AI news analyst creating blog drafts and LinkedIn posts for an engineering researcher.
Output ONLY valid JSON matching this schema (no markdown fences, no commentary):
{
  "blog": {
    "title": string,
    "slug_hint": string,
    "summary": string,
    "excerpt": string (optional, punchy 1-2 sentence hook),
    "tags": string[],
    "topic_angle": string,
    "cover_image_prompt": string,
    "markdown": string
  },
  "linkedin_variations": [{ "content": string }, ...]
}
Provide exactly 2 or 3 linkedin_variations. Blog markdown should be 800-1500 words, deeply technical.
When recent headlines are provided, synthesize them into a coherent story: what happened, why it matters, and what practitioners should watch. Do not invent specific news events; ground claims in the supplied headlines or well-established public knowledge.
Cite no URLs inside the blog body unless they appear in the news context.`;

  const focusInstruction =
    focus === "work"
      ? `This draft should primarily connect to the author's research and engineering domains (adaptive AI, health AI, privacy ML, clinical platforms). You may reference broader AI news only where it sharpens the argument.`
      : `This draft should cover a broader AI industry or research theme (models, agents, regulation, infrastructure, safety) while still reflecting the author's practitioner perspective. Tie the story to real engineering trade-offs, not hype.`;

  const user = `${context}

Recent AI headlines (use as inspiration and synthesis material, not a list to summarize verbatim):
${newsBlock}

${focusInstruction}

Generate one original blog post with a fresh angle. Avoid generic listicles and repeated takes on "adaptive AI governance" unless the news context makes it timely.
Pick a topic that would resonate on LinkedIn with senior engineers and health-tech builders.
Include 2-6 specific tags (e.g. "Adaptive AI", "LLMs", "Clinical AI", "EU AI Act").
Also provide cover_image_prompt: concrete, specific visual art direction for a wide blog hero image that clearly depicts THIS article's subject. Name real objects, structures, or scenes a viewer would recognize as related to this exact topic (use the tags as cues). Keep it on-brand (cinematic, minimalist, dark with teal/cyan accents, no text, no logos, no human faces). Avoid generic abstract shapes or "glowing particles" that could fit any article.
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
