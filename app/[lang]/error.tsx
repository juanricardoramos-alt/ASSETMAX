"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-navy-950 bg-grid-dots px-4 text-center">
      <p className="font-display text-8xl font-bold text-gold-500">500</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-white">
        Something went wrong · Algo salió mal
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-navy-300">
        An unexpected error occurred. Please try again. / Ocurrió un error
        inesperado. Por favor intenta de nuevo.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-gold-500 px-6 py-3 text-sm font-bold text-navy-950 transition hover:bg-gold-400"
        >
          Try Again / Reintentar
        </button>
        <a
          href="/en"
          className="rounded-md border border-white/30 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
        >
          Home
        </a>
      </div>
    </div>
  );
}
