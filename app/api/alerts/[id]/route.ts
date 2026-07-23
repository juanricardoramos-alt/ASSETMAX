import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireUser();
  if (error) return error;

  const alert = await prisma.alert.findUnique({ where: { id: params.id } });
  if (!alert || alert.userId !== session!.user.id) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await prisma.alert.delete({ where: { id: alert.id } });
  return NextResponse.json({ ok: true });
}
