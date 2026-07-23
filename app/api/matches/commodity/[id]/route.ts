import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { notify } from "@/lib/notify";

const schema = z.object({ status: z.enum(["CONTACTED", "DISMISSED"]) });

async function loadMatch(id: string) {
  return prisma.commodityMatch.findUnique({
    where: { id },
    include: {
      sell: { select: { id: true, title: true, ownerId: true } },
      buy: { select: { id: true, title: true, ownerId: true } },
    },
  });
}

function isParticipant(
  match: NonNullable<Awaited<ReturnType<typeof loadMatch>>>,
  userId: string,
  role: string
) {
  return (
    role === "ADMIN" || match.sell.ownerId === userId || match.buy.ownerId === userId
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

  await prisma.commodityMatch.update({
    where: { id: match.id },
    data: { status: parsed.data.status },
  });
  return NextResponse.json({ ok: true });
}

/** Start a conversation from a commodity match (thread lives on the sell listing). */
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
      commodityListingId_investorId: {
        commodityListingId: match.sell.id,
        investorId: match.buy.ownerId,
      },
    },
    update: { lastMessageAt: new Date() },
    create: {
      commodityListingId: match.sell.id,
      investorId: match.buy.ownerId,
      sellerId: match.sell.ownerId,
      subject: match.sell.title,
    },
  });

  await prisma.message.create({
    data: {
      threadId: thread.id,
      senderId: session!.user.id,
      body: `[ASSETMAX Matching] This conversation was opened from the commodity match between "${match.sell.title}" and "${match.buy.title}" (${match.score}% compatibility).`,
    },
  });

  await prisma.commodityMatch.update({
    where: { id: match.id },
    data: { status: "CONTACTED" },
  });

  const counterpart =
    session!.user.id === match.sell.ownerId ? match.buy.ownerId : match.sell.ownerId;
  await notify({
    userId: counterpart,
    type: "MESSAGE",
    title: "Match conversation started",
    body: `A conversation was opened about "${match.sell.title}".`,
    href: `/en/dashboard/messages/${thread.id}`,
  });

  return NextResponse.json({ ok: true, threadId: thread.id });
}
