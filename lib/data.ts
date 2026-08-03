import raw from "@/data/crime-data.json";
import monthlyRaw from "@/data/monthly-snapshot.json";

export type AnnualRow = {
  delito: string;
  geografia: "Guanajuato" | "Irapuato";
  year: number;
  carpetas: number;
  tasa: number;
  partial: boolean;
};

export type ComparativoRow = {
  delito: string;
  ciudad: string;
  carpetas: number;
  tasa: number;
  yoyRatePct: number | null;
};

export type CrimeData = {
  meta: {
    fuente: string;
    reporteMes: string;
    sourceUrl: string;
    notas: Record<string, string>;
  };
  delitos: string[];
  geografias: string[];
  ciudadesComparativo: string[];
  annual: AnnualRow[];
  comparativo2026: ComparativoRow[];
};

export const data = raw as CrimeData;

export function trendFor(delito: string): AnnualRow[] {
  return data.annual.filter((r) => r.delito === delito);
}

export function comparativoFor(delito: string): ComparativoRow[] {
  return data.comparativo2026.filter((r) => r.delito === delito);
}

export function irapuato2026(delito: string): ComparativoRow | undefined {
  return data.comparativo2026.find((r) => r.delito === delito && r.ciudad === "Irapuato");
}

export type MonthlySnapshotRow = {
  delito: string;
  carpetasMes: number;
  victimasMes: number | null;
  vsMismoMesAnioAnterior: number | null;
  vsMesAnterior: number | null;
  vsAcumulado: number | null;
  pctEstado: number | null;
  estadoBucket: "encima" | "similar" | "debajo" | null;
  nota?: string;
};

export type MonthlySnapshot = {
  meta: {
    mes: string;
    titulo: string;
    sourceUrl: string;
    resumen: { disminuyeron: number; aumentaron: number; igual: number };
  };
  rows: MonthlySnapshotRow[];
};

export const monthlySnapshot = monthlyRaw as MonthlySnapshot;
