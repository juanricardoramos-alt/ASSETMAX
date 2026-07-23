import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-helpers";
import { ROLES } from "@/lib/constants";

const schema = z.object({
  role: z.enum(ROLES).optional(),
  verifiedSeller: z.boolean().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireRole("ADMIN");
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Admins cannot demote themselves — avoids locking yourself out.
  if (user.id === session!.user.id && parsed.data.role && parsed.data.role !== "ADMIN") {
    return NextResponse.json({ error: "cannot_demote_self" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      ...(parsed.data.role ? { role: parsed.data.role } : {}),
      ...(parsed.data.verifiedSeller !== undefined
        ? { verifiedSeller: parsed.data.verifiedSeller }
        : {}),
    },
  });

  return NextResponse.json({ ok: true });
}
