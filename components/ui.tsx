import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconShield, IconStar } from "@/components/icons";

/* ---------------------------------------------------------------- Buttons */

const buttonVariants = {
  primary:
    "bg-navy-900 text-white hover:bg-navy-800 focus-visible:ring-navy-500",
  gold: "bg-gold-500 text-navy-950 hover:bg-gold-400 focus-visible:ring-gold-400",
  outline:
    "border border-navy-300 bg-white text-navy-800 hover:bg-navy-50 focus-visible:ring-navy-400",
  "outline-light":
    "border border-white/40 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white",
  ghost: "text-navy-700 hover:bg-navy-100 focus-visible:ring-navy-400",
  danger: "bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-400",
} as const;

const buttonSizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
} as const;

type ButtonVariant = keyof typeof buttonVariants;
type ButtonSize = keyof typeof buttonSizes;

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  href,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn(buttonBase, buttonVariants[variant], buttonSizes[size], className)}
      {...props}
    />
  );
}

/* ----------------------------------------------------------------- Badges */

export function Badge({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        className
      )}
      {...props}
    />
  );
}

export function VerifiedBadge({ label }: { label: string }) {
  return (
    <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
      <IconShield className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}

export function PartnerBadge({ label }: { label: string }) {
  return (
    <Badge className="bg-gold-100 text-gold-800 ring-1 ring-gold-300">
      <IconStar className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}

export function AnchorBadge({ label }: { label: string }) {
  return (
    <Badge className="bg-navy-950 text-gold-400 ring-1 ring-gold-500/40">
      <IconStar className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}

export function StatusBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  const styles: Record<string, string> = {
    DRAFT: "bg-navy-100 text-navy-600",
    IN_REVIEW: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    PUBLISHED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    REJECTED: "bg-red-50 text-red-700 ring-1 ring-red-200",
    PENDING: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    IN_DISCUSSION: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    ACCEPTED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    DECLINED: "bg-red-50 text-red-700 ring-1 ring-red-200",
    WITHDRAWN: "bg-navy-100 text-navy-600",
    OPEN: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    CLOSED: "bg-navy-100 text-navy-600",
    REQUESTED: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    GRANTED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    DENIED: "bg-red-50 text-red-700 ring-1 ring-red-200",
  };
  return <Badge className={styles[status] ?? styles.DRAFT}>{label}</Badge>;
}

/* ------------------------------------------------------------------ Cards */

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-navy-100 bg-white shadow-card",
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------- Form bits */

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("label-base", className)} {...props} />;
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn("input-base", className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("input-base", className)} {...props} />;
}

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn("input-base", className)} {...props} />;
}

/* --------------------------------------------------------------- Headings */

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "center",
  dark = false,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "mb-10 max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      {kicker && (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-500">
          {kicker}
        </p>
      )}
      <h2
        className={cn(
          "font-display text-3xl font-bold tracking-tight sm:text-4xl",
          dark ? "text-white" : "text-navy-950"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-3 text-base sm:text-lg", dark ? "text-navy-200" : "text-navy-500")}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
