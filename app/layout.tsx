import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: "Plataforma de Datos — Irapuato ¿Cómo Vamos?",
  description:
    "Explorador interactivo de incidencia delictiva en Irapuato — 16 delitos de alto impacto, 2021–2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${rubik.variable} antialiased`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
