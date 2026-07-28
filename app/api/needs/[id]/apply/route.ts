import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { applicationInputSchema } from "@/lib/supplier-schema";
import { notify } from "@/lib/notify";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireUser();
  if (error) return error;

  const need = await prisma.need.findUnique({
    where: { id: params.id },
    include: { company: { select: { userId: true, name: true } } },
  });
  if (!need) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (need.status !== "OPEN") {
    return NextResponse.json({ error: "closed" }, { status: 409 });
  }
  if (need.company.userId === session!.user.id) {
    return NextResponse.json({ error: "own_need" }, { status: 403 });
  }

  // Only suppliers qualified by the platform team can apply.
  const supplier = await prisma.supplierProfile.findUnique({
    where: { userId: session!.user.id },
  });
  if (!supplier || supplier.status !== "PUBLISHED") {
    return NextResponse.json({ error: "not_qualified" }, { status: 403 });
  }

  const existing = await prisma.supplierApplication.findUnique({
    where: { needId_supplierId: { needId: need.id, supplierId: supplier.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "already_applied" }, { status: 409 });
  }

  const parsed = applicationInputSchema.safeParse(
    await req.json().catch(() => null)
  );
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const d = parsed.data;
  const application = await prisma.supplierApplication.create({
    data: {
      needId: need.id,
      supplierId: supplier.id,
      message: d.message,
      proposedBudget: d.proposedBudget ?? null,
      leadTime: d.leadTime || null,
    },
  });

  await notify({
    userId: need.company.userId,
    type: "APPLICATION",
    title: `${supplier.name} → ${need.title}`,
    body: d.message.slice(0, 140),
    href: `/en/dashboard/needs/${need.id}`,
  });

  return NextResponse.json({ ok: true, id: application.id }, { status: 201 });
}
