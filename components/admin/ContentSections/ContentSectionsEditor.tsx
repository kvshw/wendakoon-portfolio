"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SectionNav } from "./SectionNav";
import { SortableList } from "./SortableList";
import {
  SECTION_ANCHORS,
  SECTION_DEFAULTS,
  SECTION_LABELS,
} from "@/lib/content/section-defaults";
import {
  awardItem,
  awardSummary,
  focusAreaItem,
  focusAreaSummary,
  heroStatItem,
  heroStatSummary,
  journeyEntryItem,
  journeyEntrySummary,
  orientCardItem,
  orientCardSummary,
  perspectiveItem,
  perspectiveSummary,
  projectItem,
  projectSummary,
  publicationItem,
  publicationSummary,
  researchAreaItem,
  researchAreaSummary,
  timelineItem,
  timelineSummary,
} from "@/lib/content/section-list-items";
import { tokens } from "@/lib/admin/tokens";

function field(value: unknown): string {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function Field({
  label,
  value,
  onChange,
  multiline,
  max,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  max?: number;
}) {
  const warn = max && value.length > max * 0.8;
  return (
    <div className="mb-4">
      <label className="admin-label">{label}</label>
      {multiline ? (
        <textarea
          className="admin-input min-h-[80px]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="admin-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {max && (
        <p
          className="mt-1 text-[10px] font-mono"
          style={{ color: warn ? tokens.amber : tokens.inkFaint }}
        >
          {value.length} / {max}
        </p>
      )}
    </div>
  );
}

export function ContentSectionsEditor() {
  const searchParams = useSearchParams();
  const initialSection = searchParams.get("section") ?? "hero";

  const [section, setSection] = useState(initialSection);
  const [data, setData] = useState<Record<string, unknown>>(
    SECTION_DEFAULTS[initialSection] ?? {}
  );
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [dirtySections, setDirtySections] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadSection = useCallback(async (sec: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/content?section=${sec}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
        setSavedSnapshot(JSON.stringify(json.data));
      } else {
        const defaults = SECTION_DEFAULTS[sec] ?? {};
        setData(defaults);
        setSavedSnapshot(JSON.stringify(defaults));
      }
    } catch {
      const defaults = SECTION_DEFAULTS[sec] ?? {};
      setData(defaults);
      setSavedSnapshot(JSON.stringify(defaults));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSection(section);
  }, [section, loadSection]);

  useEffect(() => {
    const isDirty = JSON.stringify(data) !== savedSnapshot;
    setDirtySections((prev) => {
      const next = new Set(prev);
      if (isDirty) next.add(section);
      else next.delete(section);
      return next;
    });
  }, [data, savedSnapshot, section]);

  const save = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, payload: data }),
      });
      if (!res.ok) throw new Error("Save failed");
      setSavedSnapshot(JSON.stringify(data));
      setDirtySections((prev) => {
        const next = new Set(prev);
        next.delete(section);
        return next;
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      alert("Could not save section");
    } finally {
      setSaving(false);
    }
  };

  const previewUrl = `/#${SECTION_ANCHORS[section] ?? section}`;

  const renderEditor = () => {
    if (loading) {
      return <p className="text-sm text-[#B8C0C8]">Loading…</p>;
    }

    switch (section) {
      case "hero":
        return (
          <>
            <Field
              label="Kicker"
              value={String(data.kicker ?? "")}
              onChange={(kicker) => setData({ ...data, kicker })}
            />
            <Field
              label="Lead"
              value={String(data.lead ?? "")}
              onChange={(lead) => setData({ ...data, lead })}
              multiline
              max={200}
            />
            <Field
              label="Body"
              value={String(data.body ?? "")}
              onChange={(body) => setData({ ...data, body })}
              multiline
              max={400}
            />
            <Field
              label="Primary CTA"
              value={String(data.ctaPrimary ?? "")}
              onChange={(ctaPrimary) => setData({ ...data, ctaPrimary })}
            />
            <Field
              label="Secondary CTA"
              value={String(data.ctaSecondary ?? "")}
              onChange={(ctaSecondary) => setData({ ...data, ctaSecondary })}
            />
            <p className="admin-label mb-2">Stats</p>
            <SortableList<{ id?: string; val: string; lbl: string; acc?: boolean }>
              items={(data.stats as { id?: string; val: string; lbl: string; acc?: boolean }[]) ?? []}
              onChange={(stats) => setData({ ...data, stats })}
              createItem={heroStatItem}
              getSummary={heroStatSummary}
              addLabel="Add stat"
              minItems={1}
              getId={(item, i) => field(item.id) || `stat-${field(item.val)}-${field(item.lbl)}-${i}`}
              renderItem={(item, _, update) => (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    className="admin-input text-xs"
                    placeholder="Value"
                    value={item.val}
                    onChange={(e) => update({ ...item, val: e.target.value })}
                  />
                  <input
                    className="admin-input text-xs"
                    placeholder="Label"
                    value={item.lbl}
                    onChange={(e) => update({ ...item, lbl: e.target.value })}
                  />
                </div>
              )}
            />
          </>
        );

      case "contact":
        return (
          <>
            <Field label="Kicker" value={String(data.kicker ?? "")} onChange={(kicker) => setData({ ...data, kicker })} />
            <Field label="Statement" value={String(data.statement ?? "")} onChange={(statement) => setData({ ...data, statement })} multiline max={300} />
            <Field label="Body" value={String(data.body ?? "")} onChange={(body) => setData({ ...data, body })} multiline max={400} />
            <Field label="Email" value={String(data.email ?? "")} onChange={(email) => setData({ ...data, email })} />
            <Field label="Availability" value={String(data.availability ?? "")} onChange={(availability) => setData({ ...data, availability })} multiline />
          </>
        );

      case "orientation":
        return (
          <SortableList<Record<string, unknown>>
            items={(data.cards as Record<string, unknown>[]) ?? []}
            onChange={(cards) => setData({ ...data, cards })}
            createItem={() => orientCardItem((data.cards as { idx?: string }[]) ?? [])}
            getSummary={orientCardSummary}
            addLabel="Add card"
            minItems={1}
            getId={(item, i) => field(item.idx) || `c-${i}`}
            renderItem={(item, _, update) => (
              <div className="grid gap-2">
                <input className="admin-input text-xs" placeholder="Title" value={field(item.title)} onChange={(e) => update({ ...item, title: e.target.value })} />
                <textarea className="admin-input text-xs" placeholder="Body" value={field(item.body)} onChange={(e) => update({ ...item, body: e.target.value })} />
              </div>
            )}
          />
        );

      case "research":
        return (
          <SortableList<Record<string, unknown>>
            items={(data.areas as Record<string, unknown>[]) ?? []}
            onChange={(areas) => setData({ ...data, areas })}
            createItem={() => researchAreaItem((data.areas as { idx?: string }[]) ?? [])}
            getSummary={researchAreaSummary}
            addLabel="Add research area"
            minItems={1}
            getId={(item, i) => field(item.idx) || `r-${i}`}
            renderItem={(item, _, update) => (
              <div className="grid gap-2">
                <input className="admin-input text-xs" placeholder="Title" value={field(item.title)} onChange={(e) => update({ ...item, title: e.target.value })} />
                <textarea className="admin-input text-xs" placeholder="Body" value={field(item.body)} onChange={(e) => update({ ...item, body: e.target.value })} />
                <textarea className="admin-input text-xs" placeholder="Detail" value={field(item.detail)} onChange={(e) => update({ ...item, detail: e.target.value })} />
              </div>
            )}
          />
        );

      case "focus":
        return (
          <>
            <Field label="Section subtitle" value={String(data.subtitle ?? "")} onChange={(subtitle) => setData({ ...data, subtitle })} />
            <SortableList<Record<string, unknown>>
              items={(data.areas as Record<string, unknown>[]) ?? []}
              onChange={(areas) => setData({ ...data, areas })}
              createItem={() => focusAreaItem((data.areas as { num?: string; id?: string }[]) ?? [])}
              getSummary={focusAreaSummary}
              addLabel="Add focus area"
              minItems={1}
              getId={(item) => field(item.id) || field(item.num) || "focus-unknown"}
              renderItem={(item, _, update) => (
                <div className="grid gap-2">
                  <input className="admin-input text-xs" placeholder="Title" value={field(item.title)} onChange={(e) => update({ ...item, title: e.target.value })} />
                  <textarea className="admin-input text-xs" placeholder="Preview" value={field(item.preview)} onChange={(e) => update({ ...item, preview: e.target.value })} />
                  <textarea className="admin-input text-xs" placeholder="Body" value={field(item.body)} onChange={(e) => update({ ...item, body: e.target.value })} />
                </div>
              )}
            />
          </>
        );

      case "journey":
        return (
          <>
            <Field label="Subtitle" value={String(data.subtitle ?? "")} onChange={(subtitle) => setData({ ...data, subtitle })} />
            <SortableList<Record<string, unknown>>
              items={(data.entries as Record<string, unknown>[]) ?? []}
              onChange={(entries) => setData({ ...data, entries })}
              createItem={() => journeyEntryItem((data.entries as { num?: string }[]) ?? [])}
              getSummary={journeyEntrySummary}
              addLabel="Add journey entry"
              minItems={1}
              getId={(item, i) => field(item.num) || `j-${i}`}
              renderItem={(item, _, update) => (
                <div className="grid gap-2">
                  <input className="admin-input text-xs" placeholder="Year" value={field(item.year)} onChange={(e) => update({ ...item, year: e.target.value })} />
                  <input className="admin-input text-xs" placeholder="Title" value={field(item.title)} onChange={(e) => update({ ...item, title: e.target.value })} />
                  <textarea className="admin-input text-xs" placeholder="Quote" value={field(item.quote)} onChange={(e) => update({ ...item, quote: e.target.value })} />
                </div>
              )}
            />
          </>
        );

      case "projects":
        return (
          <SortableList<Record<string, unknown>>
            items={(data.items as Record<string, unknown>[]) ?? []}
            onChange={(items) => setData({ ...data, items })}
            createItem={() => projectItem((data.items as { idx?: string; slug?: string }[]) ?? [])}
            getSummary={projectSummary}
            addLabel="Add project"
            getId={(item, i) => field(item.slug) || `p-${i}`}
            renderItem={(item, _, update) => (
              <div className="grid gap-2">
                <input className="admin-input text-xs" placeholder="Title" value={field(item.title)} onChange={(e) => update({ ...item, title: e.target.value })} />
                <input className="admin-input text-xs" placeholder="Year" value={field(item.year)} onChange={(e) => update({ ...item, year: e.target.value })} />
                <textarea className="admin-input text-xs" placeholder="Description" value={field(item.body)} onChange={(e) => update({ ...item, body: e.target.value })} />
              </div>
            )}
          />
        );

      case "publications":
        return (
          <SortableList<Record<string, unknown>>
            items={(data.items as Record<string, unknown>[]) ?? []}
            onChange={(items) => setData({ ...data, items })}
            createItem={() => publicationItem((data.items as { year?: string }[]) ?? [])}
            getSummary={publicationSummary}
            addLabel="Add publication"
              getId={(item, i) => field(item.idx) || `pub-${i}`}
              renderItem={(item, _, update) => (
                <div className="grid gap-2">
                  <input className="admin-input text-xs" placeholder="Title" value={field(item.title)} onChange={(e) => update({ ...item, title: e.target.value })} />
                  <input className="admin-input text-xs" placeholder="Venue" value={field(item.venue)} onChange={(e) => update({ ...item, venue: e.target.value })} />
                <input className="admin-input text-xs" placeholder="Year" value={field(item.year)} onChange={(e) => update({ ...item, year: e.target.value })} />
                <textarea className="admin-input text-xs" placeholder="Body" value={field(item.body)} onChange={(e) => update({ ...item, body: e.target.value })} />
              </div>
            )}
          />
        );

      case "experience":
        return (
          <>
            <p className="admin-label mb-2">Timeline</p>
            <SortableList<Record<string, unknown>>
              items={(data.timeline as Record<string, unknown>[]) ?? []}
              onChange={(timeline) => setData({ ...data, timeline })}
              createItem={timelineItem}
              getSummary={timelineSummary}
              addLabel="Add timeline entry"
              minItems={1}
              getId={(item, i) => `tl-${field(item.when) || "x"}-${i}`}
              renderItem={(item, _, update) => (
                <div className="grid gap-2">
                  <input className="admin-input text-xs" placeholder="When" value={field(item.when)} onChange={(e) => update({ ...item, when: e.target.value })} />
                  <input className="admin-input text-xs" placeholder="Title" value={field(item.title)} onChange={(e) => update({ ...item, title: e.target.value })} />
                  <input className="admin-input text-xs" placeholder="Org" value={field(item.org)} onChange={(e) => update({ ...item, org: e.target.value })} />
                  <textarea className="admin-input text-xs" placeholder="Description" value={field(item.desc)} onChange={(e) => update({ ...item, desc: e.target.value })} />
                </div>
              )}
            />
            <p className="admin-label mb-2 mt-6">Awards</p>
            <SortableList<Record<string, unknown>>
              items={(data.awards as Record<string, unknown>[]) ?? []}
              onChange={(awards) => setData({ ...data, awards })}
              createItem={awardItem}
              getSummary={awardSummary}
              addLabel="Add award"
              getId={(item, i) => `a-${field(item.yr) || "x"}-${i}`}
              renderItem={(item, _, update) => (
                <div className="grid gap-2">
                  <input className="admin-input text-xs" placeholder="Year" value={field(item.yr)} onChange={(e) => update({ ...item, yr: e.target.value })} />
                  <input className="admin-input text-xs" placeholder="Title" value={field(item.title)} onChange={(e) => update({ ...item, title: e.target.value })} />
                </div>
              )}
            />
          </>
        );

      case "perspectives":
        return (
          <SortableList<Record<string, unknown>>
            items={(data.items as Record<string, unknown>[]) ?? []}
            onChange={(items) => setData({ ...data, items })}
            createItem={() => perspectiveItem((data.items as { num?: string; id?: string }[]) ?? [])}
            getSummary={perspectiveSummary}
            addLabel="Add perspective"
            minItems={1}
            getId={(item) => field(item.id) || "perspective-unknown"}
            renderItem={(item, _, update) => (
              <div className="grid gap-2">
                <input className="admin-input text-xs" placeholder="Name" value={field(item.name)} onChange={(e) => update({ ...item, name: e.target.value })} />
                <input className="admin-input text-xs" placeholder="Title" value={field(item.title)} onChange={(e) => update({ ...item, title: e.target.value })} />
                <textarea className="admin-input text-xs" placeholder="Quote" value={field(item.quote)} onChange={(e) => update({ ...item, quote: e.target.value })} />
              </div>
            )}
          />
        );

      default:
        return (
          <textarea
            className="admin-input min-h-[400px] font-mono text-xs"
            value={JSON.stringify(data, null, 2)}
            onChange={(e) => {
              try {
                setData(JSON.parse(e.target.value));
              } catch {
                /* ignore invalid json while typing */
              }
            }}
          />
        );
    }
  };

  const hasUnsaved = dirtySections.has(section);

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <SectionNav
        active={section}
        onSelect={setSection}
        dirty={dirtySections}
      />

      <div className="min-w-0 flex-1">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{SECTION_LABELS[section]}</h2>
          <div className="flex gap-2">
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs"
            >
              View live section ↗
            </a>
            <button
              type="button"
              className="btn-primary text-sm"
              disabled={saving}
              onClick={save}
            >
              {saving ? "Saving…" : "Save section"}
            </button>
          </div>
        </div>

        {hasUnsaved && (
          <div
            className="mb-4 rounded border px-3 py-2 text-xs"
            style={{ borderColor: tokens.amber, color: tokens.amber }}
          >
            You have unsaved changes
          </div>
        )}

        {success && (
          <div
            className="mb-4 rounded border px-3 py-2 text-xs"
            style={{ borderColor: tokens.accent, color: tokens.accent }}
          >
            Section saved successfully
          </div>
        )}

        <div className="admin-card p-4">{renderEditor()}</div>
      </div>
    </div>
  );
}
