import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";

const schema = z.object({
  fullName: z.string().min(5).max(160),
  company: z.string().max(160).optional().or(z.literal("")),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireUser();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project || project.status !== "PUBLISHED") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await prisma.ndaAcceptance.upsert({
    where: {
      projectId_userId: { projectId: project.id, userId: session!.user.id },
    },
    update: {},
    create: {
      projectId: project.id,
      userId: session!.user.id,
      fullName: parsed.data.fullName,
      company: parsed.data.company || null,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
