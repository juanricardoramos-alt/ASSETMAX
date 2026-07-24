// AI-drafted deal documents. Every draft is template-based (works without an
// API key) and optionally refined by Claude. All drafts carry the mandatory
// DRAFT banner and legal disclaimer, and require review by both parties
// before the signature version can be exported.

import { aiEnabled, askClaude } from "@/lib/ai";
import { formatUsdFull } from "@/lib/utils";
import type { ContractKind } from "@/lib/constants";

export type ContractContext = {
  kind: ContractKind;
  sellerName: string;
  sellerCompany: string;
  buyerName: string;
  buyerCompany: string;
  assetTitle: string;
  assetLocation: string;
  jurisdiction: string;
  dealType?: string;
  amount?: number | null;
  equityPct?: number | null;
  offerMessage?: string | null;
  ndaFullName?: string | null;
  commodity?: string | null;
  volume?: string | null;
  incoterm?: string | null;
  deliveryLocation?: string | null;
  priceDetails?: string | null;
};

const DRAFT_HEADER = `> **DRAFT — Subject to legal review / BORRADOR — Sujeto a revisión legal**
>
> This document was generated automatically by VORTAMAX Global as a negotiation convenience. VORTAMAX Global does not provide legal advice. Both parties must have this draft reviewed by qualified counsel in the applicable jurisdiction before signature. / Este documento fue generado automáticamente por VORTAMAX Global para facilitar la negociación. VORTAMAX Global no presta asesoría legal. Ambas partes deben validar este borrador con abogados de la jurisdicción aplicable antes de firmar.

---
`;

function partiesBlock(c: ContractContext): string {
  return `**BETWEEN:**

**${c.sellerCompany}** (represented by ${c.sellerName}), hereinafter the "Seller" / "Disclosing Party";

**AND**

**${c.buyerCompany}** (represented by ${c.buyerName}), hereinafter the "Buyer" / "Receiving Party";

(each a "Party" and together the "Parties").
`;
}

function signatureBlock(c: ContractContext): string {
  return `
---

**SIGNATURES**

| For the Seller | For the Buyer |
| --- | --- |
| ${c.sellerCompany} | ${c.buyerCompany} |
| Name: ${c.sellerName} | Name: ${c.buyerName} |
| Title: ______________________ | Title: ______________________ |
| Date: ______________________ | Date: ______________________ |
| Signature: __________________ | Signature: __________________ |
`;
}

const amountLine = (c: ContractContext) =>
  c.amount != null ? formatUsdFull(c.amount) : "[AMOUNT TO BE CONFIRMED]";

function ndaTemplate(c: ContractContext): string {
  return `${DRAFT_HEADER}
# NON-DISCLOSURE AGREEMENT

**Re: Evaluation of "${c.assetTitle}" (${c.assetLocation})**

${partiesBlock(c)}

**1. Purpose.** The Disclosing Party will make available certain confidential technical, financial, legal and commercial information concerning ${c.assetTitle} (the "Confidential Information") exclusively to allow the Receiving Party to evaluate a potential transaction involving the asset (the "Purpose").

**2. Confidential Information.** Includes all information disclosed through the VORTAMAX Global data room or by any other means, in any format, including the existence and status of negotiations. Excludes information that is or becomes public without breach, was lawfully known prior to disclosure, or is independently developed.

**3. Obligations.** The Receiving Party shall: (a) use the Confidential Information solely for the Purpose; (b) not disclose it to third parties without prior written consent, except to advisors bound by equivalent duties; (c) protect it with no less than reasonable care; (d) not contact employees, customers, suppliers or authorities related to the asset without authorization.

**4. Return or Destruction.** Upon written request or termination of discussions, the Receiving Party shall return or destroy all Confidential Information and certify destruction, subject to legal retention requirements.

**5. No License / No Obligation.** No license or ownership right is granted. Neither Party is obliged to enter into any transaction.

**6. Term.** This Agreement remains in force for three (3) years from the date of signature.

**7. Remedies.** The Parties acknowledge that unauthorized disclosure may cause irreparable harm; the Disclosing Party may seek injunctive relief in addition to any other remedy.

**8. Governing Law & Jurisdiction.** This Agreement is governed by the laws of ${c.jurisdiction}. Disputes shall be submitted to the competent courts of ${c.jurisdiction}, unless the Parties agree to arbitration.
${c.ndaFullName ? `\n**Digital acceptance on platform:** ${c.ndaFullName} accepted the VORTAMAX Global digital NDA for this asset.\n` : ""}
${signatureBlock(c)}`;
}

function loiTemplate(c: ContractContext): string {
  return `${DRAFT_HEADER}
# LETTER OF INTENT (NON-BINDING)

**Re: Proposed transaction concerning "${c.assetTitle}" (${c.assetLocation})**

${partiesBlock(c)}

**1. Transaction.** The Buyer expresses its non-binding intention to pursue a transaction concerning ${c.assetTitle}, structured as ${c.dealType ?? "[STRUCTURE TO BE CONFIRMED]"}${c.equityPct ? ` for a ${c.equityPct}% interest` : ""}.

**2. Indicative Consideration.** ${amountLine(c)}, subject to confirmatory due diligence, on a cash-free/debt-free basis and subject to customary adjustments.
${c.offerMessage ? `\n**3. Context of the Offer.** ${c.offerMessage}\n` : ""}
**4. Due Diligence.** The Seller shall grant the Buyer and its advisors access to a data room with technical, financial, legal, tax and environmental information. The due diligence period is expected to be [60] days from acceptance of this Letter.

**5. Exclusivity.** [The Seller grants the Buyer exclusivity for a period of [45] days from the date of this Letter. / No exclusivity is granted.]

**6. Confidentiality.** The Non-Disclosure Agreement executed between the Parties remains in full force.

**7. Non-Binding Nature.** Except for Sections 5–7, this Letter is a statement of intent and creates no binding obligation to consummate any transaction.

**8. Governing Law.** ${c.jurisdiction}.

${signatureBlock(c)}`;
}

function mouTemplate(c: ContractContext): string {
  return `${DRAFT_HEADER}
# MEMORANDUM OF UNDERSTANDING

**Re: "${c.assetTitle}" (${c.assetLocation})**

${partiesBlock(c)}

**1. Purpose.** This MOU records the Parties' common understanding of the principal terms under negotiation for a transaction concerning ${c.assetTitle} and organizes the workplan toward definitive agreements.

**2. Contemplated Structure.** ${c.dealType ?? "[TO BE CONFIRMED]"}${c.equityPct ? `, involving a ${c.equityPct}% interest` : ""}, for an indicative consideration of ${amountLine(c)}.

**3. Workplan.**
| Phase | Deliverable | Target |
| --- | --- | --- |
| 1 | Confirmatory due diligence | [T + 60 days] |
| 2 | Definitive agreements drafting | [T + 90 days] |
| 3 | Regulatory approvals & conditions precedent | [T + 150 days] |
| 4 | Closing | [T + 180 days] |

**4. Conduct of Business.** Until closing or termination, the Seller shall operate the asset in the ordinary course and shall not create new encumbrances outside the ordinary course.

**5. Costs.** Each Party bears its own costs. [Break-fee arrangements, if any, to be defined in the definitive agreements.]

**6. Confidentiality & Announcements.** The executed NDA remains in force. No public announcement without prior written consent of both Parties.

**7. Nature.** This MOU is non-binding except for Sections 5–7, and does not constitute an offer, acceptance or definitive agreement.

**8. Governing Law.** ${c.jurisdiction}.

${signatureBlock(c)}`;
}

function spaTemplate(c: ContractContext): string {
  return `${DRAFT_HEADER}
# ${c.equityPct && c.equityPct < 100 ? "SHARE PURCHASE / PARTICIPATION AGREEMENT" : "ASSET / SHARE PURCHASE AGREEMENT"} — DRAFT FRAMEWORK

**Re: "${c.assetTitle}" (${c.assetLocation})**

${partiesBlock(c)}

**1. Object.** The Seller agrees to sell and the Buyer agrees to acquire ${c.equityPct ? `a ${c.equityPct}% interest in` : "the entirety of"} ${c.assetTitle}, free of liens and encumbrances except as disclosed.

**2. Purchase Price.** ${amountLine(c)}, payable as follows: [payment structure — e.g. % at signing, % at closing, deferred/earn-out components — TO BE NEGOTIATED].

**3. Conditions Precedent.** Closing is subject to: (a) satisfactory completion of confirmatory due diligence; (b) regulatory and antitrust approvals where applicable; (c) third-party consents and waivers of preferential rights; (d) no material adverse change; (e) [others].

**4. Representations & Warranties.** The Seller represents, among others: valid title and capacity; corporate standing; accuracy of disclosed information; compliance with permits, environmental, labor and tax obligations; no undisclosed litigation. The Buyer represents capacity, authority and availability of funds.

**5. Indemnities.** The Seller shall indemnify the Buyer for breaches of representations, subject to negotiated caps, baskets, de-minimis thresholds and survival periods. [Specific indemnities: environmental, tax, litigation — TO BE NEGOTIATED.]

**6. Covenants.** Ordinary-course operation between signing and closing; non-compete and non-solicitation undertakings of [3] years; transition services as required.

**7. Governing Law & Dispute Resolution.** This Agreement is governed by the laws of ${c.jurisdiction}. Disputes shall be finally settled under the rules of [ICC/local arbitration center], seat in [city], language English/Spanish.

**8. Miscellaneous.** Notices, assignment restrictions, entire agreement, severability and counterparts clauses to be completed by counsel.

${signatureBlock(c)}`;
}

function commoditySpaTemplate(c: ContractContext): string {
  return `${DRAFT_HEADER}
# COMMODITY SALE & PURCHASE AGREEMENT — DRAFT FRAMEWORK

**Re: ${c.commodity ?? "[COMMODITY]"} — "${c.assetTitle}"**

${partiesBlock(c)}

**1. Product & Specifications.** The Seller shall sell and the Buyer shall purchase ${c.commodity ?? "[COMMODITY]"} conforming to the technical specifications annexed to this Agreement (Annex A — Certificate of Analysis). Non-conforming deliveries are subject to rejection or price adjustment as per Clause 6.

**2. Quantity & Delivery Program.** ${c.volume ?? "[QUANTITY / PERIODICITY]"}, with tolerances of ±5% at Seller's option unless otherwise agreed.

**3. Delivery Terms.** ${c.incoterm ?? "[INCOTERM]"} ${c.deliveryLocation ?? "[NAMED PLACE/PORT]"} (Incoterms® 2020). Title and risk pass in accordance with the agreed Incoterm.

**4. Price.** ${c.priceDetails ?? "[PRICE BASIS — fixed or index-linked (e.g. LME) with premium/discount]"}. Price review and quotational period mechanics to be detailed by the Parties.

**5. Payment.** [Irrevocable letter of credit at sight / documentary collection / open account — TO BE NEGOTIATED], against presentation of customary shipping documents.

**6. Quality Determination.** Independent surveyor at load/discharge port; weighing, sampling and assay per industry standards; umpire analysis in case of dispute.

**7. Laycan, Demurrage & Logistics.** To be scheduled per the delivery program; demurrage/despatch per charter-party terms.

**8. Force Majeure.** Standard force majeure protections apply; the affected Party shall notify promptly and mitigate.

**9. Compliance.** Each Party warrants compliance with sanctions, anti-corruption, anti-money-laundering and responsible-sourcing regulations applicable to the transaction.

**10. Governing Law & Arbitration.** ${c.jurisdiction} law; disputes to [ICC/LME arbitration], seat [city], language English.

> **Platform note:** VORTAMAX Global connects the Parties and facilitates negotiation. Payment and logistics are executed by the Parties through traditional trade channels outside the platform.

${signatureBlock(c)}`;
}

const TEMPLATES: Record<ContractKind, (c: ContractContext) => string> = {
  NDA: ndaTemplate,
  LOI: loiTemplate,
  MOU: mouTemplate,
  SPA: spaTemplate,
  COMMODITY_SPA: commoditySpaTemplate,
};

export async function generateContract(c: ContractContext): Promise<string> {
  const base = TEMPLATES[c.kind](c);
  if (!aiEnabled()) return base;

  try {
    const refined = await askClaude({
      system:
        "You are the legal-drafting assistant of VORTAMAX Global. You receive a draft deal document in Markdown. Improve its drafting quality and fill obvious gaps USING ONLY the deal data already present — never invent amounts, percentages, dates or party details. Keep the exact same structure, the DRAFT banner, all bracketed [TO BE NEGOTIATED] placeholders that lack data, the platform disclaimers and the signature block. Return the full Markdown document only.",
      messages: [{ role: "user", content: base }],
      maxTokens: 4096,
      temperature: 0.2,
    });
    // Safety: never lose the draft banner.
    return refined.includes("DRAFT — Subject to legal review") ? refined : base;
  } catch {
    return base;
  }
}
