import type { Metadata } from "next";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Providers } from "@/components/Providers";
import "../globals.css";

// Marketplace content is database-driven and session-aware — render at request time.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return {
    title: {
      default: `${dict.brand.name} — ${dict.brand.tagline}`,
      template: `%s | ${dict.brand.name}`,
    },
    description: dict.home.heroSubtitle,
    openGraph: {
      title: `${dict.brand.name} — ${dict.brand.tagline}`,
      description: dict.home.heroSubtitle,
      type: "website",
      siteName: dict.brand.name,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Runtime-loaded font: no build-time network dependency, graceful fallback */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <Providers>
          <SiteHeader lang={lang} dict={dict} />
          <main className="flex-1">{children}</main>
          <SiteFooter lang={lang} dict={dict} />
        </Providers>
      </body>
    </html>
  );
}
