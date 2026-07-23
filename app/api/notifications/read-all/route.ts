import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";

export async function POST() {
  const { session, error } = await requireUser();
  if (error) return error;

  await prisma.notification.updateMany({
    where: { userId: session!.user.id, readAt: null },
    data: { readAt: new Date() },
  });

  return NextResponse.json({ ok: true });
}
