import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-helpers";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const supplier = await prisma.supplierProfile.findUnique({
    where: { id: params.id },
  });
  if (!supplier) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await prisma.supplierProfile.update({
    where: { id: supplier.id },
    data: { featured: !supplier.featured },
  });

  return NextResponse.json({ ok: true, featured: !supplier.featured });
}
