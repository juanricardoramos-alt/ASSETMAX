"use client";

import Link from "next/link";
import { useState } from "react";

export type MapPin = {
  slug: string;
  title: string;
  country: string;
  category: string;
  lat: number;
  lng: number;
};

const W = 1000;
const H = 460;

// Equirectangular projection onto the SVG canvas (with light padding).
function project(lat: number, lng: number): [number, number] {
  const x = ((lng + 180) / 360) * (W - 80) + 40;
  const y = ((90 - lat) / 180) * (H + 120) - 60;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

function arcPath(a: [number, number], b: [number, number]): string {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2 - Math.min(120, Math.abs(a[0] - b[0]) * 0.25) - 30;
  return `M ${a[0]} ${a[1]} Q ${mx} ${my} ${b[0]} ${b[1]}`;
}

export function WorldMap({
  pins,
  lang,
  categoryLabels,
}: {
  pins: MapPin[];
  lang: string;
  categoryLabels: Record<string, string>;
}) {
  const [active, setActive] = useState<MapPin | null>(null);

  const projected = pins.map((p) => ({ pin: p, xy: project(p.lat, p.lng) }));

  // Connect a few pins with arcs for a "global network" effect.
  const arcs: string[] = [];
  for (let i = 0; i < projected.length - 1 && arcs.length < 7; i += 2) {
    arcs.push(arcPath(projected[i].xy, projected[i + 1].xy));
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy-950 bg-grid-dots">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block w-full"
        role="img"
        aria-label="World map with project locations"
      >
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="42%" r="65%">
            <stop offset="0%" stopColor="#16305F" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0A1426" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#DFC26A" stopOpacity="0" />
            <stop offset="50%" stopColor="#DFC26A" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#DFC26A" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width={W} height={H} fill="url(#mapGlow)" />

        {/* Graticule */}
        {Array.from({ length: 11 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={40 + (i * (W - 80)) / 10}
            y1={16}
            x2={40 + (i * (W - 80)) / 10}
            y2={H - 16}
            stroke="white"
            strokeOpacity={0.05}
          />
        ))}
        {Array.from({ length: 6 }, (_, i) => (
          <line
            key={`h${i}`}
            x1={40}
            y1={30 + (i * (H - 60)) / 5}
            x2={W - 40}
            y2={30 + (i * (H - 60)) / 5}
            stroke="white"
            strokeOpacity={0.05}
          />
        ))}

        {/* Network arcs */}
        {arcs.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="url(#arcGrad)" strokeWidth={1.2} />
        ))}

        {/* Pins */}
        {projected.map(({ pin, xy }) => (
          <g
            key={pin.slug}
            transform={`translate(${xy[0]}, ${xy[1]})`}
            className="cursor-pointer"
            onMouseEnter={() => setActive(pin)}
            onMouseLeave={() => setActive(null)}
          >
            <circle r={16} fill="transparent" />
            <circle r={5} fill="#DFC26A" opacity={0.35} className="animate-pin-pulse" />
            <circle r={4} fill="#DFC26A" stroke="#0A1426" strokeWidth={1.5} />
            <text
              y={-12}
              textAnchor="middle"
              className="select-none"
              fill="#C5D2E4"
              fontSize={11}
              fontWeight={600}
            >
              {pin.country}
            </text>
          </g>
        ))}
      </svg>

      {active && (
        <Link
          href={`/${lang}/projects/${active.slug}`}
          className="absolute bottom-4 left-4 right-4 mx-auto flex max-w-md items-center justify-between gap-3 rounded-xl border border-white/15 bg-navy-900/95 px-4 py-3 shadow-card backdrop-blur transition hover:border-gold-400/50"
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gold-400">
              {categoryLabels[active.category] ?? active.category} · {active.country}
            </p>
            <p className="text-sm font-semibold text-white">{active.title}</p>
          </div>
          <span className="text-gold-400">→</span>
        </Link>
      )}
    </div>
  );
}
