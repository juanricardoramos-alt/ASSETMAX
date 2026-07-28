import { z } from "zod";
import { COUNTRIES, SUPPLIER_CATEGORIES } from "@/lib/constants";

const countryCodes = COUNTRIES.map((c) => c.code) as [string, ...string[]];

export const supplierInputSchema = z.object({
  name: z.string().min(2).max(160),
  description: z.string().min(20).max(6000),
  category: z.enum(SUPPLIER_CATEGORIES),
  countryCode: z.enum(countryCodes),
  city: z.string().max(120).optional().or(z.literal("")),
  website: z.string().url().max(300).optional().or(z.literal("")),
  employees: z.number().int().positive().max(5_000_000).nullable().optional(),
  yearsActive: z.number().int().min(0).max(300).nullable().optional(),
  certifications: z.array(z.string().min(1).max(200)).max(20).default([]),
  portfolio: z.array(z.string().min(1).max(300)).max(20).default([]),
  capacity: z.string().max(2000).optional().or(z.literal("")),
});

export type SupplierInput = z.infer<typeof supplierInputSchema>;

export const applicationInputSchema = z.object({
  message: z.string().min(20).max(4000),
  proposedBudget: z.number().positive().max(1e13).nullable().optional(),
  leadTime: z.string().max(200).optional().or(z.literal("")),
});

export type ApplicationInput = z.infer<typeof applicationInputSchema>;
