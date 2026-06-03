import { getSectionContent } from "@/lib/content/site";
import {
  loadSiteContentBundle,
  pickFromBundle,
} from "@/lib/content/site-bundle";
import {
  SECTION_DEFAULTS,
  HERO_DEFAULTS,
  CONTACT_DEFAULTS,
} from "@/lib/content/section-defaults";
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

export async function getHeroContent() {
  const d = SECTION_DEFAULTS.hero;
  return {
    kicker: await getSectionContent("hero", "kicker", d.kicker as string),
    lead: await getSectionContent("hero", "lead", HERO_DEFAULTS.lead),
    body: await getSectionContent("hero", "body", HERO_DEFAULTS.body),
    ctaPrimary: await getSectionContent("hero", "ctaPrimary", HERO_DEFAULTS.ctaPrimary),
    ctaSecondary: await getSectionContent("hero", "ctaSecondary", HERO_DEFAULTS.ctaSecondary),
    stats: await getSectionContent("hero", "stats", HERO_STATS),
  };
}

export async function getOrientationContent() {
  return {
    cards: await getSectionContent("orientation", "cards", ORIENT_CARDS),
  };
}

export async function getPerspectivesContent() {
  return {
    items: await getSectionContent("perspectives", "items", PERSPECTIVES),
  };
}

export async function getResearchContent() {
  return {
    areas: await getSectionContent("research", "areas", RESEARCH_AREAS),
  };
}

export async function getFocusContent() {
  return {
    subtitle: await getSectionContent(
      "focus",
      "subtitle",
      "What occupies my research hours right now."
    ),
    areas: await getSectionContent("focus", "areas", FOCUS_AREAS),
  };
}

export async function getJourneyContent() {
  return {
    subtitle: await getSectionContent(
      "journey",
      "subtitle",
      "How the research question evolved."
    ),
    entries: await getSectionContent("journey", "entries", JOURNEY),
    milestones: await getSectionContent("journey", "milestones", MILESTONES),
  };
}

export async function getProjectsContent() {
  return {
    items: await getSectionContent("projects", "items", PROJECTS),
  };
}

export async function getPublicationsContent() {
  const items = await getSectionContent("publications", "items", PUBLICATIONS);
  const categories =
    (await getSectionContent("publications", "categories", null)) ??
    PUB_CATEGORIES;
  return { items, categories };
}

export async function getExperienceContent() {
  return {
    timeline: await getSectionContent("experience", "timeline", CV_TIMELINE),
    skillGroups: await getSectionContent("experience", "skillGroups", SKILL_GROUPS),
    awards: await getSectionContent("experience", "awards", AWARDS),
    stats: await getSectionContent("experience", "stats", CV_STATS),
  };
}

export async function getContactContent() {
  return {
    kicker: await getSectionContent("contact", "kicker", CONTACT_DEFAULTS.kicker),
    statement: await getSectionContent("contact", "statement", CONTACT_DEFAULTS.statement),
    body: await getSectionContent("contact", "body", CONTACT_DEFAULTS.body),
    email: await getSectionContent("contact", "email", CONTACT_DEFAULTS.email),
    links: await getSectionContent("contact", "links", CONTACT_DEFAULTS.links),
    availability: await getSectionContent(
      "contact",
      "availability",
      CONTACT_DEFAULTS.availability
    ),
  };
}

export async function getAllSectionContent() {
  const bundle = await loadSiteContentBundle();
  const pick = <T>(section: string, key: string, fallback: T) =>
    pickFromBundle(bundle, section, key, fallback);

  const d = SECTION_DEFAULTS.hero;

  return {
    hero: {
      kicker: pick("hero", "kicker", d.kicker as string),
      lead: pick("hero", "lead", HERO_DEFAULTS.lead),
      body: pick("hero", "body", HERO_DEFAULTS.body),
      ctaPrimary: pick("hero", "ctaPrimary", HERO_DEFAULTS.ctaPrimary),
      ctaSecondary: pick("hero", "ctaSecondary", HERO_DEFAULTS.ctaSecondary),
      stats: pick("hero", "stats", HERO_STATS),
    },
    orientation: {
      cards: pick("orientation", "cards", ORIENT_CARDS),
    },
    perspectives: {
      items: pick("perspectives", "items", PERSPECTIVES),
    },
    research: {
      areas: pick("research", "areas", RESEARCH_AREAS),
    },
    focus: {
      subtitle: pick(
        "focus",
        "subtitle",
        "What occupies my research hours right now."
      ),
      areas: pick("focus", "areas", FOCUS_AREAS),
    },
    journey: {
      subtitle: pick("journey", "subtitle", "How the research question evolved."),
      entries: pick("journey", "entries", JOURNEY),
      milestones: pick("journey", "milestones", MILESTONES),
    },
    projects: {
      items: pick("projects", "items", PROJECTS),
    },
    publications: {
      items: pick("publications", "items", PUBLICATIONS),
      categories:
        pick("publications", "categories", null as typeof PUB_CATEGORIES | null) ??
        PUB_CATEGORIES,
    },
    experience: {
      timeline: pick("experience", "timeline", CV_TIMELINE),
      skillGroups: pick("experience", "skillGroups", SKILL_GROUPS),
      awards: pick("experience", "awards", AWARDS),
      stats: pick("experience", "stats", CV_STATS),
    },
    contact: {
      kicker: pick("contact", "kicker", CONTACT_DEFAULTS.kicker),
      statement: pick("contact", "statement", CONTACT_DEFAULTS.statement),
      body: pick("contact", "body", CONTACT_DEFAULTS.body),
      email: pick("contact", "email", CONTACT_DEFAULTS.email),
      links: pick("contact", "links", CONTACT_DEFAULTS.links),
      availability: pick(
        "contact",
        "availability",
        CONTACT_DEFAULTS.availability
      ),
    },
  };
}

export type SiteContent = Awaited<ReturnType<typeof getAllSectionContent>>;
