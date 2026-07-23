"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  CartesianGrid,
} from "recharts";
import { formatUsdCompact } from "@/lib/utils";

// Chart palette validated with the dataviz six-checks script (light surface):
// data blue #2E5FA3, data gold #A17E25 — both pass lightness band, chroma
// floor, CVD separation and 3:1 contrast.
const DATA_BLUE = "#2E5FA3";

export type BarRow = { label: string; value: number };

/**
 * Single-measure horizontal bar chart: one hue (identity lives in the row
 * labels), thin rounded marks, recessive grid, direct value labels, hover
 * tooltip. Used for financial profiles and per-project view counts.
 */
export function HorizontalBars({
  rows,
  format = "usd",
  height,
}: {
  rows: BarRow[];
  format?: "usd" | "number";
  height?: number;
}) {
  const fmt = (v: number) =>
    format === "usd" ? formatUsdCompact(v) : v.toLocaleString("en-US");

  return (
    <div style={{ width: "100%", height: height ?? rows.length * 44 + 24 }}>
      <ResponsiveContainer>
        <BarChart
          data={rows}
          layout="vertical"
          margin={{ top: 4, right: 84, bottom: 4, left: 8 }}
        >
          <CartesianGrid horizontal={false} stroke="#E4EAF3" strokeWidth={1} />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={150}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#4A6997", fontSize: 12, fontWeight: 600 }}
          />
          <Tooltip
            cursor={{ fill: "rgba(10, 20, 38, 0.04)" }}
            formatter={(value) => [fmt(Number(value)), ""]}
            separator=""
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #E4EAF3",
              boxShadow: "0 4px 16px rgba(10,20,38,0.08)",
              fontSize: 12,
            }}
          />
          <Bar dataKey="value" fill={DATA_BLUE} barSize={16} radius={[0, 4, 4, 0]}>
            <LabelList
              dataKey="value"
              position="right"
              formatter={(v) => fmt(Number(v))}
              style={{ fill: "#122039", fontSize: 12, fontWeight: 700 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
