"use client";

import { useState, useRef, useEffect } from "react";
import { ShieldCheck, Calendar } from "lucide-react";
import dynamic from "next/dynamic";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";

import ChartSkeleton from "@/components/ChartSkeleton";
import MonthlySnapshot from "@/components/MonthlySnapshot";
import { data, trendFor, comparativoFor } from "@/lib/data";

const TrendChart = dynamic(() => import("@/components/TrendChart"), { ssr: false, loading: () => <ChartSkeleton /> });
const ComparisonChart = dynamic(() => import("@/components/ComparisonChart"), { ssr: false, loading: () => <ChartSkeleton height={480} /> });

const DIMENSIONS: { label: string; description: string; enabled: boolean; Icon: LucideIcon }[] = [
  { label: "Resumen Mensual", description: "Vista general · delitos de alto impacto", enabled: true, Icon: Calendar },
  { label: "Seguridad", description: "Tendencia histórica por delito", enabled: true, Icon: ShieldCheck },
];

const HEADLINE_DELITOS = [
  "Homicidio doloso",
  "Extorsión",
  "Violencia familiar",
  "Narcomenudeo",
  "Robo a casa habitación",
];

export default function Home() {
  const [selected, setSelected] = useState("Homicidio doloso");
  const [activeDimension, setActiveDimension] = useState("Resumen Mensual");
  const [showHero, setShowHero] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setDrawerOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [drawerOpen]);

  const trendRows = trendFor(selected);
  const comparativoRows = comparativoFor(selected);

  if (showHero) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-start lg:justify-center pt-24 lg:pt-0 font-sans px-10 lg:px-6" style={{ backgroundColor: "var(--page-plane)" }}>
        <div className="max-w-xl w-full text-center">
          <div className="inline-block bg-white rounded-2xl p-4 mb-8">
            <Image src="/irapuato-logo.jpg" alt="Irapuato ¿Cómo Vamos?" width={260} height={76} className="h-14 w-auto mx-auto" priority />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4" style={{ color: "var(--text-primary)" }}>
            Plataforma de Datos
          </h1>
          <p className="text-lg mb-3" style={{ color: "var(--text-secondary)" }}>
            Explora los 16 delitos de alto impacto en Irapuato: tendencia 2021–2026 y comparativo con el corredor industrial de Guanajuato.
          </p>
          <p className="text-sm mb-10" style={{ color: "var(--text-muted)" }}>
            Fuente: {data.meta.fuente} · Reporte {data.meta.reporteMes}
          </p>
          <button
            onClick={() => setShowHero(false)}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: "var(--icv-red)" }}
          >
            Explorar datos
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:flex-row lg:overflow-hidden font-sans" style={{ backgroundColor: "var(--page-plane)", color: "var(--text-primary)" }}>
      {/* Sidebar — desktop only, fixed height, does not scroll */}
      <aside className="hidden lg:flex w-72 flex-shrink-0 flex-col lg:h-screen lg:overflow-y-auto" style={{ backgroundColor: "var(--surface-1)", borderRight: "1px solid var(--border)" }}>
        <div className="px-5 py-6" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="inline-block bg-white rounded-lg p-2 cursor-pointer" onClick={() => setShowHero(true)}>
            <Image src="/irapuato-logo.jpg" alt="Irapuato ¿Cómo Vamos?" width={200} height={58} className="h-9 w-auto" />
          </div>
        </div>
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <p className="text-sm font-bold">Plataforma de Datos</p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Delitos de alto impacto · 2021–2026</p>
        </div>
        <nav className="flex-1 py-3">
          <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
            Dimensiones
          </p>
          {DIMENSIONS.map((dim) => {
            const isActive = dim.label === activeDimension;
            return (
              <button
                key={dim.label}
                disabled={!dim.enabled}
                onClick={() => dim.enabled && setActiveDimension(dim.label)}
                className="w-full text-left py-2.5 text-sm transition-all flex items-start gap-3"
                style={{
                  paddingLeft: "17px",
                  paddingRight: "20px",
                  color: isActive ? "var(--icv-red)" : dim.enabled ? "var(--text-primary)" : "var(--text-muted)",
                  cursor: dim.enabled ? "pointer" : "default",
                  backgroundColor: isActive ? "rgba(169,0,0,0.07)" : "transparent",
                  borderLeft: isActive ? "3px solid var(--icv-red)" : "3px solid transparent",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                <dim.Icon size={17} className="flex-shrink-0 mt-0.5" style={{ opacity: dim.enabled ? 1 : 0.4 }} />
                <span className="flex-1 min-w-0">
                  <span className="flex items-center justify-between gap-2">
                    {dim.label}
                    {!dim.enabled && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--gridline)", color: "var(--text-muted)" }}>
                        próx.
                      </span>
                    )}
                  </span>
                  <span className="block text-xs mt-0.5" style={{ color: isActive ? "var(--icv-red)" : "var(--text-muted)", opacity: isActive ? 0.8 : 1, fontWeight: 400 }}>
                    {dim.description}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>
        <div className="px-5 py-4" style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Conoce más en</p>
          <a href="https://irapuatocomovamos.org" target="_blank" rel="noopener noreferrer" className="text-xs font-medium hover:underline" style={{ color: "var(--icv-red)" }}>
            irapuatocomovamos.org
          </a>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3" style={{ backgroundColor: "var(--surface-1)", borderBottom: "1px solid var(--border)" }}>
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-lg p-1.5 cursor-pointer" onClick={() => setShowHero(true)}>
            <Image src="/irapuato-logo.jpg" alt="Irapuato ¿Cómo Vamos?" width={160} height={46} className="h-7 w-auto" />
          </div>
          <div>
            <p className="text-sm font-bold whitespace-nowrap">Plataforma de Datos</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>2021–2026</p>
          </div>
        </div>
        <button onClick={() => setDrawerOpen(true)} className="cursor-pointer p-2 rounded-lg">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 drawer-backdrop" style={{ backgroundColor: "rgba(0,0,0,0.4)" }} />
          <div ref={drawerRef} className="relative w-72 flex flex-col h-full drawer-slide" style={{ backgroundColor: "var(--surface-1)", boxShadow: "4px 0 24px rgba(0,0,0,0.12)" }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <p className="text-sm font-semibold">Dimensiones</p>
              <button onClick={() => setDrawerOpen(false)} className="cursor-pointer p-1" style={{ color: "var(--text-muted)" }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 py-3">
              {DIMENSIONS.map((dim) => {
                const isActive = dim.label === activeDimension;
                return (
                  <button
                    key={dim.label}
                    disabled={!dim.enabled}
                    onClick={() => { if (dim.enabled) { setActiveDimension(dim.label); setDrawerOpen(false); } }}
                    className="w-full text-left px-5 py-3 text-sm transition-all flex items-start gap-3"
                    style={{
                      color: isActive ? "var(--icv-red)" : dim.enabled ? "var(--text-primary)" : "var(--text-muted)",
                      cursor: dim.enabled ? "pointer" : "default",
                      backgroundColor: isActive ? "rgba(169,0,0,0.07)" : "transparent",
                      borderLeft: isActive ? "3px solid var(--icv-red)" : "3px solid transparent",
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    <dim.Icon size={17} className="mt-0.5" style={{ opacity: dim.enabled ? 1 : 0.4 }} />
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center justify-between gap-2">
                        {dim.label}
                        {!dim.enabled && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--gridline)", color: "var(--text-muted)" }}>
                            próx.
                          </span>
                        )}
                      </span>
                      <span className="block text-xs mt-0.5" style={{ color: isActive ? "var(--icv-red)" : "var(--text-muted)", opacity: isActive ? 0.8 : 1, fontWeight: 400 }}>
                        {dim.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main content — this is the part that scrolls on desktop */}
      <div className="flex-1 flex flex-col min-w-0 lg:h-screen lg:min-h-0 lg:overflow-y-auto">
        {activeDimension === "Seguridad" && (
          <div className="px-4 lg:px-8 pt-3 pb-0" style={{ backgroundColor: "var(--surface-1)", borderBottom: "1px solid var(--border)" }}>
            <div className="flex gap-1 mt-3 overflow-x-auto">
              {HEADLINE_DELITOS.map((d) => {
                const active = selected === d;
                return (
                  <button
                    key={d}
                    onClick={() => setSelected(d)}
                    className="px-4 py-3 text-sm font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0"
                    style={{
                      color: active ? "var(--icv-red)" : "var(--text-primary)",
                      borderBottom: active ? "2.5px solid var(--icv-red)" : "2.5px solid transparent",
                    }}
                  >
                    {d}
                  </button>
                );
              })}
              {data.delitos.filter((d) => !HEADLINE_DELITOS.includes(d)).map((d) => (
                <span
                  key={d}
                  className="px-4 py-3 text-sm font-medium whitespace-nowrap flex-shrink-0 inline-flex items-center gap-1.5"
                  style={{ color: "var(--text-muted)", borderBottom: "2.5px solid transparent", cursor: "default" }}
                >
                  {d}
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: "var(--gridline)", color: "var(--text-muted)" }}>
                    próx.
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        <main className="flex-1 px-4 lg:px-8 py-4 lg:py-6 space-y-4 lg:space-y-6">
          {activeDimension === "Seguridad" ? (
            <>
              {/* Trend chart */}
              <section className="rounded-2xl p-6" style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--border)" }}>
                <div className="mb-4">
                  <p className="text-base font-semibold">{selected}</p>
                  <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Tasa por cada 100,000 habitantes · Irapuato vs. Estado de Guanajuato · 2021–2026
                  </p>
                </div>
                <TrendChart rows={trendRows} />
                <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
                  * 2026 es acumulado enero–junio; la tasa 2026 es una proyección a 12 meses para comparar con años completos.
                </p>
              </section>

              {/* Comparison chart */}
              <section className="rounded-2xl p-6" style={{ backgroundColor: "var(--surface-1)", border: "1px solid var(--border)" }}>
                <div className="mb-4">
                  <p className="text-base font-semibold">{selected} — comparativo por ciudad</p>
                  <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Tasa por cada 100,000 habitantes · Acumulado 2026 (ene–jun) · Corredor industrial de Guanajuato + México
                  </p>
                </div>
                <ComparisonChart rows={comparativoRows} />
              </section>

              <p className="text-xs text-center pb-2" style={{ color: "var(--text-muted)" }}>
                Fuente: {data.meta.fuente}, {data.meta.reporteMes}.
              </p>
            </>
          ) : (
            <MonthlySnapshot />
          )}
        </main>
      </div>
    </div>
  );
}
