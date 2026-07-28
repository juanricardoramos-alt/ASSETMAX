import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { needInputSchema } from "@/lib/need-schema";
import { countryName, NEED_STATUSES } from "@/lib/constants";

const updateSchema = needInputSchema.partial().extend({
  status: z.enum(NEED_STATUSES).optional(),
});

async function ownNeed(needId: string, userId: string) {
  const need = await prisma.need.findUnique({
    where: { id: needId },
    include: { company: { select: { userId: true } } },
  });
  if (!need) return { need: null, response: NextResponse.json({ error: "not_found" }, { status: 404 }) };
  if (need.company.userId !== userId) {
    return { need: null, response: NextResponse.json({ error: "forbidden" }, { status: 403 }) };
  }
  return { need, response: null };
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireUser();
  if (error) return error;

  const { need, response } = await ownNeed(params.id, session!.user.id);
  if (!need) return response!;

  const parsed = updateSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const d = parsed.data;
  await prisma.need.update({
    where: { id: need.id },
    data: {
      ...(d.title !== undefined && { title: d.title }),
      ...(d.description !== undefined && { description: d.description }),
      ...(d.category !== undefined && { category: d.category }),
      ...(d.countryCode !== undefined && {
        countryCode: d.countryCode,
        country: countryName(d.countryCode, "en"),
      }),
      ...(d.city !== undefined && { city: d.city || null }),
      ...(d.budgetMin !== undefined && { budgetMin: d.budgetMin }),
      ...(d.budgetMax !== undefined && { budgetMax: d.budgetMax }),
      ...(d.deadline !== undefined && {
        deadline: d.deadline ? new Date(`${d.deadline}T00:00:00Z`) : null,
      }),
      ...(d.requirements !== undefined && {
        requirements: JSON.stringify(d.requirements),
      }),
      ...(d.status !== undefined && { status: d.status }),
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireUser();
  if (error) return error;

  const { need, response } = await ownNeed(params.id, session!.user.id);
  if (!need) return response!;

  await prisma.need.delete({ where: { id: need.id } });
  return NextResponse.json({ ok: true });
}
