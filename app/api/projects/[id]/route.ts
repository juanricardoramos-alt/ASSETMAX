import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { projectInputSchema } from "@/lib/project-schema";
import { COUNTRIES } from "@/lib/constants";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireUser();
  if (error) return error;

  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const isOwner = project.ownerId === session!.user.id;
  const isAdmin = session!.user.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

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

  // Editing a published project sends it back through verification.
  const nextStatus =
    d.action === "submit"
      ? "IN_REVIEW"
      : project.status === "PUBLISHED"
        ? "IN_REVIEW"
        : "DRAFT";

  await prisma.$transaction([
    prisma.projectImage.deleteMany({ where: { projectId: project.id } }),
    prisma.projectDocument.deleteMany({ where: { projectId: project.id } }),
    prisma.project.update({
      where: { id: project.id },
      data: {
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
        status: nextStatus,
        verified: nextStatus === "IN_REVIEW" ? false : project.verified,
        rejectionReason: null,
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
        images: {
          create: d.images.map((url, i) => ({ url, alt: d.title, order: i })),
        },
        documents: { create: d.documents },
      },
    }),
  ]);

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireUser();
  if (error) return error;

  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const isOwner = project.ownerId === session!.user.id;
  const isAdmin = session!.user.role === "ADMIN";
  if (!isAdmin && !(isOwner && project.status !== "PUBLISHED")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await prisma.project.delete({ where: { id: project.id } });
  return NextResponse.json({ ok: true });
}
