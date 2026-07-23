import { MARKET_REFERENCES } from "@/lib/constants";

export function MarketRefsBar({
  title,
  note,
}: {
  title: string;
  note: string;
}) {
  return (
    <div className="border-b border-white/10 bg-navy-900">
      <div className="container-site flex items-center gap-6 overflow-x-auto py-2.5">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.18em] text-navy-400">
          {title}
        </span>
        {MARKET_REFERENCES.map((ref) => (
          <div key={ref.key} className="flex shrink-0 items-baseline gap-2">
            <span className="text-xs font-semibold text-navy-300">{ref.label}</span>
            <span className="text-xs font-bold text-white">{ref.value}</span>
            <span
              className={`text-[10px] font-bold ${ref.trend >= 0 ? "text-emerald-400" : "text-red-400"}`}
            >
              {ref.trend >= 0 ? "▲" : "▼"} {Math.abs(ref.trend).toFixed(1)}%
            </span>
          </div>
        ))}
        <span className="shrink-0 text-[10px] italic text-navy-500">{note}</span>
      </div>
    </div>
  );
}
