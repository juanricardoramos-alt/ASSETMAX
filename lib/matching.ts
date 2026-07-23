// AI matching engine — crosses published projects against active mandates
// (and, for commodities, sell offers against buy requirements).
//
// Scoring is deterministic over the standardized criteria so the engine works
// without an API key; when ANTHROPIC_API_KEY is configured, Claude writes a
// natural-language rationale for each match on top of the deterministic score.

import type { Mandate, Project, CommodityListing } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";
import { aiEnabled, askClaude } from "@/lib/ai";
import { parseJsonArray, formatInvestmentRange } from "@/lib/utils";

export const MATCH_THRESHOLD = 60;

type ScoreResult = { score: number; reasons: string[] } | null;

function rangesOverlap(
  aMin: number | null,
  aMax: number | null,
  bMin: number | null,
  bMax: number | null
): boolean | undefined {
  if (aMin == null && aMax == null) return undefined;
  if (bMin == null && bMax == null) return undefined;
  const lo1 = aMin ?? 0;
  const hi1 = aMax ?? Number.MAX_SAFE_INTEGER;
  const lo2 = bMin ?? 0;
  const hi2 = bMax ?? Number.MAX_SAFE_INTEGER;
  return lo1 <= hi2 && lo2 <= hi1;
}

export function scoreProjectMandate(project: Project, mandate: Mandate): ScoreResult {
  const categories = parseJsonArray(mandate.categories);
  const countries = parseJsonArray(mandate.countries);
  const stages = parseJsonArray(mandate.stages);
  const dealTypes = parseJsonArray(mandate.dealTypes);

  const reasons: string[] = [];
  let score = 0;

  // Category — hard criterion when the mandate specifies one.
  if (categories.length > 0) {
    if (!categories.includes(project.category)) return null;
    score += 35;
    reasons.push(`Sector fit: ${project.category}`);
  } else {
    score += 20;
    reasons.push("Mandate is sector-agnostic");
  }

  // Geography — hard criterion when specified.
  if (countries.length > 0) {
    if (!countries.includes(project.countryCode)) return null;
    score += 20;
    reasons.push(`Geography: ${project.country} is inside the mandate scope`);
  } else {
    score += 12;
    reasons.push("Mandate has global geographic scope");
  }

  // Ticket — hard criterion when both sides define a range.
  const overlap = rangesOverlap(
    project.investmentMin,
    project.investmentMax,
    mandate.ticketMin,
    mandate.ticketMax
  );
  if (overlap === false) return null;
  if (overlap === true) {
    score += 20;
    reasons.push(
      `Ticket: ${formatInvestmentRange(project.investmentMin, project.investmentMax)} overlaps the mandate range ${formatInvestmentRange(mandate.ticketMin, mandate.ticketMax)}`
    );
  } else {
    score += 8;
  }

  // Stage — soft criterion.
  if (stages.length === 0) {
    score += 8;
  } else if (stages.includes(project.stage)) {
    score += 13;
    reasons.push(`Stage accepted: ${project.stage}`);
  } else {
    score -= 15;
  }

  // Deal type — soft criterion.
  if (dealTypes.length === 0) {
    score += 6;
  } else if (dealTypes.includes(project.dealType)) {
    score += 12;
    reasons.push(`Deal structure accepted: ${project.dealType.replace("_", " ")}`);
  } else {
    score -= 12;
  }

  if (project.verified) score += 4;

  return { score: Math.max(0, Math.min(100, score)), reasons };
}

async function aiRationale(prompt: string, fallback: string): Promise<string> {
  if (!aiEnabled()) return fallback;
  try {
    const text = await askClaude({
      system:
        "You are the matching engine of ASSETMAX Global, an industrial-assets marketplace. In 2-3 sentences of polished institutional English, explain to both parties why this opportunity and this requirement are compatible. Base yourself STRICTLY on the data provided — never invent figures.",
      messages: [{ role: "user", content: prompt }],
      maxTokens: 300,
    });
    return text.trim() || fallback;
  } catch {
    return fallback;
  }
}

async function upsertProjectMatch(project: Project, mandate: Mandate) {
  const result = scoreProjectMandate(project, mandate);
  if (!result || result.score < MATCH_THRESHOLD) return null;

  const existing = await prisma.projectMatch.findUnique({
    where: { projectId_mandateId: { projectId: project.id, mandateId: mandate.id } },
  });
  if (existing) return null;

  const fallback = result.reasons.join(". ") + ".";
  const rationale = await aiRationale(
    `PROJECT: ${project.title} — ${project.summary} | Sector: ${project.category} | Country: ${project.country} | Stage: ${project.stage} | Deal: ${project.dealType} | Investment: ${formatInvestmentRange(project.investmentMin, project.investmentMax)}\n\nMANDATE: ${mandate.title} — ${mandate.description.slice(0, 500)} | Ticket: ${formatInvestmentRange(mandate.ticketMin, mandate.ticketMax)}\n\nMatched criteria: ${fallback}`,
    fallback
  );

  const match = await prisma.projectMatch.create({
    data: {
      projectId: project.id,
      mandateId: mandate.id,
      score: result.score,
      rationale,
    },
  });

  await Promise.all([
    notify({
      userId: project.ownerId,
      type: "MATCH",
      title: "New match found",
      body: `"${project.title}" matches the mandate "${mandate.title}" (${result.score}% compatibility).`,
      href: "/en/dashboard/matches",
    }),
    notify({
      userId: mandate.investorId,
      type: "MATCH",
      title: "New match found",
      body: `Your mandate "${mandate.title}" matches "${project.title}" (${result.score}% compatibility).`,
      href: "/en/dashboard/matches",
    }),
  ]);

  return match;
}

export async function runMatchingForProject(projectId: string) {
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project || project.status !== "PUBLISHED") return 0;
  const mandates = await prisma.mandate.findMany({ where: { status: "PUBLISHED" } });
  let created = 0;
  for (const mandate of mandates) {
    if ((await upsertProjectMatch(project, mandate)) != null) created++;
  }
  return created;
}

export async function runMatchingForMandate(mandateId: string) {
  const mandate = await prisma.mandate.findUnique({ where: { id: mandateId } });
  if (!mandate || mandate.status !== "PUBLISHED") return 0;
  const projects = await prisma.project.findMany({ where: { status: "PUBLISHED" } });
  let created = 0;
  for (const project of projects) {
    if ((await upsertProjectMatch(project, mandate)) != null) created++;
  }
  return created;
}

// ---------------------------------------------------------------------------
// Commodities: sell offers × buy requirements
// ---------------------------------------------------------------------------

export function scoreCommodityPair(
  sell: CommodityListing,
  buy: CommodityListing
): ScoreResult {
  if (sell.commodity !== buy.commodity) return null;

  const reasons: string[] = [`Same commodity: ${sell.commodity.replace(/_/g, " ")}`];
  let score = 55;

  if (sell.incoterm === buy.incoterm) {
    score += 15;
    reasons.push(`Incoterm aligned: ${sell.incoterm}`);
  } else {
    score += 5;
    reasons.push(`Incoterms negotiable (${sell.incoterm} vs ${buy.incoterm})`);
  }

  if (sell.periodicity === buy.periodicity) {
    score += 15;
    reasons.push(
      sell.periodicity === "contract"
        ? "Both parties seek a supply contract"
        : "Both parties operate spot"
    );
  }

  if (sell.verified) score += 5;
  if (buy.verified) score += 5;

  return { score: Math.max(0, Math.min(100, score)), reasons };
}

async function upsertCommodityMatch(sell: CommodityListing, buy: CommodityListing) {
  const result = scoreCommodityPair(sell, buy);
  if (!result || result.score < MATCH_THRESHOLD) return null;

  const existing = await prisma.commodityMatch.findUnique({
    where: { sellId_buyId: { sellId: sell.id, buyId: buy.id } },
  });
  if (existing) return null;

  const fallback = result.reasons.join(". ") + ".";
  const rationale = await aiRationale(
    `SELL OFFER: ${sell.title} | Volume: ${sell.volume} | Incoterm: ${sell.incoterm} | Origin: ${sell.originCode ?? "n/a"} | Price: ${sell.priceDetails ?? "n/a"}\n\nBUY REQUIREMENT: ${buy.title} | Volume: ${buy.volume} | Incoterm: ${buy.incoterm} | Destination: ${buy.destinationCode ?? "n/a"}\n\nMatched criteria: ${fallback}`,
    fallback
  );

  const match = await prisma.commodityMatch.create({
    data: { sellId: sell.id, buyId: buy.id, score: result.score, rationale },
  });

  await Promise.all([
    notify({
      userId: sell.ownerId,
      type: "MATCH",
      title: "New commodity match",
      body: `"${sell.title}" matches the buy requirement "${buy.title}" (${result.score}%).`,
      href: "/en/dashboard/matches",
    }),
    notify({
      userId: buy.ownerId,
      type: "MATCH",
      title: "New commodity match",
      body: `Your requirement "${buy.title}" matches the offer "${sell.title}" (${result.score}%).`,
      href: "/en/dashboard/matches",
    }),
  ]);

  return match;
}

export async function runMatchingForCommodity(listingId: string) {
  const listing = await prisma.commodityListing.findUnique({ where: { id: listingId } });
  if (!listing || listing.status !== "PUBLISHED") return 0;
  const counterparts = await prisma.commodityListing.findMany({
    where: {
      status: "PUBLISHED",
      side: listing.side === "SELL" ? "BUY" : "SELL",
    },
  });
  let created = 0;
  for (const other of counterparts) {
    const sell = listing.side === "SELL" ? listing : other;
    const buy = listing.side === "SELL" ? other : listing;
    if ((await upsertCommodityMatch(sell, buy)) != null) created++;
  }
  return created;
}
