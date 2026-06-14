import React from "react";
import { ImageResponse } from "next/og";
import type { CoverArtInput } from "./cover-image";

const WIDTH = 1200;
const HEIGHT = 630;

function hashString(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function pickMotif(seed: number, input: CoverArtInput): "network" | "grid" | "rings" {
  const haystack = `${input.title} ${input.topicAngle} ${input.tags.join(" ")}`.toLowerCase();

  if (/(agent|network|graph|connect|distributed|multi-?agent|llm|model|reason|orchestr)/.test(haystack)) {
    return "network";
  }
  if (/(data|grid|infra|platform|system|pipeline|architecture|scal|deploy|cloud|compute)/.test(haystack)) {
    return "grid";
  }
  if (/(privacy|secur|signal|wave|adaptive|learning|feedback|health|clinical|patient|sensor)/.test(haystack)) {
    return "rings";
  }

  const motifs = ["network", "grid", "rings"] as const;
  return motifs[seed % motifs.length];
}

function truncateTitle(title: string, max = 72): string {
  const t = title.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trim()}…`;
}

const FONT_URLS = {
  spaceGrotesk600:
    "https://fonts.gstatic.com/s/spacegrotesk/v22/V8mQoQDjQSkFtoMM3T6r8E7mF71Q-gOoraIAEj42Vksg.woff",
  jetbrainsMono400:
    "https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPg.woff",
} as const;

async function fetchFont(url: string, label: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load ${label} font (${res.status})`);
  }

  const data = await res.arrayBuffer();
  if (data.byteLength < 1024) {
    throw new Error(`Failed to load ${label} font (empty response)`);
  }

  return data;
}

async function loadFonts() {
  const [spaceGrotesk, jetbrainsMono] = await Promise.all([
    fetchFont(FONT_URLS.spaceGrotesk600, "Space Grotesk"),
    fetchFont(FONT_URLS.jetbrainsMono400, "JetBrains Mono"),
  ]);

  return [
    {
      name: "Space Grotesk",
      data: spaceGrotesk,
      style: "normal" as const,
      weight: 600 as const,
    },
    {
      name: "JetBrains Mono",
      data: jetbrainsMono,
      style: "normal" as const,
      weight: 400 as const,
    },
  ];
}

function NetworkMotif({ seed }: { seed: number }) {
  const nodes = [
    { x: 760, y: 170 + (seed % 40), r: 10 },
    { x: 920, y: 250 + (seed % 30), r: 12 },
    { x: 1040, y: 150 + (seed % 35), r: 9 },
    { x: 860, y: 390 + (seed % 25), r: 11 },
    { x: 1020, y: 340 + (seed % 20), r: 8 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
      }}
    >
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        {nodes.map((a, i) =>
          nodes.slice(i + 1).map((b, j) => (
            <line
              key={`${i}-${j}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(40, 189, 174, 0.22)"
              strokeWidth="1.5"
            />
          ))
        )}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.r * 2.2} fill="rgba(122, 247, 229, 0.12)" />
            <circle cx={n.x} cy={n.y} r={n.r} fill="#7AF7E5" />
            <circle cx={n.x} cy={n.y} r={n.r * 0.45} fill="#0A0D10" />
          </g>
        ))}
      </svg>
    </div>
  );
}

function GridMotif() {
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < 12; i++) {
    const x = 520 + i * 56;
    lines.push(
      <line
        key={`v-${i}`}
        x1={x}
        y1={60}
        x2={x}
        y2={570}
        stroke="rgba(255,255,255,0.045)"
        strokeWidth="1"
      />
    );
  }
  for (let i = 0; i < 9; i++) {
    const y = 60 + i * 56;
    lines.push(
      <line
        key={`h-${i}`}
        x1={520}
        y1={y}
        x2={1160}
        y2={y}
        stroke="rgba(255,255,255,0.045)"
        strokeWidth="1"
      />
    );
  }

  return (
    <div style={{ position: "absolute", inset: 0, display: "flex" }}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        {lines}
        <rect
          x={720}
          y={200}
          width={320}
          height={220}
          fill="none"
          stroke="rgba(40, 189, 174, 0.4)"
          strokeWidth="2"
        />
        <rect
          x={748}
          y={228}
          width={264}
          height={164}
          fill="rgba(40, 189, 174, 0.06)"
          stroke="rgba(122, 247, 229, 0.15)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

function RingsMotif({ seed }: { seed: number }) {
  const cx = 900 + (seed % 40);
  const cy = 310 + (seed % 30);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex" }}>
      <svg width={WIDTH} height={HEIGHT} viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        {[140, 98, 58, 28].map((r, i) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={`rgba(40, 189, 174, ${0.34 - i * 0.06})`}
            strokeWidth={2 - i * 0.3}
          />
        ))}
        <circle cx={cx} cy={cy} r={12} fill="#7AF7E5" />
        <circle cx={cx} cy={cy} r={5} fill="#0A0D10" />
      </svg>
    </div>
  );
}

function CoverTemplate({ input }: { input: CoverArtInput }) {
  const seed = hashString(`${input.slug}-${input.title}`);
  const motif = pickMotif(seed, input);
  const tag = (input.tags[0] ?? "AI").toUpperCase();
  const title = truncateTitle(input.title);
  const glowX = 680 + (seed % 160);
  const glowY = 160 + (seed % 100);

  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #070A0D 0%, #0A0D10 38%, #10161B 72%, #0B1014 100%)",
      }}
    >
      {/* Film grain overlay via noise pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.35,
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.03) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(40,189,174,0.08) 0%, transparent 50%)",
        }}
      />

      {/* Horizon lines */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 118,
          height: 1,
          background: "rgba(255,255,255,0.05)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 512,
          height: 1,
          background: "rgba(255,255,255,0.05)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 88,
          top: 0,
          bottom: 0,
          width: 1,
          background: "rgba(255,255,255,0.04)",
        }}
      />

      {/* Primary glow */}
      <div
        style={{
          position: "absolute",
          left: glowX - 200,
          top: glowY - 200,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(122,247,229,0.38) 0%, rgba(40,189,174,0.18) 38%, transparent 72%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: glowX + 60,
          top: glowY + 40,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(40,189,174,0.22) 0%, transparent 70%)",
        }}
      />

      {motif === "network" && <NetworkMotif seed={seed} />}
      {motif === "grid" && <GridMotif />}
      {motif === "rings" && <RingsMotif seed={seed} />}

      {/* Corner brackets */}
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 44,
          width: 56,
          height: 56,
          borderLeft: "3px solid rgba(40,189,174,0.65)",
          borderTop: "3px solid rgba(40,189,174,0.65)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 44,
          top: 44,
          width: 56,
          height: 56,
          borderRight: "3px solid rgba(40,189,174,0.65)",
          borderTop: "3px solid rgba(40,189,174,0.65)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 44,
          bottom: 44,
          width: 56,
          height: 56,
          borderLeft: "3px solid rgba(40,189,174,0.65)",
          borderBottom: "3px solid rgba(40,189,174,0.65)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 44,
          bottom: 44,
          width: 56,
          height: 56,
          borderRight: "3px solid rgba(40,189,174,0.65)",
          borderBottom: "3px solid rgba(40,189,174,0.65)",
        }}
      />

      {/* Editorial text block */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 420,
          bottom: 72,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 13,
            letterSpacing: "0.14em",
            color: "#28BDAE",
            textTransform: "uppercase",
          }}
        >
          {tag}
        </div>
        <div
          style={{
            fontFamily: "Space Grotesk",
            fontSize: 46,
            lineHeight: 1.12,
            fontWeight: 600,
            color: "#F5F6F7",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "JetBrains Mono",
            fontSize: 12,
            color: "#62696F",
            letterSpacing: "0.08em",
          }}
        >
          KAVISHWA WENDAKOON · RESEARCH & ENGINEERING
        </div>
      </div>

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </div>
  );
}

export async function renderBrandedCoverPng(
  input: CoverArtInput
): Promise<Buffer> {
  let fonts: Awaited<ReturnType<typeof loadFonts>> | undefined;
  try {
    fonts = await loadFonts();
  } catch (err) {
    console.error("[cover-og] Custom fonts unavailable, using defaults:", err);
  }

  const response = new ImageResponse(
    <CoverTemplate input={input} />,
    {
      width: WIDTH,
      height: HEIGHT,
      ...(fonts ? { fonts } : {}),
    }
  );

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
