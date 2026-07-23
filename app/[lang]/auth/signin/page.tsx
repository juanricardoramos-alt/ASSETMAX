import type { Metadata } from "next";
import { Suspense } from "react";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { SignInForm } from "@/components/auth/SignInForm";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.auth.signInTitle };
}

export default async function SignInPage({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-navy-50/60 px-4 py-16">
      <Suspense>
        <SignInForm lang={lang} dict={dict} googleEnabled={googleEnabled} />
      </Suspense>
    </div>
  );
}
