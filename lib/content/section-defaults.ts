import {
  HERO_STATS,
  ORIENT_CARDS,
  PERSPECTIVES,
  RESEARCH_AREAS,
  FOCUS_AREAS,
  JOURNEY,
  MILESTONES,
  PROJECTS,
  PUBLICATIONS,
  PUB_CATEGORIES,
  CV_TIMELINE,
  SKILL_GROUPS,
  AWARDS,
  CV_STATS,
} from "@/lib/data";
import { getProfileLinkChips } from "@/lib/profile-links";

export const HERO_DEFAULTS = {
  kicker: "Doctoral researcher · software engineer",
  lead: "I research how to make adaptive AI in clinical settings trustworthy, then I build things to prove it.",
  body: "PhD candidate at the University of Oulu. My research asks one question: how do you build clinical AI that keeps working safely as conditions change, and how do you prove it?",
  ctaPrimary: "Explore research",
  ctaSecondary: "Download CV",
  stats: HERO_STATS,
};

export const CONTACT_DEFAULTS = {
  kicker: "Get in touch",
  statement: "If you are building systems that must adapt without losing trust, we should talk.",
  body: "Open to collaboration on medical AI, mHealth, and privacy-preserving systems. I bring both industry engineering and doctoral research to the table.",
  email: "hello@kavishwa.com",
  links: getProfileLinkChips(),
  availability: "Available for research collaboration and selective consulting engagements.",
};

export const SECTION_DEFAULTS: Record<string, Record<string, unknown>> = {
  hero: {
    ...HERO_DEFAULTS,
    stats: HERO_STATS,
  },
  orientation: { cards: ORIENT_CARDS },
  perspectives: { items: PERSPECTIVES },
  research: { areas: RESEARCH_AREAS },
  focus: { areas: FOCUS_AREAS, subtitle: "What occupies my research hours right now." },
  journey: { entries: JOURNEY, milestones: MILESTONES, subtitle: "How the research question evolved." },
  projects: { items: PROJECTS },
  publications: { items: PUBLICATIONS, categories: PUB_CATEGORIES },
  experience: {
    timeline: CV_TIMELINE,
    skillGroups: SKILL_GROUPS,
    awards: AWARDS,
    stats: CV_STATS,
  },
  contact: CONTACT_DEFAULTS,
};

export const SECTION_ANCHORS: Record<string, string> = {
  hero: "top",
  orientation: "about",
  perspectives: "perspective",
  research: "research",
  focus: "focus",
  journey: "journey",
  projects: "projects",
  publications: "publications",
  experience: "cv",
  contact: "contact",
};

export const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  orientation: "Orientation",
  perspectives: "Perspectives",
  research: "Research Areas",
  focus: "Current Focus",
  journey: "Journey",
  projects: "Projects",
  publications: "Publications",
  experience: "Experience (CV)",
  contact: "Contact",
};
