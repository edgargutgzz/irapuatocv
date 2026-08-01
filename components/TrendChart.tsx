"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { AnnualRow } from "@/lib/data";

const COLORS = {
  Irapuato: "#a90000",
  Guanajuato: "#8b847c",
};

const LABELS: Record<string, string> = {
  Irapuato: "Irapuato",
  Guanajuato: "Estado de Guanajuato",
};

type Props = {
  rows: AnnualRow[];
};

type CustomTooltipPayload = {
  name: string;
  value: number;
  color: string;
  payload: Record<string, number>;
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: CustomTooltipPayload[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm"
      style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--border)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", minWidth: 220 }}
    >
      <p className="font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
        {label}
        {label === "2026" && <span style={{ color: "var(--text-muted)" }}> (parcial, ene–jun)</span>}
      </p>
      {payload.map((entry) => {
        const carpetasKey = `${entry.name}__carpetas`;
        const carpetas = entry.payload[carpetasKey];
        return (
          <div key={entry.name} className="flex items-center justify-between gap-6 mb-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
              <span style={{ color: "var(--text-primary)" }}>{LABELS[entry.name] ?? entry.name}</span>
            </div>
            <span className="font-bold text-right" style={{ color: entry.color }}>
              {entry.value.toFixed(1)}
              <span className="font-normal text-xs" style={{ color: "var(--text-muted)" }}> /100k</span>
              {carpetas !== undefined && (
                <span className="block text-xs font-normal" style={{ color: "var(--text-muted)" }}>
                  {carpetas.toLocaleString("es-MX")} carpetas
                </span>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default function TrendChart({ rows }: Props) {
  const years = [2021, 2022, 2023, 2024, 2025, 2026];
  const chartData = years.map((year) => {
    const point: Record<string, number | string> = { year: String(year) };
    for (const geo of ["Guanajuato", "Irapuato"] as const) {
      const row = rows.find((r) => r.year === year && r.geografia === geo);
      if (row) {
        point[geo] = row.tasa;
        point[`${geo}__carpetas`] = row.carpetas;
      }
    }
    return point;
  });

  const allValues = chartData.flatMap((d) =>
    (["Guanajuato", "Irapuato"] as const)
      .map((g) => d[g])
      .filter((v): v is number => typeof v === "number")
  );
  const maxVal = allValues.length ? Math.max(...allValues) : 100;
  const yMax = Math.ceil((maxVal + maxVal * 0.15) / 10) * 10;

  return (
    <ResponsiveContainer width="100%" height={420}>
      <LineChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 16 }}>
        <CartesianGrid strokeDasharray="0" stroke="var(--gridline)" vertical={false} />
        <XAxis
          dataKey="year"
          tick={{ fontSize: 12, fill: "var(--text-muted)", dy: 10 }}
          tickLine={false}
          axisLine={{ stroke: "var(--baseline)" }}
        />
        <YAxis
          domain={[0, yMax]}
          tick={{ fontSize: 12, fill: "var(--text-muted)" }}
          tickLine={false}
          axisLine={false}
          width={46}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => (
            <span style={{ color: "var(--text-primary)" }}>{LABELS[value] ?? value}</span>
          )}
        />
        <Line
          type="monotone"
          dataKey="Guanajuato"
          stroke={COLORS.Guanajuato}
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2, stroke: "var(--surface-1)", fill: COLORS.Guanajuato }}
          activeDot={{ r: 6, strokeWidth: 2, stroke: "var(--surface-1)" }}
        />
        <Line
          type="monotone"
          dataKey="Irapuato"
          stroke={COLORS.Irapuato}
          strokeWidth={2}
          dot={{ r: 4, strokeWidth: 2, stroke: "var(--surface-1)", fill: COLORS.Irapuato }}
          activeDot={{ r: 6, strokeWidth: 2, stroke: "var(--surface-1)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
