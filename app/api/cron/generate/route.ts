import { NextRequest, NextResponse } from "next/server";
import { runContentGeneration } from "@/lib/content/generate";

function verifyCronSecret(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;

  const authHeader = req.headers.get("authorization");
  const bearer =
    authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;
  const headerSecret = req.headers.get("x-cron-secret");

  return bearer === secret || headerSecret === secret;
}

export async function POST(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runContentGeneration();
    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (err) {
    console.error("[cron/generate]", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST." },
    { status: 405 }
  );
}
