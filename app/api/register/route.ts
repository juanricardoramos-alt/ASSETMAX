import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(200),
  role: z.enum(["SELLER", "INVESTOR"]),
  company: z.string().max(160).optional().or(z.literal("")),
  country: z.string().max(2).optional().or(z.literal("")),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const { name, email, password, role, company, country } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      passwordHash,
      role,
      company: company || null,
      country: country || null,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
