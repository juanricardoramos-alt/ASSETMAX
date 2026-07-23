import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { aiEnabled } from "@/lib/ai";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { parseSpecs } from "@/lib/utils";
import {
  CommodityForm,
  type CommodityFormData,
} from "@/components/commodities/CommodityForm";

export default async function EditCommodityPage({
  params,
}: {
  params: { lang: string; id: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const listing = await prisma.commodityListing.findUnique({
    where: { id: params.id },
  });
  if (!listing) notFound();
  if (listing.ownerId !== session.user.id && session.user.role !== "ADMIN") {
    redirect(`/${lang}/dashboard`);
  }

  let documents: CommodityFormData["documents"] = [];
  try {
    documents = JSON.parse(listing.documents);
  } catch {
    documents = [];
  }

  const initialData: CommodityFormData = {
    side: listing.side,
    commodity: listing.commodity,
    title: listing.title,
    description: listing.description,
    specs: parseSpecs(listing.specs),
    volume: listing.volume,
    periodicity: listing.periodicity,
    originCode: listing.originCode ?? "CL",
    destinationCode: listing.destinationCode ?? "",
    incoterm: listing.incoterm,
    deliveryLocation: listing.deliveryLocation ?? "",
    priceType: listing.priceType,
    priceDetails: listing.priceDetails ?? "",
    validUntil: listing.validUntil
      ? listing.validUntil.toISOString().slice(0, 10)
      : "",
    documents,
  };

  return (
    <CommodityForm
      lang={lang}
      dict={dict}
      listingId={listing.id}
      initialData={initialData}
      aiIngestEnabled={aiEnabled()}
    />
  );
}
