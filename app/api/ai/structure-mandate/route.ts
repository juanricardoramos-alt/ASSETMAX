import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/api-helpers";
import { aiEnabled, askClaudeJson } from "@/lib/ai";
import { CATEGORIES, STAGES, DEAL_TYPES, COUNTRIES } from "@/lib/constants";

const schema = z.object({ text: z.string().min(20).max(8000) });

export type StructuredMandate = {
  title: string;
  description: string;
  categories: string[];
  countries: string[];
  stages: string[];
  dealTypes: string[];
  ticketMin: number | null;
  ticketMax: number | null;
  equityMin: number | null;
  equityMax: number | null;
  conditions: string | null;
};

const SYSTEM = `You are the mandate-structuring agent of VORTAMAX Global. An investor describes what they are looking for in free text. Convert it into structured search criteria as JSON with EXACTLY these keys:

title (short professional mandate title in English), description (2-3 paragraph polished English version of the requirement), categories (array from: ${CATEGORIES.join(", ")}), countries (array of ISO-2 codes from: ${COUNTRIES.map((c) => c.code).join(", ")} — only those explicitly implied), stages (array from: ${STAGES.join(", ")}), dealTypes (array from: ${DEAL_TYPES.join(", ")}), ticketMin (USD number or null), ticketMax (USD number or null), equityMin (percent number or null), equityMax (percent number or null), conditions (short string of key conditions, or null).

Rules: empty array means "no restriction". Use null when the text does not specify a value. NEVER invent amounts that are not stated or clearly implied.`;

export async function POST(req: Request) {
  const { error } = await requireUser();
  if (error) return error;

  if (!aiEnabled()) {
    return NextResponse.json({ error: "ai_disabled" }, { status: 503 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  try {
    const result = await askClaudeJson<StructuredMandate>({
      system: SYSTEM,
      messages: [{ role: "user", content: parsed.data.text }],
      maxTokens: 2048,
    });
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    console.error("[ai/structure-mandate]", e);
    return NextResponse.json({ error: "failed" }, { status: 502 });
  }
}
