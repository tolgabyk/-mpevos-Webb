import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { headers } from "next/headers";
import { metadataBase } from "@/lib/seo";
import "./globals.css";

const sans = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase,
  title: "IMPEVOS | Yapay Zeka ve Yazılım Çözümleri",
  description: "IMPEVOS A.Ş., yapay zeka destekli ürünler geliştirir ve işletmelerin süreçlerini otomatikleştirir.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const lang = headerList.get("x-locale") === "en" ? "en" : "tr";

  return (
    <html lang={lang} className={`${sans.variable} ${mono.variable}`}>
      <body className="bg-ink font-sans text-white antialiased">{children}</body>
    </html>
  );
}
