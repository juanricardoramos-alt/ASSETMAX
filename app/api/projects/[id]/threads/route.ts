import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";

const schema = z.object({
  message: z.string().min(5).max(5000),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireUser();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project || project.status !== "PUBLISHED") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (project.ownerId === session!.user.id) {
    return NextResponse.json({ error: "own_project" }, { status: 400 });
  }

  const thread = await prisma.thread.upsert({
    where: {
      projectId_investorId: {
        projectId: project.id,
        investorId: session!.user.id,
      },
    },
    update: { lastMessageAt: new Date() },
    create: {
      projectId: project.id,
      investorId: session!.user.id,
      sellerId: project.ownerId,
      subject: project.title,
    },
  });

  await prisma.message.create({
    data: {
      threadId: thread.id,
      senderId: session!.user.id,
      body: parsed.data.message,
    },
  });

  return NextResponse.json({ ok: true, threadId: thread.id }, { status: 201 });
}
