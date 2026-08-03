import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { monthlySnapshot } from "@/lib/data";

function fmt(n: number): string {
  return n.toLocaleString("es-MX");
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

export default function MonthlySnapshot() {
  const { meta, rows } = monthlySnapshot;
  const disminuyeron = rows.filter((r) => (r.vsMismoMesAnioAnterior ?? 0) < 0 || (r.vsMismoMesAnioAnterior === null && r.delito === "Secuestro"));
  const aumentaron = rows.filter((r) => (r.vsMismoMesAnioAnterior ?? 0) > 0 || (r.vsMismoMesAnioAnterior === null && r.delito === "Feminicidio"));
  const igual = rows.filter((r) => r.vsMismoMesAnioAnterior === 0);

  return (
    <div className="space-y-4 lg:space-y-6">
      <section className="rounded-2xl p-6" style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--border)" }}>
        <p className="text-base font-semibold">{meta.titulo}</p>
        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
          Carpetas de investigación abiertas en el mes, comparadas contra el mismo mes del año anterior
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="rounded-xl p-4" style={{ border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--status-good)" }}>
              {meta.resumen.disminuyeron} delitos disminuyeron
            </p>
            <ul className="space-y-2 text-sm">
              {disminuyeron.map((r) => (
                <li key={r.delito} className="flex items-center justify-between gap-3">
                  <span>{r.delito}</span>
                  {r.vsMismoMesAnioAnterior === null ? (
                    <span className="inline-flex items-center gap-0.5 font-semibold" style={{ color: "var(--status-good)" }}>
                      <ArrowDown size={12} strokeWidth={2.5} /> sin casos
                    </span>
                  ) : (
                    <DeltaBadge pct={r.vsMismoMesAnioAnterior} />
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl p-4" style={{ border: "1px solid var(--border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--status-critical)" }}>
              {meta.resumen.aumentaron} delitos aumentaron
            </p>
            <ul className="space-y-2 text-sm">
              {aumentaron.map((r) => (
                <li key={r.delito} className="flex items-center justify-between gap-3">
                  <span>{r.delito}</span>
                  {r.vsMismoMesAnioAnterior === null ? (
                    <span className="inline-flex items-center gap-0.5 font-semibold" style={{ color: "var(--status-critical)" }}>
                      <ArrowUp size={12} strokeWidth={2.5} /> nuevo
                    </span>
                  ) : (
                    <DeltaBadge pct={r.vsMismoMesAnioAnterior} />
                  )}
                </li>
              ))}
            </ul>
            {igual.length > 0 && (
              <p className="text-xs mt-3 pt-3" style={{ color: "var(--text-muted)", borderTop: "1px solid var(--border)" }}>
                Sin cambio: {igual.map((r) => r.delito).join(", ")}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--border)" }}>
        <div className="p-6 pb-4">
          <p className="text-base font-semibold">Detalle por delito — {meta.mes}</p>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            Carpetas del mes y participación respecto al total del estado de Guanajuato
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
                <th className="text-left font-semibold px-6 py-2.5" style={{ color: "var(--text-muted)" }}>Delito</th>
                <th className="text-right font-semibold px-4 py-2.5" style={{ color: "var(--text-muted)" }}>Carpetas (mes)</th>
                <th className="text-right font-semibold px-4 py-2.5" style={{ color: "var(--text-muted)" }}>vs. mes anterior</th>
                <th className="text-right font-semibold px-4 py-2.5 hidden lg:table-cell" style={{ color: "var(--text-muted)" }}>vs. acumulado 2025</th>
                <th className="text-right font-semibold px-6 py-2.5 hidden lg:table-cell" style={{ color: "var(--text-muted)" }}>% del estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.delito} style={{ borderBottom: "1px solid var(--gridline)" }}>
                  <td className="px-6 py-2.5">{r.delito}</td>
                  <td className="text-right px-4 py-2.5 font-semibold">{fmt(r.carpetasMes)}</td>
                  <td className="text-right px-4 py-2.5"><DeltaBadge pct={r.vsMesAnterior} /></td>
                  <td className="text-right px-4 py-2.5 hidden lg:table-cell"><DeltaBadge pct={r.vsAcumulado} /></td>
                  <td className="text-right px-6 py-2.5 hidden lg:table-cell" style={{ color: "var(--text-secondary)" }}>
                    {r.pctEstado !== null ? `${r.pctEstado}%` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs px-6 py-4" style={{ color: "var(--text-muted)" }}>
          Fuente: Observatorio Ciudadano Irapuato ¿Cómo Vamos? — Reporte de Incidencia Delictiva, {meta.mes}.
        </p>
      </section>
    </div>
  );
}
