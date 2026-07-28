import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-helpers";

const schema = z.object({
  verified: z.boolean().optional(),
  isAnchor: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const company = await prisma.companyProfile.findUnique({
    where: { id: params.id },
  });
  if (!company) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  await prisma.companyProfile.update({
    where: { id: company.id },
    data: parsed.data,
  });

  return NextResponse.json({ ok: true });
}
