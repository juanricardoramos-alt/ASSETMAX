import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-helpers";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const updated = await prisma.project.update({
    where: { id: project.id },
    data: { featured: !project.featured },
  });

  return NextResponse.json({ ok: true, featured: updated.featured });
}
