export const contentProfile = {
  name: "Kavishwa Wendakoon",
  role: "Doctoral Researcher · Software Engineer",
  domains: [
    "Autonomous AI systems and MAPE-K control loops",
    "Adaptive and self-healing AI in clinical decision support",
    "Privacy-preserving ML for pediatric brain health",
    "Health platforms and clinical decision support",
    "Flutter and Next.js full-stack engineering",
    "Safe, explainable AI in regulated health contexts",
    "Edge deployment, observability, and reliability engineering",
  ],
  generalAiTopics: [
    "Large language models and agentic workflows",
    "AI regulation (EU AI Act, FDA SaMD, post-market surveillance)",
    "Inference economics, distillation, and deployment trade-offs",
    "Evaluation, benchmarking, and model drift in production",
    "Open-source models vs. proprietary APIs",
    "AI safety, alignment, and human-in-the-loop design",
    "Multimodal models and real-world product integration",
  ],
  topicMix:
    "Roughly 65% of posts should connect to the author's research and engineering work (health AI, adaptive systems, privacy ML, platforms). Roughly 35% should cover broader AI news and industry shifts, still filtered through a practitioner's lens.",
  audience:
    "Senior engineers, ML researchers, health-tech founders, and technical leaders who care about rigor, not hype.",
  tone:
    "Precise, technical, first-principles. No buzzword soup. Show trade-offs, architecture decisions, and lessons from building real systems. Never use em dashes; use commas, colons, or periods instead.",
  postStructure: [
    "Hook with a concrete problem or observation",
    "Technical context and constraints",
    "Architecture or approach with specifics (stacks, patterns, metrics)",
    "What worked, what failed, what you'd do differently",
    "Actionable takeaway for practitioners",
  ],
  linkedInStyle:
    "Short paragraphs, line breaks, 1-2 relevant emojis max, strong opening line, end with a thoughtful question or CTA. Under 2800 characters.",
  avoidTopics: [
    "Generic AI hype without technical substance",
    "Political or controversial non-tech topics",
    "Unverified medical claims",
  ],
};

export function buildContextPrompt(): string {
  const p = contentProfile;
  return `
Author: ${p.name} (${p.role})

Core expertise (author's work):
${p.domains.map((d) => `- ${d}`).join("\n")}

Broader AI themes to cover sometimes:
${p.generalAiTopics.map((d) => `- ${d}`).join("\n")}

Topic balance: ${p.topicMix}

Target audience: ${p.audience}

Writing tone: ${p.tone}

Preferred blog structure:
${p.postStructure.map((s, i) => `${i + 1}. ${s}`).join("\n")}

LinkedIn style: ${p.linkedInStyle}

Avoid: ${p.avoidTopics.join("; ")}
`.trim();
}
