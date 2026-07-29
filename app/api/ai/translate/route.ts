import { NextResponse } from "next/server";
import { requireRole } from "@/lib/api-helpers";
import { aiEnabled, askClaude } from "@/lib/ai";

export const maxDuration = 60;

const LANG_NAMES = { en: "English", es: "Spanish" } as const;

// Translates listing copy between English and Spanish for the manual wizard's
// "Translate with AI" action. Returns the translation only — the caller marks
// it as an editable machine translation.
export async function POST(req: Request) {
  const { error } = await requireRole("SELLER", "PARTNER", "ADMIN");
  if (error) return error;

  if (!aiEnabled()) {
    return NextResponse.json({ error: "ai_disabled" }, { status: 503 });
  }

  const body = (await req.json().catch(() => null)) as {
    text?: string;
    target?: "en" | "es";
  } | null;
  const text = body?.text?.trim();
  const target = body?.target;
  if (!text || text.length < 20 || (target !== "en" && target !== "es")) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  if (text.length > 20000) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  try {
    const translation = await askClaude({
      system: `You are the translation service of VORTAMAX Global, an institutional marketplace for industrial assets, megaprojects and physical commodities. Translate the user's listing text into polished, professional ${LANG_NAMES[target]} with an investment-teaser register. Keep proper nouns, brand names, market indices (LME, Platts, Fastmarkets), certifications and technical units unchanged. Preserve paragraph breaks. Respond with the translation only — no preamble, no quotes.`,
      messages: [{ role: "user", content: text }],
      maxTokens: 4096,
    });
    return NextResponse.json({ ok: true, translation: translation.trim() });
  } catch (e) {
    console.error("[ai/translate]", e);
    return NextResponse.json({ error: "translation_failed" }, { status: 502 });
  }
}
