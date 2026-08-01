"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, LabelList, ResponsiveContainer } from "recharts";
import type { ComparativoRow } from "@/lib/data";

const IRAPUATO_COLOR = "#a90000";
const OTHER_COLOR = "#c9c2b8";

type Props = {
  rows: ComparativoRow[];
};

const SHORT_LABEL: Record<string, string> = {
  "San Miguel de Allende": "SMA",
  "Guanajuato": "Gto. (Edo.)",
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ComparativoRow }>;
}) => {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  const isUp = row.yoyRatePct !== null && row.yoyRatePct > 0;
  const isDown = row.yoyRatePct !== null && row.yoyRatePct < 0;
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm"
      style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--border)", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", minWidth: 200 }}
    >
      <p className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{row.ciudad}</p>
      <div className="flex items-center justify-between gap-6">
        <span style={{ color: "var(--text-secondary)" }}>Tasa /100k</span>
        <span className="font-bold" style={{ color: row.ciudad === "Irapuato" ? IRAPUATO_COLOR : "var(--text-primary)" }}>
          {row.tasa.toFixed(1)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-6">
        <span style={{ color: "var(--text-secondary)" }}>Carpetas (2026 YTD)</span>
        <span style={{ color: "var(--text-primary)" }}>{row.carpetas.toLocaleString("es-MX")}</span>
      </div>
      {row.yoyRatePct !== null && (
        <div className="flex items-center justify-between gap-6 mt-1 pt-1" style={{ borderTop: "1px solid var(--border)" }}>
          <span style={{ color: "var(--text-secondary)" }}>vs 2025</span>
          <span className="font-semibold" style={{ color: isUp ? "var(--status-critical)" : isDown ? "var(--status-good)" : "var(--text-muted)" }}>
            {row.yoyRatePct > 0 ? "+" : ""}{row.yoyRatePct}%
          </span>
        </div>
      )}
    </div>
  );
};

export default function ComparisonChart({ rows }: Props) {
  const sorted = [...rows].sort((a, b) => b.tasa - a.tasa);
  const barSize = 28;

  return (
    <ResponsiveContainer width="100%" height={480}>
      <BarChart data={sorted} margin={{ top: 24, right: 16, left: 0, bottom: 44 }} barSize={barSize}>
        <CartesianGrid strokeDasharray="0" stroke="var(--gridline)" vertical={false} />
        <XAxis
          dataKey="ciudad"
          tickFormatter={(v: string) => SHORT_LABEL[v] ?? v}
          tick={{ fontSize: 11, fill: "var(--text-muted)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--baseline)" }}
          interval={0}
          angle={-40}
          textAnchor="end"
          height={50}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "var(--text-muted)" }}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--gridline)", opacity: 0.5 }} />
        <Bar dataKey="tasa" radius={[4, 4, 0, 0]}>
          {sorted.map((row) => (
            <Cell key={row.ciudad} fill={row.ciudad === "Irapuato" ? IRAPUATO_COLOR : OTHER_COLOR} />
          ))}
          <LabelList
            dataKey="tasa"
            position="top"
            formatter={(v: number) => v.toFixed(0)}
            content={(props) => {
              const { x, y, width, value, index } = props as { x: number; width: number; y: number; value: number; index: number };
              const row = sorted[index];
              if (row.ciudad !== "Irapuato") return null;
              return (
                <text x={x + width / 2} y={y - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={IRAPUATO_COLOR}>
                  {value.toFixed(1)}
                </text>
              );
            }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
