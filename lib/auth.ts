import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireAdmin() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in?redirect_url=/admin/content-engine");
  }

  const user = await currentUser();
  const email =
    user?.primaryEmailAddress?.emailAddress?.toLowerCase() ??
    user?.emailAddresses?.[0]?.emailAddress?.toLowerCase();

  const admins = getAdminEmails();

  if (!email || !admins.includes(email)) {
    redirect("/admin/unauthorized");
  }

  return { userId, email, user };
}

export async function getOptionalAuth() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  return { userId, user };
}
