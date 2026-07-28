import { cn } from "@/lib/utils";

/** Placeholder company "logo": a monogram tile used until real brand assets
 *  are uploaded. Falls back to the first letters of the company name. */
export function CompanyMonogram({
  name,
  monogram,
  size = "md",
  className,
}: {
  name: string;
  monogram?: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const initials =
    monogram ??
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]!.toUpperCase())
      .join("");

  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl bg-navy-950 font-display font-bold text-gold-400 ring-1 ring-gold-500/30",
        size === "lg" ? "h-20 w-20 text-2xl" : "h-12 w-12 text-base",
        className
      )}
    >
      {initials}
    </div>
  );
}
