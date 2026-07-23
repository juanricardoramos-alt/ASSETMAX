import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";

const schema = z.object({
  body: z.string().min(1).max(5000),
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

  const thread = await prisma.thread.findUnique({ where: { id: params.id } });
  if (!thread) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const userId = session!.user.id;
  const isParticipant = thread.investorId === userId || thread.sellerId === userId;
  if (!isParticipant && session!.user.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await prisma.$transaction([
    prisma.message.create({
      data: { threadId: thread.id, senderId: userId, body: parsed.data.body },
    }),
    prisma.thread.update({
      where: { id: thread.id },
      data: { lastMessageAt: new Date() },
    }),
  ]);

  return NextResponse.json({ ok: true }, { status: 201 });
}
