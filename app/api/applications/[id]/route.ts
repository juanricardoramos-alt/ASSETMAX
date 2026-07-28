import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { notify } from "@/lib/notify";

const schema = z.object({
  status: z.enum(["IN_DISCUSSION", "ACCEPTED", "DECLINED", "WITHDRAWN"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { session, error } = await requireUser();
  if (error) return error;

  const application = await prisma.supplierApplication.findUnique({
    where: { id: params.id },
    include: {
      need: {
        select: {
          id: true,
          title: true,
          company: { select: { userId: true, name: true } },
        },
      },
      supplier: { select: { userId: true, name: true } },
    },
  });
  if (!application) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const nextStatus = parsed.data.status;

  const isCompany = application.need.company.userId === session!.user.id;
  const isSupplier = application.supplier.userId === session!.user.id;

  // Companies decide on applications; suppliers may only withdraw their own.
  if (nextStatus === "WITHDRAWN" ? !isSupplier : !isCompany) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  await prisma.supplierApplication.update({
    where: { id: application.id },
    data: { status: nextStatus },
  });

  if (isCompany) {
    await notify({
      userId: application.supplier.userId,
      type: "APPLICATION",
      title: `${application.need.company.name}: ${application.need.title}`,
      body: nextStatus,
      href: `/en/dashboard/applications`,
    });
  } else {
    await notify({
      userId: application.need.company.userId,
      type: "APPLICATION",
      title: `${application.supplier.name} — ${application.need.title}`,
      body: nextStatus,
      href: `/en/dashboard/needs/${application.need.id}`,
    });
  }

  return NextResponse.json({ ok: true });
}
