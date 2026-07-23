import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { notify } from "@/lib/notify";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireUser();
  if (error) return error;
  const userId = session!.user.id;

  const contract = await prisma.contract.findUnique({ where: { id: params.id } });
  if (!contract) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const isSeller = contract.sellerId === userId;
  const isBuyer = contract.buyerId === userId;
  if (!isSeller && !isBuyer) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const updated = await prisma.contract.update({
    where: { id: contract.id },
    data: isSeller
      ? { sellerReviewedAt: contract.sellerReviewedAt ?? new Date() }
      : { buyerReviewedAt: contract.buyerReviewedAt ?? new Date() },
  });

  if (updated.sellerReviewedAt && updated.buyerReviewedAt) {
    const counterpart = isSeller ? contract.buyerId : contract.sellerId;
    await notify({
      userId: counterpart,
      type: "CONTRACT",
      title: "Draft ready for signature export",
      body: `Both parties reviewed "${contract.title}".`,
      href: `/en/dashboard/contracts/${contract.id}`,
    });
  }

  return NextResponse.json({ ok: true });
}
