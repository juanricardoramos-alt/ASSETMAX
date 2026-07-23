import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { Role } from "@/lib/constants";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      session: null,
      error: NextResponse.json({ error: "unauthorized" }, { status: 401 }),
    };
  }
  return { session, error: null };
}

export async function requireRole(...roles: Role[]) {
  const { session, error } = await requireUser();
  if (error) return { session: null, error };
  if (!roles.includes(session!.user.role)) {
    return {
      session: null,
      error: NextResponse.json({ error: "forbidden" }, { status: 403 }),
    };
  }
  return { session, error: null };
}
