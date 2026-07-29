import { cn } from "@/lib/utils";

export type VortaMood =
  | "idle"
  | "greet"
  | "think"
  | "celebrate"
  | "point"
  | "alert";

export type VortaPointDir = "left" | "right" | "up";

/**
 * VORTA — the platform's assistant mascot. A refined geometric character
 * built from the brand's gold "V" (no cartoon styling): the V is the body,
 * two simple eyes give it expression. Moods drive subtle CSS animations:
 * idle (float + blink), greet (gentle wave tilt), think (typing dots,
 * eyes up), celebrate (bounce + gold sparkles), point (restrained chevron
 * toward the element being explained), alert (soft pulsing gold dot).
 */
export function VortaMascot({
  mood = "idle",
  pointDir = "left",
  className,
}: {
  mood?: VortaMood;
  pointDir?: VortaPointDir;
  className?: string;
}) {
  const happy = mood === "greet" || mood === "celebrate";
  const bodyAnim =
    mood === "celebrate"
      ? "vorta-bounce"
      : mood === "greet"
        ? "vorta-wave"
        : "vorta-float";

  // Pupil offset follows the pointing direction (subtle: 1.4px).
  const px = mood === "point" ? (pointDir === "left" ? -1.4 : pointDir === "right" ? 1.4 : 0) : 0;
  const py = mood === "point" && pointDir === "up" ? -1.4 : mood === "alert" ? -0.8 : 0;

  return (
    <svg viewBox="0 0 64 64" className={cn("block", className)} aria-hidden="true">
      {/* pointing chevron — restrained, nudges 3px toward the target */}
      {mood === "point" && (
        <g
          stroke="#DFC26A"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className={
            pointDir === "left"
              ? "vorta-nudge-l"
              : pointDir === "right"
                ? "vorta-nudge-r"
                : "vorta-nudge-u"
          }
        >
          {pointDir === "left" && <path d="M11 25 L4 32 L11 39" />}
          {pointDir === "right" && <path d="M53 25 L60 32 L53 39" />}
          {pointDir === "up" && <path d="M25 11 L32 4 L39 11" />}
        </g>
      )}

      {/* alert accent — soft gold pulse, no shaking */}
      {mood === "alert" && (
        <g className="vorta-pulse">
          <circle cx="52" cy="11" r="6.5" fill="none" stroke="#DFC26A" strokeWidth="1.4" opacity="0.5" />
          <circle cx="52" cy="11" r="3.4" fill="#DFC26A" />
        </g>
      )}

      {/* thinking dots */}
      {mood === "think" && (
        <g fill="#DFC26A">
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={44 + i * 6}
              cy={10}
              r={2}
              className="vorta-dot"
              style={{ animationDelay: `${i * 0.18}s` }}
            />
          ))}
        </g>
      )}

      {/* celebration sparkles */}
      {mood === "celebrate" && (
        <g fill="#DFC26A">
          {[
            { x: 10, y: 14, d: "0s" },
            { x: 54, y: 18, d: "0.35s" },
            { x: 14, y: 40, d: "0.7s" },
          ].map((s, i) => (
            <path
              key={i}
              d={`M${s.x} ${s.y - 4} L${s.x + 1.6} ${s.y - 1.6} L${s.x + 4} ${s.y} L${s.x + 1.6} ${s.y + 1.6} L${s.x} ${s.y + 4} L${s.x - 1.6} ${s.y + 1.6} L${s.x - 4} ${s.y} L${s.x - 1.6} ${s.y - 1.6} Z`}
              className="vorta-sparkle"
              style={{ animationDelay: s.d }}
            />
          ))}
        </g>
      )}

      {/* body — the brand V */}
      <g className={bodyAnim}>
        <path
          d="M15 16 L25.5 16 L32 38 L38.5 16 L49 16 L37 48 L27 48 Z"
          fill="#DFC26A"
        />
        {/* eyes on the upper arms */}
        <g className={mood === "idle" ? "vorta-blink" : undefined}>
          {happy ? (
            <g
              stroke="#0A1426"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            >
              <path d="M18.4 23.5 Q21.2 20.5 24 23.5" />
              <path d="M40 23.5 Q42.8 20.5 45.6 23.5" />
            </g>
          ) : (
            <g>
              <circle cx="21.2" cy="22.5" r="3.4" fill="#0A1426" />
              <circle cx="42.8" cy="22.5" r="3.4" fill="#0A1426" />
              <circle
                cx={(mood === "think" ? 22.4 : 22.2) + px}
                cy={(mood === "think" ? 21.2 : 21.6) + py}
                r="1.1"
                fill="#F5ECCF"
              />
              <circle
                cx={(mood === "think" ? 44 : 43.8) + px}
                cy={(mood === "think" ? 21.2 : 21.6) + py}
                r="1.1"
                fill="#F5ECCF"
              />
            </g>
          )}
        </g>
      </g>
    </svg>
  );
}
