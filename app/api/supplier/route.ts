import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-helpers";
import { supplierInputSchema } from "@/lib/supplier-schema";
import { countryName } from "@/lib/constants";
import { slugify } from "@/lib/utils";

async function uniqueSlug(name: string): Promise<string> {
  const base = slugify(name).slice(0, 80) || "supplier";
  let slug = base;
  for (let i = 2; ; i++) {
    const exists = await prisma.supplierProfile.findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${base}-${i}`;
  }
}

function parseBody(body: unknown) {
  const parsed = supplierInputSchema.safeParse(body);
  if (!parsed.success) return null;
  const d = parsed.data;
  return {
    name: d.name,
    description: d.description,
    category: d.category,
    countryCode: d.countryCode,
    country: countryName(d.countryCode, "en"),
    city: d.city || null,
    website: d.website || null,
    employees: d.employees ?? null,
    yearsActive: d.yearsActive ?? null,
    certifications: JSON.stringify(d.certifications),
    portfolio: JSON.stringify(d.portfolio),
    capacity: d.capacity || null,
  };
}

export async function POST(req: Request) {
  const { session, error } = await requireRole("SUPPLIER", "ADMIN");
  if (error) return error;

  const existing = await prisma.supplierProfile.findUnique({
    where: { userId: session!.user.id },
  });
  if (existing) {
    return NextResponse.json({ error: "exists" }, { status: 409 });
  }

  const data = parseBody(await req.json().catch(() => null));
  if (!data) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const supplier = await prisma.supplierProfile.create({
    data: {
      ...data,
      slug: await uniqueSlug(data.name),
      userId: session!.user.id,
      status: "IN_REVIEW",
    },
  });

  return NextResponse.json({ ok: true, id: supplier.id }, { status: 201 });
}

export async function PUT(req: Request) {
  const { session, error } = await requireRole("SUPPLIER", "ADMIN");
  if (error) return error;

  const existing = await prisma.supplierProfile.findUnique({
    where: { userId: session!.user.id },
  });
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const data = parseBody(await req.json().catch(() => null));
  if (!data) return NextResponse.json({ error: "invalid" }, { status: 400 });

  // Editing a rejected profile resubmits it to the qualification queue.
  await prisma.supplierProfile.update({
    where: { id: existing.id },
    data: {
      ...data,
      ...(existing.status === "REJECTED" && {
        status: "IN_REVIEW",
        rejectionReason: null,
      }),
    },
  });

  return NextResponse.json({ ok: true, id: existing.id });
}
