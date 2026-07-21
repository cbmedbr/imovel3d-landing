import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Imóvel 3D — Tours Virtuais para Corretoras",
  description:
    "Venda imóveis antes de construir. Tours virtuais 3D interativos que rodam no navegador, sem app e sem download.",
  keywords: [
    "tour virtual",
    "imóvel 3D",
    "corretora",
    "imobiliária",
    "maquete digital",
    "WebGL",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-slate-950 text-white font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
