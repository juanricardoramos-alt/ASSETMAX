import { STAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { IconCheck } from "@/components/icons";

/** Stage progression indicator: greenfield → construction → operating → expansion. */
export function ProjectTimeline({
  currentStage,
  stageLabels,
}: {
  currentStage: string;
  stageLabels: Record<string, string>;
}) {
  const currentIndex = STAGES.indexOf(currentStage as (typeof STAGES)[number]);

  return (
    <ol className="flex items-start">
      {STAGES.map((stage, i) => {
        const done = i < currentIndex;
        const current = i === currentIndex;
        return (
          <li key={stage} className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center">
              <div
                className={cn(
                  "h-0.5 flex-1",
                  i === 0 ? "bg-transparent" : i <= currentIndex ? "bg-gold-500" : "bg-navy-100"
                )}
              />
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ring-2",
                  current
                    ? "bg-navy-900 text-gold-400 ring-gold-400"
                    : done
                      ? "bg-gold-500 text-navy-950 ring-gold-500"
                      : "bg-white text-navy-300 ring-navy-200"
                )}
              >
                {done ? <IconCheck className="h-4 w-4" /> : i + 1}
              </div>
              <div
                className={cn(
                  "h-0.5 flex-1",
                  i === STAGES.length - 1
                    ? "bg-transparent"
                    : i < currentIndex
                      ? "bg-gold-500"
                      : "bg-navy-100"
                )}
              />
            </div>
            <p
              className={cn(
                "mt-2 px-1 text-center text-[11px] font-semibold leading-tight",
                current ? "text-navy-950" : done ? "text-navy-600" : "text-navy-300"
              )}
            >
              {stageLabels[stage]}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
