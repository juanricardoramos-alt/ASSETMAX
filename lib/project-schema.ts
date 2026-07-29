import { z } from "zod";
import { CATEGORIES, STAGES, DEAL_TYPES } from "@/lib/constants";

export const projectInputSchema = z.object({
  action: z.enum(["draft", "submit"]),
  title: z.string().min(5).max(160),
  summary: z.string().min(20).max(400),
  description: z.string().min(50).max(20000),
  // Optional Spanish version of the description (stored under translations.es)
  descriptionEs: z.string().max(20000).optional().or(z.literal("")),
  category: z.enum(CATEGORIES),
  countryCode: z.string().length(2),
  region: z.string().max(120).optional().or(z.literal("")),
  city: z.string().max(120).optional().or(z.literal("")),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
  stage: z.enum(STAGES),
  dealType: z.enum(DEAL_TYPES),
  investmentMin: z.number().positive().max(1e13).nullable().optional(),
  investmentMax: z.number().positive().max(1e13).nullable().optional(),
  revenue: z.number().positive().max(1e13).nullable().optional(),
  ebitda: z.number().max(1e13).nullable().optional(),
  capacity: z.string().max(240).optional().or(z.literal("")),
  production: z.string().max(240).optional().or(z.literal("")),
  permits: z.string().max(400).optional().or(z.literal("")),
  workforce: z.number().int().positive().max(1e7).nullable().optional(),
  areaHectares: z.number().positive().max(1e8).nullable().optional(),
  highlights: z.array(z.string().min(3).max(300)).max(12).default([]),
  specs: z
    .array(z.object({ label: z.string().min(1).max(120), value: z.string().min(1).max(240) }))
    .max(20)
    .default([]),
  images: z.array(z.string().url().max(1000)).max(8).default([]),
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

export type ProjectInput = z.infer<typeof projectInputSchema>;
