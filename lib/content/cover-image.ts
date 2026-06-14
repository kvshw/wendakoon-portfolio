import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getSupabaseAdmin } from "@/lib/db/supabase";
import { renderBrandedCoverPng } from "./cover-og";

export const BRAND_COVER_STYLE = `
Ultra high-resolution editorial hero photograph for a premium technology research blog.
Palette: near-black background #0A0D10, charcoal layers #11171B, teal accent #28BDAE, soft cyan glow #7AF7E5.
Aesthetic: cinematic, minimalist, technical, abstract. Studio lighting, depth of field, subtle film grain, crisp detail.
No text, no logos, no watermarks, no human faces, no clip art, no low-poly cheap 3D.
`.trim();

export type CoverArtInput = {
  title: string;
  slug: string;
  tags: string[];
  topicAngle: string;
  imagePrompt?: string;
};

export function buildCoverImagePrompt(input: CoverArtInput): string {
  const custom = input.imagePrompt?.trim();
  const topic = input.topicAngle || input.title;
  const tags = input.tags.slice(0, 3).join(", ");

  return `${BRAND_COVER_STYLE}
Topic: ${topic}
Tags: ${tags}
${custom ? `Visual direction: ${custom}` : "Visual direction: abstract representation of the topic through light, structure, and depth."}
Composition: wide 16:9 landscape, cinematic negative space, focal glow on the right third, suitable as a premium blog hero image.
Quality: sharp focus, rich contrast, professional editorial photography standard.`;
}

async function ensureCoverDir() {
  const dir = path.join(process.cwd(), "public", "blog", "covers");
  await mkdir(dir, { recursive: true });
  return dir;
}

async function savePngCover(
  buffer: Buffer,
  filenameBase: string
): Promise<string> {
  const filename = `${filenameBase}.png`;
  const objectPath = `covers/${filename}`;

  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const supabase = getSupabaseAdmin();
      const { error } = await supabase.storage
        .from("blog-covers")
        .upload(objectPath, buffer, {
          contentType: "image/png",
          upsert: true,
        });

      if (!error) {
        const { data } = supabase.storage
          .from("blog-covers")
          .getPublicUrl(objectPath);
        return data.publicUrl;
      }

      console.error("[cover] Supabase upload failed:", error.message);
    } catch (err) {
      console.error("[cover] Supabase storage unavailable:", err);
    }
  }

  const dir = await ensureCoverDir();
  await writeFile(path.join(dir, filename), buffer);
  return `/blog/covers/${filename}`;
}

async function generateOpenAiCover(
  input: CoverArtInput,
  filenameBase: string
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const prompt = buildCoverImagePrompt(input);

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1792x1024",
      response_format: "b64_json",
      quality: "hd",
      style: "vivid",
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI image API failed: ${errText}`);
  }

  const data = (await res.json()) as {
    data?: Array<{ b64_json?: string }>;
  };

  const b64 = data.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error("OpenAI image API returned no image data.");
  }

  const buffer = Buffer.from(b64, "base64");
  return savePngCover(buffer, filenameBase);
}

async function generateRenderedCover(
  input: CoverArtInput,
  filenameBase: string
): Promise<string> {
  const buffer = await renderBrandedCoverPng(input);
  return savePngCover(buffer, filenameBase);
}

export async function generateAndSaveCover(
  input: CoverArtInput
): Promise<{ url: string; source: "openai" | "rendered" }> {
  const filenameBase = `${input.slug}-${Date.now()}`;
  const preferOpenAi = process.env.CONTENT_COVER_PROVIDER !== "rendered";

  if (preferOpenAi && process.env.OPENAI_API_KEY) {
    try {
      const url = await generateOpenAiCover(input, filenameBase);
      return { url, source: "openai" };
    } catch (err) {
      console.error("[cover] OpenAI HD failed, using rendered PNG:", err);
    }
  }

  const url = await generateRenderedCover(input, filenameBase);
  return { url, source: "rendered" };
}
