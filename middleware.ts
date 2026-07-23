import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { locales, defaultLocale } from "@/lib/i18n";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const pathLocale = locales.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );

  // Redirect locale-less URLs to the default locale (English).
  if (!pathLocale) {
    const url = req.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  // Auth-gate the dashboard.
  if (pathname.startsWith(`/${pathLocale}/dashboard`)) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = `/${pathLocale}/auth/signin`;
      url.search = `?callbackUrl=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Skip API routes, Next internals and static files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
