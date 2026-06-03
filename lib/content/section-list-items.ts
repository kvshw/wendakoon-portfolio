/** Factories and summaries for CMS list rows in Website sections admin */

type Row = Record<string, unknown>;

function padIdx(n: number) {
  return String(n).padStart(2, "0");
}

function titleOrFallback(title: string | undefined, fallback: string) {
  const t = title?.trim();
  return t || fallback;
}

export function heroStatItem() {
  return { id: `stat-${Date.now()}`, val: "0", lbl: "New stat" };
}

export function heroStatSummary(item: Row) {
  const lbl = String(item.lbl ?? "").trim();
  const val = String(item.val ?? "").trim();
  if (lbl && val) return `${val} · ${lbl}`;
  return lbl || val || "New stat";
}

export function orientCardItem(existing: { idx?: string }[]) {
  return {
    idx: padIdx(existing.length + 1),
    title: "New card",
    body: "",
    to: "",
  };
}

export function orientCardSummary(item: Row) {
  return titleOrFallback(String(item.title ?? ""), `Card ${item.idx ?? "?"}`);
}

export function researchAreaItem(existing: { idx?: string }[]) {
  return {
    idx: padIdx(existing.length + 1),
    title: "New research area",
    body: "",
    detail: "",
    tags: [] as string[],
  };
}

export function researchAreaSummary(item: Row) {
  return titleOrFallback(String(item.title ?? ""), `Area ${item.idx ?? "?"}`);
}

export function focusAreaItem(existing: { num?: string; id?: string }[]) {
  const n = existing.length + 1;
  return {
    id: `focus-${n}`,
    num: padIdx(n),
    title: "New focus area",
    preview: "",
    body: "",
  };
}

export function focusAreaSummary(item: Row) {
  return titleOrFallback(String(item.title ?? ""), `Focus ${item.num ?? "?"}`);
}

export function journeyEntryItem(existing: { num?: string }[]) {
  const n = existing.length + 1;
  return {
    year: String(new Date().getFullYear()),
    num: padIdx(n),
    tag: "New",
    title: "New milestone",
    arrow: "→",
    title2: "",
    quote: "",
  };
}

export function journeyEntrySummary(item: Row) {
  const title = String(item.title ?? "").trim();
  const year = String(item.year ?? "").trim();
  if (title && year) return `${year} · ${title}`;
  return title || year || "New entry";
}

export function projectItem(existing: { idx?: string; slug?: string }[]) {
  const n = existing.length + 1;
  const slug = `new-project-${n}`;
  return {
    idx: padIdx(n),
    slug,
    status: "Draft",
    year: String(new Date().getFullYear()),
    type: "Personal",
    title: "New project",
    body: "",
    tags: [] as string[],
    evidence: [] as string[],
  };
}

export function projectSummary(item: Row) {
  return titleOrFallback(String(item.title ?? ""), String(item.slug ?? "New project"));
}

export function publicationItem(existing: { year?: string }[]) {
  return {
    title: "New publication",
    venue: "",
    year: String(new Date().getFullYear()),
    body: "",
    type: "paper",
    idx: padIdx(existing.length + 1),
  };
}

export function publicationSummary(item: Row) {
  const title = String(item.title ?? "").trim();
  const year = String(item.year ?? "").trim();
  if (title && year) return `${year} · ${title}`;
  return title || year || "New publication";
}

export function timelineItem() {
  return {
    when: String(new Date().getFullYear()),
    title: "New role",
    org: "",
    desc: "",
  };
}

export function timelineSummary(item: Row) {
  const title = String(item.title ?? "").trim();
  const when = String(item.when ?? "").trim();
  const org = String(item.org ?? "").trim();
  if (title && when) return `${when} · ${title}${org ? ` @ ${org}` : ""}`;
  return title || when || "New timeline entry";
}

export function awardItem() {
  return { yr: String(new Date().getFullYear()), title: "New award" };
}

export function awardSummary(item: Row) {
  const title = String(item.title ?? "").trim();
  const yr = String(item.yr ?? "").trim();
  if (title && yr) return `${yr} · ${title}`;
  return title || yr || "New award";
}

export function perspectiveItem(existing: { num?: string; id?: string }[]) {
  const n = existing.length + 1;
  return {
    id: `perspective-${Date.now()}`,
    num: padIdx(n),
    name: "New audience",
    title: "New perspective",
    quote: "",
    stats: [] as { v: string; l: string }[],
    highlights: [] as string[],
    cta: { label: "Learn more", primary: false, href: "#contact" },
    next: "",
  };
}

export function perspectiveSummary(item: Row) {
  const name = String(item.name ?? "").trim();
  const title = String(item.title ?? "").trim();
  if (name && title) return `${name}: ${title}`;
  return name || title || "New perspective";
}
