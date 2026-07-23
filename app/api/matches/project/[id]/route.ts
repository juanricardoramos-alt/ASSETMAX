import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { notify } from "@/lib/notify";

const schema = z.object({ status: z.enum(["CONTACTED", "DISMISSED"]) });

async function loadMatch(id: string) {
  return prisma.projectMatch.findUnique({
    where: { id },
    include: {
      project: { select: { id: true, title: true, ownerId: true } },
      mandate: { select: { id: true, title: true, investorId: true } },
    },
  });
}

function isParticipant(
  match: NonNullable<Awaited<ReturnType<typeof loadMatch>>>,
  userId: string,
  role: string
) {
  return (
    role === "ADMIN" ||
    match.project.ownerId === userId ||
    match.mandate.investorId === userId
  );
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireUser();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const match = await loadMatch(params.id);
  if (!match) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!isParticipant(match, session!.user.id, session!.user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await prisma.projectMatch.update({
    where: { id: match.id },
    data: { status: parsed.data.status },
  });
  return NextResponse.json({ ok: true });
}

/** Start a conversation from a match: creates/reuses the project thread. */
export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireUser();
  if (error) return error;

  const match = await loadMatch(params.id);
  if (!match) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!isParticipant(match, session!.user.id, session!.user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const thread = await prisma.thread.upsert({
    where: {
      projectId_investorId: {
        projectId: match.project.id,
        investorId: match.mandate.investorId,
      },
    },
    update: { lastMessageAt: new Date() },
    create: {
      projectId: match.project.id,
      investorId: match.mandate.investorId,
      sellerId: match.project.ownerId,
      subject: match.project.title,
    },
  });

  await prisma.message.create({
    data: {
      threadId: thread.id,
      senderId: session!.user.id,
      body: `[ASSETMAX Matching] This conversation was opened from the match between the project "${match.project.title}" and the mandate "${match.mandate.title}" (${match.score}% compatibility).`,
    },
  });

  await prisma.projectMatch.update({
    where: { id: match.id },
    data: { status: "CONTACTED" },
  });

  const counterpart =
    session!.user.id === match.project.ownerId
      ? match.mandate.investorId
      : match.project.ownerId;
  await notify({
    userId: counterpart,
    type: "MESSAGE",
    title: "Match conversation started",
    body: `A conversation was opened about "${match.project.title}".`,
    href: `/en/dashboard/messages/${thread.id}`,
  });

  return NextResponse.json({ ok: true, threadId: thread.id });
}
