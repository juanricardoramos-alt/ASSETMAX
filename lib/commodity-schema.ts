import { z } from "zod";
import { COMMODITIES, INCOTERMS, PERIODICITIES, PRICE_TYPES, LISTING_SIDES, COUNTRIES } from "@/lib/constants";

const countryCodes = COUNTRIES.map((c) => c.code) as [string, ...string[]];

export const commodityInputSchema = z.object({
  action: z.enum(["draft", "submit"]),
  side: z.enum(LISTING_SIDES),
  commodity: z.enum(COMMODITIES),
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(10000),
  specs: z
    .array(z.object({ label: z.string().min(1).max(120), value: z.string().min(1).max(240) }))
    .max(24)
    .default([]),
  volume: z.string().min(2).max(160),
  periodicity: z.enum(PERIODICITIES),
  originCode: z.enum(countryCodes).optional().or(z.literal("")),
  destinationCode: z.enum(countryCodes).optional().or(z.literal("")),
  incoterm: z.enum(INCOTERMS),
  deliveryLocation: z.string().max(200).optional().or(z.literal("")),
  priceType: z.enum(PRICE_TYPES),
  priceDetails: z.string().max(300).optional().or(z.literal("")),
  validUntil: z.string().datetime().nullable().optional(),
  documents: z
    .array(
      z.object({
        name: z.string().min(1).max(160),
        url: z.string().url().max(1000),
        isConfidential: z.boolean(),
      })
    )
    .max(20)
    .default([]),
});

export type CommodityInput = z.infer<typeof commodityInputSchema>;
