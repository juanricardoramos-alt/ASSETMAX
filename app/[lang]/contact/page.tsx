import type { Metadata } from "next";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { Card } from "@/components/ui";
import { ContactForm } from "@/components/ContactForm";
import { IconGlobe, IconMapPin } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.pages.contact.title };
}

export default async function ContactPage({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const t = dict.pages.contact;

  return (
    <div>
      <div className="bg-navy-950 py-16">
        <div className="container-site max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">{t.title}</h1>
          <p className="mt-4 text-lg text-navy-200">{t.intro}</p>
        </div>
      </div>

      <div className="container-site grid gap-10 py-16 lg:grid-cols-[1fr_320px]">
        <Card className="p-8">
          <ContactForm dict={dict} />
        </Card>

        <div className="space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-navy-500">
            <IconGlobe className="h-4 w-4" />
            {t.offices}
          </h2>
          {t.officesList.map((office) => (
            <Card key={office.city} className="flex items-center gap-3 p-5">
              <IconMapPin className="h-5 w-5 text-gold-500" />
              <div>
                <p className="font-bold text-navy-950">{office.city}</p>
                <p className="text-xs text-navy-400">{office.region}</p>
              </div>
            </Card>
          ))}
          <Card className="p-5 text-sm text-navy-600">
            <p className="font-bold text-navy-900">Email</p>
            <p className="mt-1">contact@vortamax.global</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
