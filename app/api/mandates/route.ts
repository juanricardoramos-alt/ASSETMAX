import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { mandateInputSchema } from "@/lib/mandate-schema";
import { slugify } from "@/lib/utils";

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title).slice(0, 80) || "mandate";
  let slug = base;
  for (let i = 2; ; i++) {
    const exists = await prisma.mandate.findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${base}-${i}`;
  }
}

export async function POST(req: Request) {
  const { session, error } = await requireUser();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = mandateInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const mandate = await prisma.mandate.create({
    data: {
      slug: await uniqueSlug(d.title),
      title: d.title,
      description: d.description,
      investorId: session!.user.id,
      categories: JSON.stringify(d.categories),
      countries: JSON.stringify(d.countries),
      stages: JSON.stringify(d.stages),
      dealTypes: JSON.stringify(d.dealTypes),
      ticketMin: d.ticketMin ?? null,
      ticketMax: d.ticketMax ?? null,
      equityMin: d.equityMin ?? null,
      equityMax: d.equityMax ?? null,
      conditions: d.conditions || null,
      isPublic: d.isPublic,
      status: d.action === "submit" ? "IN_REVIEW" : "DRAFT",
    },
  });

  return NextResponse.json({ ok: true, id: mandate.id }, { status: 201 });
}
