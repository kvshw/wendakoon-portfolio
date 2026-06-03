import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { contentPostSchema } from "@/lib/content/section-schemas";
import { setSectionContent } from "@/lib/content/site";
import { getSectionContentBundle } from "@/lib/content/site";
import { SECTION_DEFAULTS } from "@/lib/content/section-defaults";

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

async function requireAdminApi() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  const email =
    user?.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
      ?.emailAddress ?? user?.emailAddresses[0]?.emailAddress;
  if (!email || !getAdminEmails().includes(email.toLowerCase())) return null;
  return email;
}

export async function GET(req: Request) {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const section = new URL(req.url).searchParams.get("section");
  if (!section || !SECTION_DEFAULTS[section]) {
    return NextResponse.json({ error: "Invalid section" }, { status: 400 });
  }

  const overrides = await getSectionContentBundle(section);
  const defaults = SECTION_DEFAULTS[section];
  const merged = { ...defaults, ...overrides };

  return NextResponse.json({ section, data: merged });
}

export async function POST(req: Request) {
  if (!(await requireAdminApi())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = contentPostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { section, payload } = parsed.data;

  try {
    for (const [key, value] of Object.entries(payload)) {
      await setSectionContent(section, key, value);
    }
    revalidatePath("/");
    revalidatePath("/admin/content");
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Save failed" },
      { status: 500 }
    );
  }
}
