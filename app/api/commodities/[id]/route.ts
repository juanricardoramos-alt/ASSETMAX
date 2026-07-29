import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { commodityInputSchema } from "@/lib/commodity-schema";
import { withTranslation } from "@/lib/l10n";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireUser();
  if (error) return error;

  const listing = await prisma.commodityListing.findUnique({ where: { id: params.id } });
  if (!listing) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (listing.ownerId !== session!.user.id && session!.user.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = commodityInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const d = parsed.data;
  const nextStatus =
    d.action === "submit"
      ? "IN_REVIEW"
      : listing.status === "PUBLISHED"
        ? "IN_REVIEW"
        : "DRAFT";

  await prisma.commodityListing.update({
    where: { id: listing.id },
    data: {
      side: d.side,
      commodity: d.commodity,
      title: d.title,
      description: d.description,
      specs: JSON.stringify(d.specs),
      volume: d.volume,
      periodicity: d.periodicity,
      originCode: d.originCode || null,
      destinationCode: d.destinationCode || null,
      incoterm: d.incoterm,
      deliveryLocation: d.deliveryLocation || null,
      priceType: d.priceType,
      priceDetails: d.priceDetails || null,
      validUntil: d.validUntil ? new Date(d.validUntil) : null,
      documents: JSON.stringify(d.documents),
      translations: withTranslation(listing.translations, "es", {
        description: d.descriptionEs,
      }),
      status: nextStatus,
      verified: nextStatus === "IN_REVIEW" ? false : listing.verified,
      rejectionReason: null,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireUser();
  if (error) return error;

  const listing = await prisma.commodityListing.findUnique({ where: { id: params.id } });
  if (!listing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const isOwner = listing.ownerId === session!.user.id;
  const isAdmin = session!.user.role === "ADMIN";
  if (!isAdmin && !(isOwner && listing.status !== "PUBLISHED")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await prisma.commodityListing.delete({ where: { id: listing.id } });
  return NextResponse.json({ ok: true });
}
