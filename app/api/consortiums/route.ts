import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { notify } from "@/lib/notify";

const schema = z.object({
  needId: z.string().min(1),
  name: z.string().min(3).max(160),
  members: z
    .array(
      z.object({
        supplierId: z.string().min(1),
        role: z.string().max(120).optional().or(z.literal("")),
      })
    )
    .min(1)
    .max(6),
  leaderRole: z.string().max(120).optional().or(z.literal("")),
  message: z.string().min(20).max(4000),
  proposedBudget: z.number().positive().max(1e13).nullable().optional(),
  leadTime: z.string().max(200).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const { session, error } = await requireUser();
  if (error) return error;

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const d = parsed.data;

  // The leader must be a qualified (published) supplier.
  const leader = await prisma.supplierProfile.findUnique({
    where: { userId: session!.user.id },
  });
  if (!leader || leader.status !== "PUBLISHED") {
    return NextResponse.json({ error: "not_qualified" }, { status: 403 });
  }

  const need = await prisma.need.findUnique({
    where: { id: d.needId },
    include: { company: { select: { userId: true, name: true } } },
  });
  if (!need) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (need.status !== "OPEN") {
    return NextResponse.json({ error: "closed" }, { status: 409 });
  }
  if (need.company.userId === session!.user.id) {
    return NextResponse.json({ error: "own_need" }, { status: 403 });
  }

  const existing = await prisma.supplierApplication.findUnique({
    where: { needId_supplierId: { needId: need.id, supplierId: leader.id } },
  });
  if (existing) {
    return NextResponse.json({ error: "already_applied" }, { status: 409 });
  }

  // Members must be qualified suppliers, distinct from the leader.
  const memberIds = Array.from(
    new Set(d.members.map((m) => m.supplierId).filter((id) => id !== leader.id))
  );
  if (memberIds.length === 0) {
    return NextResponse.json({ error: "no_members" }, { status: 400 });
  }
  const members = await prisma.supplierProfile.findMany({
    where: { id: { in: memberIds }, status: "PUBLISHED" },
  });
  if (members.length !== memberIds.length) {
    return NextResponse.json({ error: "invalid_members" }, { status: 400 });
  }

  const roleFor = new Map(
    d.members.map((m) => [m.supplierId, m.role?.trim() || null])
  );

  const consortium = await prisma.consortium.create({
    data: {
      name: d.name,
      needId: need.id,
      leaderId: leader.id,
      members: {
        create: [
          { supplierId: leader.id, role: d.leaderRole?.trim() || null },
          ...members.map((m) => ({
            supplierId: m.id,
            role: roleFor.get(m.id) ?? null,
          })),
        ],
      },
    },
  });

  const application = await prisma.supplierApplication.create({
    data: {
      needId: need.id,
      supplierId: leader.id,
      consortiumId: consortium.id,
      message: d.message,
      proposedBudget: d.proposedBudget ?? null,
      leadTime: d.leadTime || null,
    },
  });

  // Notify the requesting company (one candidacy) and each included member.
  await notify({
    userId: need.company.userId,
    type: "APPLICATION",
    title: `${d.name} (${members.length + 1}) → ${need.title}`,
    body: d.message.slice(0, 140),
    href: `/en/dashboard/needs/${need.id}`,
  });
  for (const m of members) {
    await notify({
      userId: m.userId,
      type: "APPLICATION",
      title: `${d.name} · ${leader.name}`,
      body: need.title,
      href: `/en/dashboard/applications`,
    });
  }

  return NextResponse.json(
    { ok: true, id: consortium.id, applicationId: application.id },
    { status: 201 }
  );
}
