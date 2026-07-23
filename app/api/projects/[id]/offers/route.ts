import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { OFFER_TYPES } from "@/lib/constants";

const schema = z.object({
  amount: z.number().positive().max(1e13),
  type: z.enum(OFFER_TYPES),
  equityPct: z.number().min(0.1).max(100).optional(),
  message: z.string().min(10).max(5000),
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
  if (project.ownerId === session!.user.id) {
    return NextResponse.json({ error: "own_project" }, { status: 400 });
  }

  const offer = await prisma.offer.create({
    data: {
      projectId: project.id,
      investorId: session!.user.id,
      amount: parsed.data.amount,
      type: parsed.data.type,
      equityPct: parsed.data.equityPct,
      message: parsed.data.message,
    },
  });

  return NextResponse.json({ ok: true, id: offer.id }, { status: 201 });
}
