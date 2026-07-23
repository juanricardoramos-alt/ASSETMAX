import { Card } from "@/components/ui";

export function StatCard({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <Card className="p-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
        {label}
      </p>
      <p
        className={`mt-1.5 text-2xl font-extrabold ${accent ? "text-gold-600" : "text-navy-950"}`}
      >
        {value}
      </p>
    </Card>
  );
}
