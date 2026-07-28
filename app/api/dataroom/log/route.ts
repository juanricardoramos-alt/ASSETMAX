import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";

const schema = z.object({
  projectId: z.string().min(1),
  documentName: z.string().min(1).max(300),
});

export async function POST(req: Request) {
  const { session, error } = await requireUser();
  if (error) return error;

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  // Only users with granted access (or the owner) generate audit entries.
  const [project, grant] = await Promise.all([
    prisma.project.findUnique({
      where: { id: parsed.data.projectId },
      select: { id: true, ownerId: true },
    }),
    prisma.dataRoomRequest.findUnique({
      where: {
        projectId_userId: {
          projectId: parsed.data.projectId,
          userId: session!.user.id,
        },
      },
    }),
  ]);
  if (!project) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  const isOwner = project.ownerId === session!.user.id;
  if (!isOwner && grant?.status !== "GRANTED") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await prisma.dataRoomLog.create({
    data: {
      projectId: project.id,
      userId: session!.user.id,
      documentName: parsed.data.documentName,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
