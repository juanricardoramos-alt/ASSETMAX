import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { mandateInputSchema } from "@/lib/mandate-schema";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireUser();
  if (error) return error;

  const mandate = await prisma.mandate.findUnique({ where: { id: params.id } });
  if (!mandate) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (mandate.investorId !== session!.user.id && session!.user.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = mandateInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const d = parsed.data;
  const nextStatus =
    d.action === "submit"
      ? "IN_REVIEW"
      : mandate.status === "PUBLISHED"
        ? "IN_REVIEW"
        : "DRAFT";

  await prisma.mandate.update({
    where: { id: mandate.id },
    data: {
      title: d.title,
      description: d.description,
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
      status: nextStatus,
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

  const mandate = await prisma.mandate.findUnique({ where: { id: params.id } });
  if (!mandate) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const isOwner = mandate.investorId === session!.user.id;
  if (!isOwner && session!.user.role !== "ADMIN") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await prisma.mandate.delete({ where: { id: mandate.id } });
  return NextResponse.json({ ok: true });
}
