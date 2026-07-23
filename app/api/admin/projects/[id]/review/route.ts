import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-helpers";
import { runMatchingForProject } from "@/lib/matching";
import { notify } from "@/lib/notify";

const schema = z.object({
  decision: z.enum(["approve", "reject"]),
  reason: z.string().max(2000).optional().or(z.literal("")),
});

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await requireRole("ADMIN");
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (parsed.data.decision === "approve") {
    await prisma.project.update({
      where: { id: project.id },
      data: {
        status: "PUBLISHED",
        verified: true,
        rejectionReason: null,
        publishedAt: project.publishedAt ?? new Date(),
      },
    });
    await notify({
      userId: project.ownerId,
      type: "REVIEW",
      title: "Project approved & published",
      body: `"${project.title}" is now live with the Verified badge.`,
      href: "/en/dashboard/projects",
    });
    // Newly published projects immediately enter the matching engine.
    const matches = await runMatchingForProject(project.id);
    return NextResponse.json({ ok: true, matches });
  }

  await prisma.project.update({
    where: { id: project.id },
    data: {
      status: "REJECTED",
      verified: false,
      rejectionReason: parsed.data.reason || null,
    },
  });
  await notify({
    userId: project.ownerId,
    type: "REVIEW",
    title: "Project rejected",
    body: parsed.data.reason || undefined,
    href: "/en/dashboard/projects",
  });

  return NextResponse.json({ ok: true });
}
