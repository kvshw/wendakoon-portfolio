import { validateSlug } from "@/lib/content/blog-utils";

export type SeoAnalysis = {
  titleLength: number;
  titleStatus: "good" | "short" | "long";
  descriptionLength: number;
  descriptionStatus: "good" | "short" | "long";
  slugValid: boolean;
  slugLength: number;
  wordCount: number;
  readingTime: number;
  headingCount: number;
  charCount: number;
  score: number;
  issues: string[];
  suggestions: string[];
};

const TITLE_MIN = 30;
const TITLE_MAX = 65;
const DESC_MIN = 120;
const DESC_MAX = 165;

function statusForLength(
  length: number,
  min: number,
  max: number
): "good" | "short" | "long" {
  if (length >= min && length <= max) return "good";
  if (length < min) return "short";
  return "long";
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function countHeadings(content: string): number {
  return (content.match(/^#{2,3}\s+/gm) ?? []).length;
}

export function analyzeSeo(input: {
  title: string;
  description: string;
  slug: string;
  content: string;
}): SeoAnalysis {
  const titleLength = input.title.trim().length;
  const descriptionLength = input.description.trim().length;
  const slugValid = validateSlug(input.slug.trim());
  const slugLength = input.slug.trim().length;
  const wordCount = countWords(input.content);
  const readingTime = Math.max(1, Math.ceil(wordCount / 220));
  const headingCount = countHeadings(input.content);
  const charCount = input.content.length;

  const titleStatus = statusForLength(titleLength, TITLE_MIN, TITLE_MAX);
  const descriptionStatus = statusForLength(
    descriptionLength,
    DESC_MIN,
    DESC_MAX
  );

  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;

  if (titleStatus === "short") {
    issues.push("Title is short for search snippets.");
    suggestions.push(`Aim for ${TITLE_MIN}-${TITLE_MAX} characters.`);
    score -= 12;
  } else if (titleStatus === "long") {
    issues.push("Title may truncate in Google results.");
    score -= 8;
  }

  if (descriptionStatus === "short") {
    issues.push("Meta description is short.");
    suggestions.push(`Target ${DESC_MIN}-${DESC_MAX} characters for the summary.`);
    score -= 15;
  } else if (descriptionStatus === "long") {
    issues.push("Meta description may be cut off in search.");
    score -= 10;
  }

  if (!slugValid) {
    issues.push("Slug format is invalid.");
    suggestions.push("Use lowercase letters, numbers, and hyphens only.");
    score -= 20;
  } else if (slugLength > 60) {
    issues.push("Slug is long; shorter URLs are easier to share.");
    score -= 5;
  }

  if (wordCount < 600) {
    issues.push("Post is thin for technical SEO depth.");
    suggestions.push("Aim for at least 800 words for substantive articles.");
    score -= 15;
  }

  if (headingCount < 2) {
    issues.push("Few section headings; structure helps readers and SEO.");
    suggestions.push("Add H2 sections to break up the narrative.");
    score -= 8;
  }

  if (wordCount > 0 && !input.content.includes("##")) {
    suggestions.push("Use markdown H2 headings for major sections.");
  }

  return {
    titleLength,
    titleStatus,
    descriptionLength,
    descriptionStatus,
    slugValid,
    slugLength,
    wordCount,
    readingTime,
    headingCount,
    charCount,
    score: Math.max(0, Math.min(100, score)),
    issues,
    suggestions,
  };
}

export function seoStatusLabel(status: "good" | "short" | "long"): string {
  if (status === "good") return "Good";
  if (status === "short") return "Too short";
  return "Too long";
}
