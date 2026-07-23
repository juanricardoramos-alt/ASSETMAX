import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireUser();
  if (error) return error;

  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project || project.status !== "PUBLISHED") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const key = { userId: session!.user.id, projectId: params.id };
  const existing = await prisma.favorite.findUnique({
    where: { userId_projectId: key },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorite: false });
  }
  await prisma.favorite.create({ data: key });
  return NextResponse.json({ favorite: true });
}
