import { requireAdmin } from "@/lib/auth";
import { getPostCounts, getRecentPosts } from "@/lib/db/queries/posts";
import { getMetadata } from "@/lib/db/queries/siteMetadata";
import { PUBLICATIONS } from "@/lib/data";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusCard } from "@/components/admin/dashboard/StatusCard";
import { PostActivityFeed } from "@/components/admin/dashboard/PostActivityFeed";
import { QuickActions } from "@/components/admin/dashboard/QuickActions";
import { ThesisTracker } from "@/components/admin/dashboard/ThesisTracker";
import { SiteHealth, type HealthItem } from "@/components/admin/dashboard/SiteHealth";
import { getSectionContentBundle } from "@/lib/content/site";

const SECTION_COUNT = 9;

async function buildHealthItems(): Promise<HealthItem[]> {
  const cvUpdated = await getMetadata<string>("cv_updated_at");
  const heroReviewed = await getMetadata<string>("health_hero_reviewed_at");
  const pubsReviewed = await getMetadata<string>("health_publications_reviewed_at");
  const contactReviewed = await getMetadata<string>("health_contact_reviewed_at");
  const cvReviewed = await getMetadata<string>("health_cv_reviewed_at");

  const heroBundle = await getSectionContentBundle("hero");
  const hasHeroOverride = Object.keys(heroBundle).length > 0;

  const acceptedCount = PUBLICATIONS.filter((p) =>
    p.venue?.toLowerCase().includes("accepted")
  ).length;

  const formatReviewed = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString("en-GB", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null;

  return [
    {
      id: "cv",
      label: "CV last updated",
      ok: Boolean(cvReviewed || cvUpdated),
      detail: cvUpdated
        ? `Last updated ${new Date(cvUpdated).toLocaleDateString("en-GB")}`
        : "No CV update timestamp recorded",
      reviewedAt: formatReviewed(cvReviewed),
    },
    {
      id: "hero",
      label: "Hero stats accurate",
      ok: Boolean(heroReviewed) || hasHeroOverride,
      detail: hasHeroOverride
        ? "Custom hero content in database"
        : "Using default hero from codebase",
      reviewedAt: formatReviewed(heroReviewed),
    },
    {
      id: "publications",
      label: "Publications list up to date",
      ok: Boolean(pubsReviewed),
      detail: `${PUBLICATIONS.length} entries · ${acceptedCount} accepted`,
      reviewedAt: formatReviewed(pubsReviewed),
    },
    {
      id: "contact",
      label: "Contact email reachable",
      ok: Boolean(contactReviewed),
      detail: "kaveebhashiofficial@gmail.com",
      reviewedAt: formatReviewed(contactReviewed),
    },
  ];
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function AdminDashboardPage() {
  await requireAdmin();

  let postCounts = { total: 0, drafts: 0, published: 0, rejected: 0 };
  let recentPosts: Awaited<ReturnType<typeof getRecentPosts>> = [];
  let healthItems: HealthItem[] = [];

  try {
    postCounts = await getPostCounts();
    recentPosts = await getRecentPosts(5);
    healthItems = await buildHealthItems();
  } catch (err) {
    console.error("[admin dashboard]", err);
  }

  const acceptedPubs = PUBLICATIONS.filter((p) =>
    p.venue?.toLowerCase().includes("accepted")
  ).length;

  const siteContentBundle = await getSectionContentBundle("hero");
  const lastSectionUpdate = Object.values(siteContentBundle)[0] as
    | { updatedAt?: string }
    | undefined;
  const sectionSubtext = lastSectionUpdate
    ? "Content overrides active"
    : "Defaults from codebase";

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${getGreeting()}`}
        description={`${today} · Command centre for your portfolio`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatusCard
          label="Blog posts"
          value={postCounts.total}
          subtext={`${postCounts.drafts} drafts · ${postCounts.published} published`}
          icon="fileText"
        />
        <StatusCard
          label="Publications"
          value={PUBLICATIONS.length}
          subtext={`${acceptedPubs} accepted`}
          icon="bookOpen"
        />
        <StatusCard
          label="Site sections"
          value={SECTION_COUNT}
          subtext={sectionSubtext}
          icon="layers"
        />
        <StatusCard
          label="Visitors (30d)"
          value={0}
          subtext="Connect analytics to track"
          icon="users"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <PostActivityFeed posts={recentPosts} />
        </div>
        <div className="lg:col-span-4">
          <QuickActions />
        </div>
      </div>

      <ThesisTracker />

      <SiteHealth items={healthItems} />
    </div>
  );
}
