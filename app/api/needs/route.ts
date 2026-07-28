import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-helpers";
import { needInputSchema } from "@/lib/need-schema";
import { countryName } from "@/lib/constants";
import { slugify } from "@/lib/utils";

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title).slice(0, 80) || "need";
  let slug = base;
  for (let i = 2; ; i++) {
    const exists = await prisma.need.findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${base}-${i}`;
  }
}

export async function POST(req: Request) {
  const { session, error } = await requireRole("SELLER", "PARTNER", "ADMIN");
  if (error) return error;

  // Needs are always published under a corporate profile.
  const company = await prisma.companyProfile.findUnique({
    where: { userId: session!.user.id },
  });
  if (!company) {
    return NextResponse.json({ error: "no_company" }, { status: 409 });
  }

  const parsed = needInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const need = await prisma.need.create({
    data: {
      slug: await uniqueSlug(d.title),
      title: d.title,
      description: d.description,
      // EPC tenders are, by definition, EPC-category packages.
      category: d.kind === "EPC_TENDER" ? "epc" : d.category,
      kind: d.kind,
      companyId: company.id,
      countryCode: d.countryCode,
      country: countryName(d.countryCode, "en"),
      city: d.city || null,
      budgetMin: d.budgetMin ?? null,
      budgetMax: d.budgetMax ?? null,
      deadline: d.deadline ? new Date(`${d.deadline}T00:00:00Z`) : null,
      requirements: JSON.stringify(d.requirements),
    },
  });

  return NextResponse.json({ ok: true, id: need.id }, { status: 201 });
}
