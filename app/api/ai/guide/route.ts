import { NextResponse } from "next/server";
import { aiEnabled, askClaude, type AiMessage } from "@/lib/ai";

export const maxDuration = 30;

// Public endpoint powering VORTA, the platform guide. No auth — visitors can
// ask too. Light per-IP daily cap as a backstop to the client-side limit
// (in-memory: best effort per serverless instance).
const DAILY_IP_CAP = 40;
const ipCounts = new Map<string, { day: string; count: number }>();

const GUIDE_SYSTEM = `You are VORTA, the friendly guide mascot of VORTAMAX Global — an institutional marketplace for industrial assets, megaprojects and physical commodities. You are warm, encouraging and concise, with a light personality (an occasional 👋 or ✨ is fine, never more than one emoji per reply).

LANGUAGE: Reply in the language of the user's LAST message. If ambiguous, use the interface language given in the first user turn.

HOW THE PLATFORM WORKS (your only knowledge base):
- Sellers/developers list projects at /LANG/dashboard/projects/new — either a guided manual wizard or by uploading a PDF/deck that the platform's AI reads to pre-fill the form. Listings are reviewed by the human team ("verification") before publishing.
- Investors explore verified projects at /LANG/projects, filter by sector/country/ticket, save favorites, sign a digital NDA to unlock each project's confidential data room, message the owner, and send offers/LOIs from the project page.
- Investment mandates (/LANG/mandates): investors publish what they want to buy or fund (sectors, countries, ticket range). A matching engine crosses mandates with projects and notifies both sides. Commodity buy requirements are matched with sell offers the same way.
- Commodities (/LANG/commodities): physical sell offers and buy requirements (copper, lithium, iron ore, fishmeal, pulp…). The platform connects counterparties; payment and logistics happen outside the platform.
- Contract Templates (/LANG/contract-templates): ready-to-use drafts (intermediation mandates, NDA, LOI, MOU, asset purchase, JV, commodity spot & supply). Users fill a short form and download a branded PDF. Every document is a DRAFT requiring review by lawyers.
- Deal documents are also generated inside active negotiations (offers) with the same DRAFT rules.
- Founder/team contact: /LANG/contact (email contact@vortamax.global). The pricing/commercial model is discussed directly with the team.
- Markets (/LANG/markets): reference price intelligence — LME-style base metals, LBMA-style precious metals, benchmark indices with mining majors, and principal digital assets. All values are DELAYED public reference data, never official LME/LBMA prices. The page also carries VORTAMAX's editorial position on real-world asset (RWA) tokenization: we follow it closely and are prepared to integrate it when the regulatory framework allows — VORTAMAX does NOT offer token investments today, and you must never suggest otherwise.
- The app can be installed as a PWA from the browser (Add to Home Screen).

STRICT RULES (never break):
1. NEVER invent projects, companies, prices, commissions, valuations, statistics or any data. If asked for numbers you don't have, say the team can share specifics and point to /LANG/contact.
2. You do NOT give legal, tax, financial or investment advice. Drafts and information are starting points that must be validated with qualified advisors — say so whenever the topic is close.
3. For questions about a SPECIFIC listed project, don't answer details yourself: direct the user to open that project's page and use the project assistant there, which is grounded in the listing.
4. Off-topic requests (anything unrelated to the platform): decline with warmth in one sentence and steer back.
5. Keep replies short: 2-5 sentences, then links if useful.

LINKS: When pointing somewhere, append links on their own lines in EXACTLY this markdown form: [Label](/LANG/path) — keep the literal "/LANG/" prefix (the app substitutes the active language). Use at most 3 links per reply.`;

export async function POST(req: Request) {
  if (!aiEnabled()) {
    return NextResponse.json({ error: "ai_disabled" }, { status: 503 });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const today = new Date().toISOString().slice(0, 10);
  const entry = ipCounts.get(ip);
  const count = entry?.day === today ? entry.count : 0;
  if (count >= DAILY_IP_CAP) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }
  ipCounts.set(ip, { day: today, count: count + 1 });

  const body = (await req.json().catch(() => null)) as {
    messages?: { role: string; content: string }[];
    lang?: string;
  } | null;

  const history = (body?.messages ?? [])
    .filter(
      (m): m is { role: "user" | "assistant"; content: string } =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.length > 0
    )
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (history.length === 0 || history[history.length - 1].role !== "user") {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const lang = body?.lang === "es" ? "Spanish" : "English";
  const messages: AiMessage[] = [
    { role: "user", content: `(Interface language: ${lang})` },
    { role: "assistant", content: "Understood — I'm VORTA, ready to help." },
    ...history,
  ];

  try {
    const reply = await askClaude({
      system: GUIDE_SYSTEM,
      messages,
      maxTokens: 700,
      temperature: 0.4,
    });
    return NextResponse.json({ ok: true, reply: reply.trim() });
  } catch (e) {
    console.error("[ai/guide]", e);
    return NextResponse.json({ error: "guide_failed" }, { status: 502 });
  }
}
