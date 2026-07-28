import { prisma } from "@/lib/prisma";

export async function notify({
  userId,
  type,
  title,
  body,
  href,
}: {
  userId: string;
  type:
    | "MATCH"
    | "OFFER"
    | "MESSAGE"
    | "CONTRACT"
    | "REVIEW"
    | "APPLICATION"
    | "DATAROOM";
  title: string;
  body?: string;
  href?: string;
}) {
  try {
    await prisma.notification.create({
      data: { userId, type, title, body, href },
    });
  } catch (e) {
    // Notifications are best-effort — never fail the main operation.
    console.error("[notify]", e);
  }
}
