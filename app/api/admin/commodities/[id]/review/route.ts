import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-helpers";
import { runMatchingForCommodity } from "@/lib/matching";
import { notify } from "@/lib/notify";

const schema = z.object({
  decision: z.enum(["approve", "reject"]),
  reason: z.string().max(2000).optional().or(z.literal("")),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const listing = await prisma.commodityListing.findUnique({ where: { id: params.id } });
  if (!listing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (parsed.data.decision === "approve") {
    await prisma.commodityListing.update({
      where: { id: listing.id },
      data: { status: "PUBLISHED", verified: true, rejectionReason: null },
    });
    await notify({
      userId: listing.ownerId,
      type: "REVIEW",
      title: "Commodity listing approved",
      body: `"${listing.title}" is now live.`,
      href: "/en/dashboard/commodities",
    });
    const matches = await runMatchingForCommodity(listing.id);
    return NextResponse.json({ ok: true, matches });
  }

  await prisma.commodityListing.update({
    where: { id: listing.id },
    data: { status: "REJECTED", verified: false, rejectionReason: parsed.data.reason || null },
  });
  await notify({
    userId: listing.ownerId,
    type: "REVIEW",
    title: "Commodity listing rejected",
    body: parsed.data.reason || undefined,
    href: "/en/dashboard/commodities",
  });
  return NextResponse.json({ ok: true });
}
