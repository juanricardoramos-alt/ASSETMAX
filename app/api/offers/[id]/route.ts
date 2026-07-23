import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";

const schema = z.object({
  status: z.enum(["IN_DISCUSSION", "ACCEPTED", "DECLINED", "WITHDRAWN"]),
});

export async function PATCH(
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

  const offer = await prisma.offer.findUnique({
    where: { id: params.id },
    include: { project: { select: { ownerId: true } } },
  });
  if (!offer) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const userId = session!.user.id;
  const isSeller = offer.project.ownerId === userId;
  const isInvestor = offer.investorId === userId;
  const isAdmin = session!.user.role === "ADMIN";

  const status = parsed.data.status;
  const sellerAllowed = ["IN_DISCUSSION", "ACCEPTED", "DECLINED"].includes(status);
  const investorAllowed = status === "WITHDRAWN";

  if (
    !isAdmin &&
    !(isSeller && sellerAllowed) &&
    !(isInvestor && investorAllowed)
  ) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await prisma.offer.update({ where: { id: offer.id }, data: { status } });
  return NextResponse.json({ ok: true });
}
