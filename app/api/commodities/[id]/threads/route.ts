import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { notify } from "@/lib/notify";

const schema = z.object({ message: z.string().min(5).max(5000) });

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireUser();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const listing = await prisma.commodityListing.findUnique({ where: { id: params.id } });
  if (!listing || listing.status !== "PUBLISHED") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (listing.ownerId === session!.user.id) {
    return NextResponse.json({ error: "own_listing" }, { status: 400 });
  }

  const thread = await prisma.thread.upsert({
    where: {
      commodityListingId_investorId: {
        commodityListingId: listing.id,
        investorId: session!.user.id,
      },
    },
    update: { lastMessageAt: new Date() },
    create: {
      commodityListingId: listing.id,
      investorId: session!.user.id,
      sellerId: listing.ownerId,
      subject: listing.title,
    },
  });

  await prisma.message.create({
    data: {
      threadId: thread.id,
      senderId: session!.user.id,
      body: parsed.data.message,
    },
  });

  await notify({
    userId: listing.ownerId,
    type: "MESSAGE",
    title: "New commodity inquiry",
    body: `New message about "${listing.title}".`,
    href: `/en/dashboard/messages/${thread.id}`,
  });

  return NextResponse.json({ ok: true, threadId: thread.id }, { status: 201 });
}
