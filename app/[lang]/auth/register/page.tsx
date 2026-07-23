import type { Metadata } from "next";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { RegisterForm } from "@/components/auth/RegisterForm";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.auth.registerTitle };
}

export default async function RegisterPage({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-navy-50/60 px-4 py-16">
      <RegisterForm lang={lang} dict={dict} googleEnabled={googleEnabled} />
    </div>
  );
}
