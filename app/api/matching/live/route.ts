import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { CATEGORIES, COUNTRIES, STAGES, SUPPLIER_CATEGORIES } from "@/lib/constants";
import { scoreMandate, scoreSupplier } from "@/lib/live-matching";

const countryCodes = COUNTRIES.map((c) => c.code) as [string, ...string[]];

const schema = z.object({
  title: z.string().min(3).max(200),
  category: z.enum(CATEGORIES),
  countryCode: z.enum(countryCodes),
  amount: z.number().positive().max(1e13).nullable().optional(),
  stage: z.enum(STAGES),
  supplierCategory: z.enum(SUPPLIER_CATEGORIES),
});

const INVESTOR_THRESHOLD = 40;

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const input = { ...parsed.data, amount: parsed.data.amount ?? null };

  // Confidential mandates participate in matching but are shown masked —
  // same policy as the AI matching engine.
  const [mandates, suppliers] = await Promise.all([
    prisma.mandate.findMany({
      where: { status: "PUBLISHED" },
      include: { investor: { select: { name: true, company: true } } },
    }),
    prisma.supplierProfile.findMany({ where: { status: "PUBLISHED" } }),
  ]);

  const investors = mandates
    .map((m) => scoreMandate(input, m))
    // Sector is a hard gate: a mandate restricted to other sectors never
    // qualifies, however good the ticket/geography fit.
    .filter(
      (m) =>
        m.score >= INVESTOR_THRESHOLD &&
        (m.components.find((c) => c.key === "sector")?.points ?? 0) > 0
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const supplierMatches = suppliers
    .map((s) => scoreSupplier(input, s))
    .filter((s) => s.category === input.supplierCategory) // hard requirement
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return NextResponse.json({ investors, suppliers: supplierMatches });
}
