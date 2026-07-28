import { z } from "zod";
import { CATEGORIES, COUNTRIES } from "@/lib/constants";

const countryCodes = COUNTRIES.map((c) => c.code) as [string, ...string[]];

export const companyInputSchema = z.object({
  name: z.string().min(2).max(160),
  legalName: z.string().max(200).optional().or(z.literal("")),
  description: z.string().min(20).max(6000),
  sector: z.enum(CATEGORIES),
  countryCode: z.enum(countryCodes),
  city: z.string().max(120).optional().or(z.literal("")),
  website: z.string().url().max(300).optional().or(z.literal("")),
  founded: z.number().int().min(1800).max(2100).nullable().optional(),
  employees: z.number().int().positive().max(5_000_000).nullable().optional(),
});

export type CompanyInput = z.infer<typeof companyInputSchema>;
