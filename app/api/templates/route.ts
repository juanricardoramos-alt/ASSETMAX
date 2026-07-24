import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/api-helpers";
import { generateContract } from "@/lib/contracts";
import { COUNTRIES, TEMPLATE_KINDS } from "@/lib/constants";

export const maxDuration = 60;

const KIND_TITLES: Record<(typeof TEMPLATE_KINDS)[number], { en: string; es: string }> = {
  INTERMEDIATION: { en: "Intermediation Mandate", es: "Mandato de Intermediación" },
  INTERMEDIATION_EXCLUSIVE: {
    en: "Exclusive Intermediation Mandate",
    es: "Mandato de Intermediación Exclusivo",
  },
  NDA: { en: "Non-Disclosure Agreement", es: "Acuerdo de Confidencialidad" },
  LOI: { en: "Letter of Intent", es: "Carta de Intención" },
  MOU: { en: "Memorandum of Understanding", es: "Memorándum de Entendimiento" },
  SPA: { en: "Asset Purchase Agreement", es: "Promesa de Compraventa de Activo" },
  JV: { en: "Joint Venture Agreement", es: "Acuerdo de Participación / JV" },
  COMMODITY_SPA: { en: "Commodity Sale Contract", es: "Compraventa de Commodities" },
  COMMODITY_SUPPLY: { en: "Commodity Supply Contract", es: "Contrato de Suministro" },
};

const PLATFORM_PARTY = "VORTAMAX Global";
const INTERMEDIATION_KINDS = ["INTERMEDIATION", "INTERMEDIATION_EXCLUSIVE"] as const;

const inputSchema = z.object({
  kind: z.enum(TEMPLATE_KINDS),
  language: z.enum(["en", "es"]),
  partyAName: z.string().min(2).max(120),
  partyACompany: z.string().max(160).optional().or(z.literal("")),
  partyBName: z.string().max(120).optional().or(z.literal("")),
  partyBCompany: z.string().max(160).optional().or(z.literal("")),
  projectId: z.string().max(60).optional().or(z.literal("")),
  assetTitle: z.string().max(200).optional().or(z.literal("")),
  assetLocation: z.string().max(200).optional().or(z.literal("")),
  jurisdictionCode: z.string().length(2),
  amount: z.number().positive().max(1e13).nullable().optional(),
  equityPct: z.number().positive().max(100).nullable().optional(),
  termMonths: z.number().int().positive().max(240).nullable().optional(),
  exclusivityMonths: z.number().int().positive().max(120).nullable().optional(),
  commodity: z.string().max(80).optional().or(z.literal("")),
  volume: z.string().max(160).optional().or(z.literal("")),
  incoterm: z.string().max(10).optional().or(z.literal("")),
  priceDetails: z.string().max(300).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const { session, error } = await requireUser();
  if (error) return error;

  const body = await req.json().catch(() => null);
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", details: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const d = parsed.data;

  const country = COUNTRIES.find((c) => c.code === d.jurisdictionCode);
  if (!country) {
    return NextResponse.json({ error: "invalid_country" }, { status: 400 });
  }
  const jurisdiction = d.language === "es" ? country.es : country.en;

  // Optional link to one of the creator's own listings.
  let assetTitle = d.assetTitle?.trim() || "";
  let assetLocation = d.assetLocation?.trim() || "";
  let projectId: string | null = null;
  if (d.projectId) {
    const project = await prisma.project.findUnique({ where: { id: d.projectId } });
    if (project && (project.ownerId === session!.user.id || session!.user.role === "ADMIN")) {
      projectId = project.id;
      assetTitle = assetTitle || project.title;
      assetLocation =
        assetLocation || [project.city, project.country].filter(Boolean).join(", ");
    }
  }
  if (!assetTitle) assetTitle = "[ASSET TO BE SPECIFIED]";
  if (!assetLocation) assetLocation = "[LOCATION]";

  const isIntermediation = (INTERMEDIATION_KINDS as readonly string[]).includes(d.kind);
  const partyACompany = d.partyACompany?.trim() || d.partyAName.trim();
  const partyBName = isIntermediation
    ? d.language === "es"
      ? "[Representante Legal]"
      : "[Legal Representative]"
    : d.partyBName?.trim() || "[COUNTERPARTY]";
  const partyBCompany = isIntermediation
    ? PLATFORM_PARTY
    : d.partyBCompany?.trim() || partyBName;

  const content = await generateContract({
    kind: d.kind,
    language: d.language,
    sellerName: d.partyAName.trim(),
    sellerCompany: partyACompany,
    buyerName: partyBName,
    buyerCompany: partyBCompany,
    assetTitle,
    assetLocation,
    jurisdiction,
    amount: d.amount ?? null,
    equityPct: d.equityPct ?? null,
    termMonths: d.termMonths ?? null,
    exclusivityMonths: d.exclusivityMonths ?? null,
    commodity: d.commodity?.trim() || null,
    volume: d.volume?.trim() || null,
    incoterm: d.incoterm?.trim() || null,
    priceDetails: d.priceDetails?.trim() || null,
  });

  const doc = await prisma.generatedDocument.create({
    data: {
      kind: d.kind,
      language: d.language,
      title: `${KIND_TITLES[d.kind][d.language]} — ${assetTitle}`,
      content,
      partyA: partyACompany,
      partyB: partyBCompany,
      projectId,
      createdById: session!.user.id,
    },
  });

  return NextResponse.json({ ok: true, id: doc.id }, { status: 201 });
}
