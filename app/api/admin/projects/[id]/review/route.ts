import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-helpers";

const schema = z.object({
  decision: z.enum(["approve", "reject"]),
  reason: z.string().max(2000).optional().or(z.literal("")),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (parsed.data.decision === "approve") {
    await prisma.project.update({
      where: { id: project.id },
      data: {
        status: "PUBLISHED",
        verified: true,
        rejectionReason: null,
        publishedAt: project.publishedAt ?? new Date(),
      },
    });
  } else {
    await prisma.project.update({
      where: { id: project.id },
      data: {
        status: "REJECTED",
        verified: false,
        rejectionReason: parsed.data.reason || null,
      },
    });
  }

  return NextResponse.json({ ok: true });
}
