import { requireAdmin } from "@/lib/auth";
import { getAllMessages } from "@/lib/db/queries/messages";
import { MessageList } from "@/components/admin/Messages/MessageList";
import { PageHeader } from "@/components/admin/PageHeader";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  await requireAdmin();

  let messages: Awaited<ReturnType<typeof getAllMessages>> = [];
  let loadError: string | null = null;

  try {
    messages = await getAllMessages();
  } catch (err) {
    console.error("[admin/messages]", err);
    loadError =
      err instanceof Error
        ? err.message
        : "Could not load messages. Check DATABASE_URL and that migrations are applied.";
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inbox"
        description="Messages submitted through the website contact form"
      />
      {loadError && (
        <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {loadError}
        </p>
      )}
      <MessageList messages={messages} />
    </div>
  );
}
