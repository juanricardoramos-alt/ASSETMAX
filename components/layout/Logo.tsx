import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  lang,
  dark = false,
  className,
}: {
  lang: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/${lang}`}
      className={cn("flex items-baseline gap-0.5 select-none", className)}
      aria-label="ASSETMAX Global — Home"
    >
      <span
        className={cn(
          "text-xl font-extrabold tracking-tight",
          dark ? "text-white" : "text-navy-950"
        )}
      >
        ASSET
        <span className="text-gold-500">MAX</span>
      </span>
      <span
        className={cn(
          "ml-1 hidden text-[10px] font-bold uppercase tracking-[0.25em] sm:inline",
          dark ? "text-navy-300" : "text-navy-400"
        )}
      >
        Global
      </span>
    </Link>
  );
}
