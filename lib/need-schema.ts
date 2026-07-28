import { z } from "zod";
import { COUNTRIES, NEED_KINDS, SUPPLIER_CATEGORIES } from "@/lib/constants";

const countryCodes = COUNTRIES.map((c) => c.code) as [string, ...string[]];

export const needInputSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(8000),
  category: z.enum(SUPPLIER_CATEGORIES),
  kind: z.enum(NEED_KINDS).default("STANDARD"),
  countryCode: z.enum(countryCodes),
  city: z.string().max(120).optional().or(z.literal("")),
  budgetMin: z.number().positive().max(1e13).nullable().optional(),
  budgetMax: z.number().positive().max(1e13).nullable().optional(),
  // ISO date (yyyy-mm-dd) from a date input; empty string clears the deadline.
  deadline: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  requirements: z.array(z.string().min(1).max(300)).max(20).default([]),
});

export type NeedInput = z.infer<typeof needInputSchema>;
