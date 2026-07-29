import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-helpers";
import { projectInputSchema } from "@/lib/project-schema";
import { withTranslation } from "@/lib/l10n";
import { COUNTRIES } from "@/lib/constants";
import { slugify } from "@/lib/utils";

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title).slice(0, 80) || "project";
  let slug = base;
  for (let i = 2; ; i++) {
    const exists = await prisma.project.findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${base}-${i}`;
  }
}

export async function POST(req: Request) {
  const { session, error } = await requireRole("SELLER", "PARTNER", "ADMIN");
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = projectInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const country = COUNTRIES.find((c) => c.code === d.countryCode);
  if (!country) {
    return NextResponse.json({ error: "invalid_country" }, { status: 400 });
  }

  const slug = await uniqueSlug(d.title);
  const project = await prisma.project.create({
    data: {
      slug,
      title: d.title,
      summary: d.summary,
      description: d.description,
      category: d.category,
      country: country.en,
      countryCode: d.countryCode,
      region: d.region || null,
      city: d.city || null,
      lat: d.lat ?? null,
      lng: d.lng ?? null,
      stage: d.stage,
      dealType: d.dealType,
      status: d.action === "submit" ? "IN_REVIEW" : "DRAFT",
      investmentMin: d.investmentMin ?? null,
      investmentMax: d.investmentMax ?? null,
      revenue: d.revenue ?? null,
      ebitda: d.ebitda ?? null,
      capacity: d.capacity || null,
      production: d.production || null,
      permits: d.permits || null,
      workforce: d.workforce ?? null,
      areaHectares: d.areaHectares ?? null,
      highlights: JSON.stringify(d.highlights),
      specs: JSON.stringify(d.specs),
      translations: withTranslation(null, "es", { description: d.descriptionEs }),
      ownerId: session!.user.id,
      images: {
        create: d.images.map((url, i) => ({ url, alt: d.title, order: i })),
      },
      documents: { create: d.documents },
    },
  });

  return NextResponse.json({ ok: true, id: project.id, slug }, { status: 201 });
}
