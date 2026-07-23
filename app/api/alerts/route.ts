import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { CATEGORIES, STAGES, DEAL_TYPES } from "@/lib/constants";

const schema = z.object({
  name: z.string().min(3).max(160),
  category: z.enum(CATEGORIES).optional().or(z.literal("")),
  country: z.string().length(2).optional().or(z.literal("")),
  stage: z.enum(STAGES).optional().or(z.literal("")),
  dealType: z.enum(DEAL_TYPES).optional().or(z.literal("")),
  minInvestment: z.number().positive().nullable().optional(),
  maxInvestment: z.number().positive().nullable().optional(),
});

export async function POST(req: Request) {
  const { session, error } = await requireUser();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const d = parsed.data;
  const alert = await prisma.alert.create({
    data: {
      userId: session!.user.id,
      name: d.name,
      category: d.category || null,
      country: d.country || null,
      stage: d.stage || null,
      dealType: d.dealType || null,
      minInvestment: d.minInvestment ?? null,
      maxInvestment: d.maxInvestment ?? null,
    },
  });

  return NextResponse.json({ ok: true, id: alert.id }, { status: 201 });
}
