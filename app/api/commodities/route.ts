import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { commodityInputSchema } from "@/lib/commodity-schema";
import { withTranslation } from "@/lib/l10n";
import { slugify } from "@/lib/utils";

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title).slice(0, 80) || "commodity";
  let slug = base;
  for (let i = 2; ; i++) {
    const exists = await prisma.commodityListing.findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${base}-${i}`;
  }
}

export async function POST(req: Request) {
  const { session, error } = await requireUser();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = commodityInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const listing = await prisma.commodityListing.create({
    data: {
      slug: await uniqueSlug(d.title),
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
      translations: withTranslation(null, "es", { description: d.descriptionEs }),
      status: d.action === "submit" ? "IN_REVIEW" : "DRAFT",
      ownerId: session!.user.id,
    },
  });

  return NextResponse.json({ ok: true, id: listing.id, slug: listing.slug }, { status: 201 });
}
