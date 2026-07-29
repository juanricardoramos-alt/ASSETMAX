export function LegalPage({
  title,
  updatedLabel,
  sections,
}: {
  title: string;
  updatedLabel: string;
  sections: { title: string; text: string }[];
}) {
  return (
    <div className="container-site max-w-3xl py-16">
      <h1 className="text-3xl font-extrabold tracking-tight text-navy-950 sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-navy-400">{updatedLabel}: 2026-07-01</p>
      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="text-lg font-bold text-navy-900">{s.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-600">{s.text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
