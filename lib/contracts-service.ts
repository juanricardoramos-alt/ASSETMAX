import { prisma } from "@/lib/prisma";
import { notify } from "@/lib/notify";
import { generateContract } from "@/lib/contracts";
import { COUNTRIES, type ContractKind } from "@/lib/constants";

function jurisdictionFor(countryCode: string | null | undefined): string {
  const c = COUNTRIES.find((x) => x.code === countryCode);
  return c ? c.en : "[Jurisdiction to be agreed]";
}

async function notifyBoth(
  sellerId: string,
  buyerId: string,
  title: string,
  contractId: string
) {
  await Promise.all(
    [sellerId, buyerId].map((userId) =>
      notify({
        userId,
        type: "CONTRACT",
        title: "New deal document draft",
        body: title,
        href: `/en/dashboard/contracts/${contractId}`,
      })
    )
  );
}

export async function createContractFromOffer(offerId: string, kind: ContractKind) {
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: {
      project: { include: { owner: true } },
      investor: true,
    },
  });
  if (!offer) return null;

  const existing = await prisma.contract.findFirst({
    where: { offerId, kind },
  });
  if (existing) return existing;

  const p = offer.project;
  const content = await generateContract({
    kind,
    sellerName: p.owner.name,
    sellerCompany: p.owner.company ?? p.owner.name,
    buyerName: offer.investor.name,
    buyerCompany: offer.investor.company ?? offer.investor.name,
    assetTitle: p.title,
    assetLocation: [p.city, p.country].filter(Boolean).join(", "),
    jurisdiction: jurisdictionFor(p.countryCode),
    dealType: offer.type.replace(/_/g, " "),
    amount: offer.amount,
    equityPct: offer.equityPct,
    offerMessage: offer.message.slice(0, 600),
  });

  const contract = await prisma.contract.create({
    data: {
      kind,
      title: `${kind} — ${p.title}`,
      content,
      projectId: p.id,
      offerId: offer.id,
      sellerId: p.ownerId,
      buyerId: offer.investorId,
    },
  });
  await notifyBoth(p.ownerId, offer.investorId, contract.title, contract.id);
  return contract;
}

export async function createNdaContract(
  projectId: string,
  investorId: string,
  fullName: string
) {
  const [project, investor] = await Promise.all([
    prisma.project.findUnique({ where: { id: projectId }, include: { owner: true } }),
    prisma.user.findUnique({ where: { id: investorId } }),
  ]);
  if (!project || !investor) return null;

  const existing = await prisma.contract.findFirst({
    where: { projectId, buyerId: investorId, kind: "NDA" },
  });
  if (existing) return existing;

  const content = await generateContract({
    kind: "NDA",
    sellerName: project.owner.name,
    sellerCompany: project.owner.company ?? project.owner.name,
    buyerName: investor.name,
    buyerCompany: investor.company ?? investor.name,
    assetTitle: project.title,
    assetLocation: [project.city, project.country].filter(Boolean).join(", "),
    jurisdiction: jurisdictionFor(project.countryCode),
    ndaFullName: fullName,
  });

  const contract = await prisma.contract.create({
    data: {
      kind: "NDA",
      title: `NDA — ${project.title}`,
      content,
      projectId: project.id,
      sellerId: project.ownerId,
      buyerId: investorId,
      // The digital acceptance already happened on-platform.
      buyerReviewedAt: new Date(),
    },
  });
  await notifyBoth(project.ownerId, investorId, contract.title, contract.id);
  return contract;
}

export async function createCommoditySpaFromMatch(matchId: string) {
  const match = await prisma.commodityMatch.findUnique({
    where: { id: matchId },
    include: {
      sell: { include: { owner: true } },
      buy: { include: { owner: true } },
    },
  });
  if (!match) return null;

  const existing = await prisma.contract.findFirst({
    where: { commodityListingId: match.sell.id, buyerId: match.buy.ownerId, kind: "COMMODITY_SPA" },
  });
  if (existing) return existing;

  const s = match.sell;
  const content = await generateContract({
    kind: "COMMODITY_SPA",
    sellerName: s.owner.name,
    sellerCompany: s.owner.company ?? s.owner.name,
    buyerName: match.buy.owner.name,
    buyerCompany: match.buy.owner.company ?? match.buy.owner.name,
    assetTitle: s.title,
    assetLocation: s.deliveryLocation ?? "",
    jurisdiction: jurisdictionFor(s.originCode),
    commodity: s.commodity.replace(/_/g, " "),
    volume: s.volume,
    incoterm: s.incoterm,
    deliveryLocation: s.deliveryLocation,
    priceDetails: s.priceDetails,
  });

  const contract = await prisma.contract.create({
    data: {
      kind: "COMMODITY_SPA",
      title: `Commodity SPA — ${s.title}`,
      content,
      commodityListingId: s.id,
      sellerId: s.ownerId,
      buyerId: match.buy.ownerId,
    },
  });
  await notifyBoth(s.ownerId, match.buy.ownerId, contract.title, contract.id);
  return contract;
}
