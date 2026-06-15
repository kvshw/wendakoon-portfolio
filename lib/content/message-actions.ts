"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { contactMessages } from "@/db/schema";
import { requireDb } from "@/lib/db/drizzle";
import { requireAdmin } from "@/lib/auth";

type MessageStatus = "new" | "read" | "archived";

export async function setMessageStatus(id: string, status: MessageStatus) {
  await requireAdmin();
  const db = requireDb();
  await db
    .update(contactMessages)
    .set({ status })
    .where(eq(contactMessages.id, id));
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  const db = requireDb();
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
