import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-helpers";
import { companyInputSchema } from "@/lib/company-schema";
import { countryName } from "@/lib/constants";
import { slugify } from "@/lib/utils";

async function uniqueSlug(name: string): Promise<string> {
  const base = slugify(name).slice(0, 80) || "company";
  let slug = base;
  for (let i = 2; ; i++) {
    const exists = await prisma.companyProfile.findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${base}-${i}`;
  }
}

function parseBody(body: unknown) {
  const parsed = companyInputSchema.safeParse(body);
  if (!parsed.success) return null;
  const d = parsed.data;
  return {
    name: d.name,
    legalName: d.legalName || null,
    description: d.description,
    sector: d.sector,
    countryCode: d.countryCode,
    country: countryName(d.countryCode, "en"),
    city: d.city || null,
    website: d.website || null,
    founded: d.founded ?? null,
    employees: d.employees ?? null,
  };
}

export async function POST(req: Request) {
  const { session, error } = await requireRole("SELLER", "PARTNER", "ADMIN");
  if (error) return error;

  const existing = await prisma.companyProfile.findUnique({
    where: { userId: session!.user.id },
  });
  if (existing) {
    return NextResponse.json({ error: "exists" }, { status: 409 });
  }

  const data = parseBody(await req.json().catch(() => null));
  if (!data) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const company = await prisma.companyProfile.create({
    data: {
      ...data,
      slug: await uniqueSlug(data.name),
      userId: session!.user.id,
    },
  });

  return NextResponse.json({ ok: true, id: company.id }, { status: 201 });
}

export async function PUT(req: Request) {
  const { session, error } = await requireRole("SELLER", "PARTNER", "ADMIN");
  if (error) return error;

  const existing = await prisma.companyProfile.findUnique({
    where: { userId: session!.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const data = parseBody(await req.json().catch(() => null));
  if (!data) return NextResponse.json({ error: "invalid" }, { status: 400 });

  await prisma.companyProfile.update({ where: { id: existing.id }, data });

  return NextResponse.json({ ok: true, id: existing.id });
}
