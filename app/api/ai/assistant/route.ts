import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { aiEnabled, askClaude, type AiMessage } from "@/lib/ai";
import { formatInvestmentRange, formatUsdCompact, parseJsonArray, parseSpecs } from "@/lib/utils";

export const maxDuration = 60;

const schema = z.object({
  projectId: z.string().min(5),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(20),
});

export async function POST(req: Request) {
  if (!aiEnabled()) {
    return NextResponse.json({ error: "ai_disabled" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });

  const session = await auth();

  const project = await prisma.project.findUnique({
    where: { id: parsed.data.projectId },
    include: {
      documents: true,
      owner: { select: { company: true, name: true, verifiedSeller: true } },
    },
  });
  if (!project || project.status !== "PUBLISHED") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const hasNda = session
    ? Boolean(
        await prisma.ndaAcceptance.findUnique({
          where: {
            projectId_userId: {
              projectId: project.id,
              userId: session.user.id,
            },
          },
        })
      )
    : false;

  const publicDocs = project.documents.filter((d) => !d.isConfidential);
  const confidentialDocs = project.documents.filter((d) => d.isConfidential);

  const factSheet = `PROJECT FACT SHEET (the ONLY source of truth):
Title: ${project.title}
Summary: ${project.summary}
Category: ${project.category} | Country: ${project.country} (${project.countryCode}) | Region: ${project.region ?? "n/a"} | City: ${project.city ?? "n/a"}
Stage: ${project.stage} | Deal type: ${project.dealType} | Verified listing: ${project.verified ? "yes" : "no"}
Investment range: ${formatInvestmentRange(project.investmentMin, project.investmentMax)}
Annual revenue: ${project.revenue != null ? formatUsdCompact(project.revenue) : "not disclosed"}
EBITDA: ${project.ebitda != null ? formatUsdCompact(project.ebitda) : "not disclosed"}
Capacity: ${project.capacity ?? "not disclosed"}
Production: ${project.production ?? "not disclosed"}
Permits: ${project.permits ?? "not disclosed"}
Workforce: ${project.workforce ?? "not disclosed"}
Site area (ha): ${project.areaHectares ?? "not disclosed"}
Highlights: ${parseJsonArray(project.highlights).join(" | ") || "none listed"}
Specifications: ${parseSpecs(project.specs).map((s) => `${s.label}: ${s.value}`).join(" | ") || "none listed"}
Full description: ${project.description}
Seller: ${project.owner.company ?? project.owner.name} (verified seller: ${project.owner.verifiedSeller ? "yes" : "no"})
Public documents available: ${publicDocs.map((d) => d.name).join(", ") || "none"}
Data room documents (NDA required): ${confidentialDocs.map((d) => d.name).join(", ") || "none"}
Current user has data room access: ${hasNda ? "yes" : "no"}`;

  const system = `You are the project assistant of VORTAMAX Global for the listing "${project.title}". You answer investor questions using ONLY the project fact sheet provided below. Strict rules:
1. NEVER invent, estimate or extrapolate figures, dates, permits or facts that are not explicitly in the fact sheet.
2. If the requested information is not in the fact sheet, say so explicitly (e.g. "That information is not included in this listing") and suggest requesting it from the seller through the "Request Information" button, or reviewing the data room if documents may cover it.
3. Answer in the same language the user writes in (English or Spanish).
4. Be concise, professional and investor-oriented. You may reformat or summarize fact-sheet data.
5. You are not a financial, legal or tax advisor and must not give investment advice or valuation opinions.

${factSheet}`;

  try {
    const answer = await askClaude({
      system,
      messages: parsed.data.messages.slice(-10) as AiMessage[],
      maxTokens: 800,
      temperature: 0.2,
    });
    return NextResponse.json({ ok: true, answer });
  } catch (e) {
    console.error("[ai/assistant]", e);
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}
