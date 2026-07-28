import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-helpers";
import { notify } from "@/lib/notify";

const schema = z.object({
  action: z.enum(["approve", "reject"]),
  reason: z.string().max(1000).optional().or(z.literal("")),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const supplier = await prisma.supplierProfile.findUnique({
    where: { id: params.id },
  });
  if (!supplier) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (parsed.data.action === "approve") {
    await prisma.supplierProfile.update({
      where: { id: supplier.id },
      data: { status: "PUBLISHED", verified: true, rejectionReason: null },
    });
  } else {
    await prisma.supplierProfile.update({
      where: { id: supplier.id },
      data: {
        status: "REJECTED",
        verified: false,
        rejectionReason: parsed.data.reason || null,
      },
    });
  }

  await notify({
    userId: supplier.userId,
    type: "REVIEW",
    title: supplier.name,
    body: parsed.data.action === "approve" ? "PUBLISHED" : "REJECTED",
    href: `/en/dashboard/supplier`,
  });

  return NextResponse.json({ ok: true });
}
