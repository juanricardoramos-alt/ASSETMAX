import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { notify } from "@/lib/notify";

const schema = z.object({
  projectId: z.string().min(1),
  message: z.string().max(1000).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const { session, error } = await requireUser();
  if (error) return error;

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id: parsed.data.projectId },
    select: { id: true, title: true, status: true, ownerId: true },
  });
  if (!project || project.status !== "PUBLISHED") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (project.ownerId === session!.user.id) {
    return NextResponse.json({ error: "own_project" }, { status: 403 });
  }

  const existing = await prisma.dataRoomRequest.findUnique({
    where: {
      projectId_userId: { projectId: project.id, userId: session!.user.id },
    },
  });
  if (existing) {
    return NextResponse.json({ error: "exists" }, { status: 409 });
  }

  await prisma.dataRoomRequest.create({
    data: {
      projectId: project.id,
      userId: session!.user.id,
      message: parsed.data.message || null,
    },
  });

  await notify({
    userId: project.ownerId,
    type: "DATAROOM",
    title: project.title,
    body: parsed.data.message?.slice(0, 140) || undefined,
    href: `/en/dashboard/dataroom`,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
