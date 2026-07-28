import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { notify } from "@/lib/notify";

const schema = z.object({ action: z.enum(["grant", "deny"]) });

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireUser();
  if (error) return error;

  const request = await prisma.dataRoomRequest.findUnique({
    where: { id: params.id },
    include: { project: { select: { ownerId: true, title: true } } },
  });
  if (!request) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (request.project.ownerId !== session!.user.id) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const status = parsed.data.action === "grant" ? "GRANTED" : "DENIED";
  await prisma.dataRoomRequest.update({
    where: { id: request.id },
    data: { status, decidedAt: new Date() },
  });

  await notify({
    userId: request.userId,
    type: "DATAROOM",
    title: request.project.title,
    body: status,
    href: `/en/dashboard/dataroom`,
  });

  return NextResponse.json({ ok: true });
}
