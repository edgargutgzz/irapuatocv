import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { monthlySnapshot } from "@/lib/data";

function fmt(n: number): string {
  return n.toLocaleString("es-MX");
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function fmtMes(mes: string): string {
  const [year, month] = mes.split("-");
  return `${MESES[Number(month) - 1]} ${year}`;
}

function DeltaBadge({ pct }: { pct: number | null }) {
  if (pct === null) return <span style={{ color: "var(--text-muted)" }}>—</span>;
  const isUp = pct > 0;
  const isDown = pct < 0;
  const color = isUp ? "var(--status-critical)" : isDown ? "var(--status-good)" : "var(--text-muted)";
  const Icon = isUp ? ArrowUp : isDown ? ArrowDown : Minus;
  return (
    <span className="inline-flex items-center gap-0.5 font-semibold" style={{ color }}>
      <Icon size={12} strokeWidth={2.5} />
      {Math.abs(pct)}%
    </span>
  );
}

function BarRow({
  label,
  carpetas,
  pct,
  maxAbs,
  color,
  fallbackLabel,
  fallbackIcon: FallbackIcon,
}: {
  label: string;
  carpetas: number;
  pct: number | null;
  maxAbs: number;
  color: string;
  fallbackLabel: string;
  fallbackIcon: typeof ArrowUp;
}) {
  const widthPct = pct === null ? 18 : Math.max(6, (Math.abs(pct) / maxAbs) * 100);
  return (
    <li className="relative rounded-lg overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 rounded-lg"
        style={{ width: `${widthPct}%`, backgroundColor: color, opacity: 0.13 }}
      />
      <div className="relative flex items-center justify-between gap-3 px-3 py-2">
        <span className="min-w-0">
          <span className="block text-sm truncate">{label}</span>
          <span className="block text-xs" style={{ color: "var(--text-muted)" }}>
            {fmt(carpetas)} carpetas
          </span>
        </span>
        {pct === null ? (
          <span className="inline-flex items-center gap-0.5 text-sm font-semibold flex-shrink-0" style={{ color }}>
            <FallbackIcon size={12} strokeWidth={2.5} /> {fallbackLabel}
          </span>
        ) : (
          <span className="flex-shrink-0"><DeltaBadge pct={pct} /></span>
        )}
      </div>
    </li>
  );
}

export default function MonthlySnapshot() {
  const { meta, rows } = monthlySnapshot;
  const disminuyeron = rows.filter((r) => (r.vsMismoMesAnioAnterior ?? 0) < 0 || (r.vsMismoMesAnioAnterior === null && r.delito === "Secuestro"));
  const aumentaron = rows.filter((r) => (r.vsMismoMesAnioAnterior ?? 0) > 0 || (r.vsMismoMesAnioAnterior === null && r.delito === "Feminicidio"));
  const igual = rows.filter((r) => r.vsMismoMesAnioAnterior === 0);
  const clasificados = new Set([...disminuyeron, ...aumentaron, ...igual].map((r) => r.delito));
  const sinActividad = rows.filter((r) => !clasificados.has(r.delito));
  const disminuyeronMax = Math.max(...disminuyeron.map((r) => Math.abs(r.vsMismoMesAnioAnterior ?? 0)), 1);
  const aumentaronMax = Math.max(...aumentaron.map((r) => Math.abs(r.vsMismoMesAnioAnterior ?? 0)), 1);

  return (
    <div className="space-y-4 lg:space-y-6">
      <section className="rounded-2xl p-6" style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--border)" }}>
        <p className="text-base font-semibold">{meta.titulo}</p>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          Carpetas de investigación abiertas en el <strong style={{ color: "var(--text-secondary)" }}>municipio de Irapuato</strong>, comparadas contra el mismo mes del año anterior
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="rounded-xl p-4" style={{ border: "1px solid var(--border)" }}>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold" style={{ color: "var(--status-good)" }}>{meta.resumen.disminuyeron}</span>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                delitos disminuyeron
              </span>
            </div>
            <ul className="space-y-1">
              {disminuyeron.map((r) => (
                <BarRow
                  key={r.delito}
                  label={r.delito}
                  carpetas={r.carpetasMes}
                  pct={r.vsMismoMesAnioAnterior}
                  maxAbs={disminuyeronMax}
                  color="var(--status-good)"
                  fallbackLabel="disminución"
                  fallbackIcon={ArrowDown}
                />
              ))}
            </ul>
          </div>
          <div className="rounded-xl p-4" style={{ border: "1px solid var(--border)" }}>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold" style={{ color: "var(--status-critical)" }}>{meta.resumen.aumentaron}</span>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                delitos aumentaron
              </span>
            </div>
            <ul className="space-y-1">
              {aumentaron.map((r) => (
                <BarRow
                  key={r.delito}
                  label={r.delito}
                  carpetas={r.carpetasMes}
                  pct={r.vsMismoMesAnioAnterior}
                  maxAbs={aumentaronMax}
                  color="var(--status-critical)"
                  fallbackLabel="aumento"
                  fallbackIcon={ArrowUp}
                />
              ))}
            </ul>
            {igual.length > 0 && (
              <p className="text-xs mt-3 pt-3" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
                Sin cambio: {igual.map((r) => r.delito).join(", ")}
              </p>
            )}
          </div>
          <div className="rounded-xl p-4" style={{ border: "1px solid var(--border)" }}>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-3xl font-bold" style={{ color: "var(--text-muted)" }}>{sinActividad.length}</span>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                sin actividad
              </span>
            </div>
            <ul className="space-y-2 text-sm">
              {sinActividad.map((r) => (
                <li key={r.delito} className="flex items-center justify-between gap-3">
                  <span style={{ color: "var(--text-secondary)" }}>{r.delito}</span>
                  <span className="inline-flex items-center gap-0.5 font-semibold" style={{ color: "var(--text-muted)" }}>
                    <Minus size={12} strokeWidth={2.5} /> sin casos
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs mt-3 pt-3" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
              Sin carpetas registradas en junio 2025 ni junio 2026
            </p>
          </div>
        </div>

        <p className="text-xs text-center mt-6" style={{ color: "var(--text-muted)" }}>
          Una carpeta de investigación es un caso nuevo abierto por la Fiscalía en ese mes — no el total de casos que siguen activos de meses anteriores.
          <br />
          Fuente: Observatorio Ciudadano Irapuato ¿Cómo Vamos? — Reporte de Incidencia Delictiva, {fmtMes(meta.mes)}.
        </p>
      </section>
    </div>
  );
}
