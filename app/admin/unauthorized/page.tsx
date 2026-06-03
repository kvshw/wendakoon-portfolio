import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function AdminUnauthorizedPage() {
  const { userId } = await auth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Access not allowed</h1>
        <p className="max-w-md text-sm text-[#B8C0C8]">
          Your account is signed in, but this email is not on the admin allowlist.
          Ask the site owner to add your email to <code>ADMIN_EMAILS</code>.
        </p>
      </div>
      <div className="flex items-center gap-4">
        {userId ? <UserButton afterSignOutUrl="/" /> : null}
        <Link
          href="/"
          className="rounded-md border border-white/15 px-4 py-2 text-sm hover:bg-white/5"
        >
          Back to site
        </Link>
      </div>
    </div>
  );
}
