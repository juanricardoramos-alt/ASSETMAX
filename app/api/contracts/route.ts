import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import {
  createContractFromOffer,
  createNdaContract,
  createCommoditySpaFromMatch,
} from "@/lib/contracts-service";

const schema = z.union([
  z.object({ kind: z.enum(["LOI", "MOU", "SPA"]), offerId: z.string().min(5) }),
  z.object({ kind: z.literal("NDA"), projectId: z.string().min(5) }),
  z.object({ kind: z.literal("COMMODITY_SPA"), matchId: z.string().min(5) }),
]);

export async function POST(req: Request) {
  const { session, error } = await requireUser();
  if (error) return error;
  const userId = session!.user.id;
  const isAdmin = session!.user.role === "ADMIN";

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const d = parsed.data;

  if ("offerId" in d) {
    const offer = await prisma.offer.findUnique({
      where: { id: d.offerId },
      include: { project: { select: { ownerId: true } } },
    });
    if (!offer) return NextResponse.json({ error: "not_found" }, { status: 404 });
    if (!isAdmin && offer.investorId !== userId && offer.project.ownerId !== userId) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const contract = await createContractFromOffer(d.offerId, d.kind);
    return NextResponse.json({ ok: true, id: contract?.id }, { status: 201 });
  }

  if (d.kind === "NDA") {
    const project = await prisma.project.findUnique({ where: { id: d.projectId } });
    if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });
    const acceptance = await prisma.ndaAcceptance.findUnique({
      where: { projectId_userId: { projectId: d.projectId, userId } },
    });
    if (!isAdmin && !acceptance && project.ownerId !== userId) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const contract = await createNdaContract(
      d.projectId,
      acceptance ? userId : project.ownerId,
      acceptance?.fullName ?? ""
    );
    return NextResponse.json({ ok: true, id: contract?.id }, { status: 201 });
  }

  // COMMODITY_SPA
  const match = await prisma.commodityMatch.findUnique({
    where: { id: d.matchId },
    include: {
      sell: { select: { ownerId: true } },
      buy: { select: { ownerId: true } },
    },
  });
  if (!match) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!isAdmin && match.sell.ownerId !== userId && match.buy.ownerId !== userId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const contract = await createCommoditySpaFromMatch(d.matchId);
  return NextResponse.json({ ok: true, id: contract?.id }, { status: 201 });
}
