import { ArrowUp, ArrowDown, Minus } from "lucide-react";

type Props = {
  label: string;
  value: string;
  deltaPct: number | null;
  deltaNote?: string;
};

export default function StatTile({ label, value, deltaPct, deltaNote }: Props) {
  const isUp = deltaPct !== null && deltaPct > 0;
  const isDown = deltaPct !== null && deltaPct < 0;
  const color = isUp ? "var(--status-critical)" : isDown ? "var(--status-good)" : "var(--text-muted)";
  const Icon = isUp ? ArrowUp : isDown ? ArrowDown : Minus;

  return (
    <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--border)" }}>
      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <div className="flex items-end justify-between gap-2">
        <p className="text-2xl font-semibold" style={{ color: "var(--text-primary)" }}>{value}</p>
        {deltaPct !== null && (
          <span className="flex items-center gap-0.5 text-sm font-semibold mb-1" style={{ color }}>
            <Icon size={14} strokeWidth={2.5} />
            {Math.abs(deltaPct)}%
          </span>
        )}
      </div>
      {deltaNote && <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{deltaNote}</p>}
    </div>
  );
}
