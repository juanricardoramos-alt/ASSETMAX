import { z } from "zod";
import { CATEGORIES, STAGES, DEAL_TYPES, COUNTRIES } from "@/lib/constants";

const countryCodes = COUNTRIES.map((c) => c.code) as [string, ...string[]];

export const mandateInputSchema = z.object({
  action: z.enum(["draft", "submit"]),
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(8000),
  categories: z.array(z.enum(CATEGORIES)).max(CATEGORIES.length).default([]),
  countries: z.array(z.enum(countryCodes)).max(COUNTRIES.length).default([]),
  stages: z.array(z.enum(STAGES)).max(STAGES.length).default([]),
  dealTypes: z.array(z.enum(DEAL_TYPES)).max(DEAL_TYPES.length).default([]),
  ticketMin: z.number().positive().max(1e13).nullable().optional(),
  ticketMax: z.number().positive().max(1e13).nullable().optional(),
  equityMin: z.number().min(0).max(100).nullable().optional(),
  equityMax: z.number().min(0).max(100).nullable().optional(),
  conditions: z.string().max(2000).optional().or(z.literal("")),
  isPublic: z.boolean().default(true),
});

export type MandateInput = z.infer<typeof mandateInputSchema>;
