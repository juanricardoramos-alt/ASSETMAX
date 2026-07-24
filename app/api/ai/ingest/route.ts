import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-helpers";
import { aiEnabled, askClaudeJson, type AiMessage } from "@/lib/ai";
import { CATEGORIES, STAGES, DEAL_TYPES, COUNTRIES, COMMODITIES, INCOTERMS } from "@/lib/constants";

export const maxDuration = 60;

const MAX_BYTES = 8 * 1024 * 1024;

async function fileToContent(file: File): Promise<AiMessage["content"]> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) {
    return [
      {
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: buffer.toString("base64"),
        },
      },
      { type: "text", text: "Extract the listing data from this document." },
    ];
  }
  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    const { value } = await mammoth.extractRawText({ buffer });
    return [{ type: "text", text: `DOCUMENT CONTENT:\n\n${value.slice(0, 150_000)}` }];
  }
  if (name.endsWith(".xlsx") || name.endsWith(".xls") || name.endsWith(".csv")) {
    const XLSX = await import("xlsx");
    const wb = XLSX.read(buffer, { type: "buffer" });
    const text = wb.SheetNames.map(
      (s) => `SHEET "${s}":\n${XLSX.utils.sheet_to_csv(wb.Sheets[s])}`
    ).join("\n\n");
    return [{ type: "text", text: `DOCUMENT CONTENT:\n\n${text.slice(0, 150_000)}` }];
  }
  // Fallback: treat as plain text (txt, md)
  return [
    { type: "text", text: `DOCUMENT CONTENT:\n\n${buffer.toString("utf-8").slice(0, 150_000)}` },
  ];
}

export type IngestResult = {
  title: string | null;
  summary: string | null;
  description_en: string | null;
  description_es: string | null;
  category: string | null;
  countryCode: string | null;
  region: string | null;
  city: string | null;
  lat: number | null;
  lng: number | null;
  stage: string | null;
  dealType: string | null;
  investmentMin: number | null;
  investmentMax: number | null;
  revenue: number | null;
  ebitda: number | null;
  capacity: string | null;
  production: string | null;
  permits: string | null;
  workforce: number | null;
  areaHectares: number | null;
  highlights: string[];
  specs: { label: string; value: string }[];
  missingFields: string[];
  publicDocumentSuggestions: string[];
  confidentialDocumentSuggestions: string[];
  // Commodity mode extras
  commodity?: string | null;
  volume?: string | null;
  incoterm?: string | null;
  priceDetails?: string | null;
};

const PROJECT_SYSTEM = `You are the document-ingestion agent of VORTAMAX Global, an international marketplace for industrial assets and megaprojects. You receive a technical report, information memorandum or presentation for an asset that will be listed for sale or investment.

Extract the listing fields into JSON with EXACTLY these keys:
title, summary (1-2 sentences, English, commercial tone), description_en (3-4 paragraphs, professional investment-teaser English), description_es (faithful Spanish version of description_en), category (one of: ${CATEGORIES.join(", ")}), countryCode (ISO-2, one of: ${COUNTRIES.map((c) => c.code).join(", ")}), region, city, lat (number), lng (number), stage (one of: ${STAGES.join(", ")}), dealType (one of: ${DEAL_TYPES.join(", ")}), investmentMin (USD number), investmentMax (USD number), revenue (annual USD number), ebitda (USD number), capacity (short string), production (short string), permits (short string), workforce (integer), areaHectares (number), highlights (array of 3-6 short investor-facing bullet strings), specs (array of {label, value} technical pairs), missingFields (array of short English sentences describing important listing information NOT found in the document, e.g. "Environmental permit status not found"), publicDocumentSuggestions (array of short strings naming document types from this material that are safe to publish publicly), confidentialDocumentSuggestions (array of short strings naming document types that should go to the NDA-protected data room).

Rules:
- Use null for any scalar you cannot find. NEVER invent numbers.
- All monetary values in plain USD numbers (e.g. 85000000).
- Write description_en yourself in polished institutional English based strictly on the document.`;

const COMMODITY_SYSTEM = `You are the document-ingestion agent of VORTAMAX Global's physical commodities marketplace. You receive a technical sheet, certificate of analysis or offer sheet for a physical commodity.

Extract into JSON with EXACTLY these keys:
title (short listing title, English), summary, description_en (2-3 paragraphs), description_es (Spanish version), commodity (one of: ${COMMODITIES.join(", ")}), countryCode (origin, ISO-2 of: ${COUNTRIES.map((c) => c.code).join(", ")}), volume (short string, e.g. "2,000 t/month"), incoterm (one of: ${INCOTERMS.join(", ")}), priceDetails (short string), specs (array of {label, value} pairs — grade, purity, moisture, format, packaging), highlights (3-5 bullets), missingFields (array of short English sentences for important data not found), publicDocumentSuggestions, confidentialDocumentSuggestions.

Set every other key from this list to null: category, region, city, lat, lng, stage, dealType, investmentMin, investmentMax, revenue, ebitda, capacity, production, permits, workforce, areaHectares.
Use null for anything you cannot find. NEVER invent figures.`;

export async function POST(req: Request) {
  const { error } = await requireRole("SELLER", "PARTNER", "ADMIN");
  if (error) return error;

  if (!aiEnabled()) {
    return NextResponse.json({ error: "ai_disabled" }, { status: 503 });
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const mode = form?.get("mode") === "commodity" ? "commodity" : "project";
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  try {
    const content = await fileToContent(file);
    const result = await askClaudeJson<IngestResult>({
      system: mode === "commodity" ? COMMODITY_SYSTEM : PROJECT_SYSTEM,
      messages: [{ role: "user", content }],
      maxTokens: 4096,
    });
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    console.error("[ai/ingest]", e);
    return NextResponse.json({ error: "extraction_failed" }, { status: 502 });
  }
}
