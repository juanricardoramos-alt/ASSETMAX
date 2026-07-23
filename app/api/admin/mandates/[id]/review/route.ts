import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-helpers";
import { runMatchingForMandate } from "@/lib/matching";
import { notify } from "@/lib/notify";

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

  const mandate = await prisma.mandate.findUnique({ where: { id: params.id } });
  if (!mandate) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (parsed.data.decision === "approve") {
    await prisma.mandate.update({
      where: { id: mandate.id },
      data: { status: "PUBLISHED", rejectionReason: null },
    });
    await notify({
      userId: mandate.investorId,
      type: "REVIEW",
      title: "Mandate approved",
      body: `"${mandate.title}" is now active. The matching engine is working for you.`,
      href: "/en/dashboard/mandates",
    });
    const matches = await runMatchingForMandate(mandate.id);
    return NextResponse.json({ ok: true, matches });
  }

  await prisma.mandate.update({
    where: { id: mandate.id },
    data: { status: "REJECTED", rejectionReason: parsed.data.reason || null },
  });
  await notify({
    userId: mandate.investorId,
    type: "REVIEW",
    title: "Mandate rejected",
    body: parsed.data.reason || undefined,
    href: "/en/dashboard/mandates",
  });
  return NextResponse.json({ ok: true });
}
