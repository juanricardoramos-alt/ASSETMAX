import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-navy-950 bg-grid-dots px-4 text-center">
      <p className="font-display text-8xl font-bold text-gold-500">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-white">
        Page not found · Página no encontrada
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-navy-300">
        The page you are looking for does not exist or may have been moved. / La
        página que buscas no existe o fue movida.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/en/projects"
          className="rounded-md bg-gold-500 px-6 py-3 text-sm font-bold text-navy-950 transition hover:bg-gold-400"
        >
          Explore Opportunities
        </Link>
        <Link
          href="/en"
          className="rounded-md border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
