import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content/dictionary";
import { getLegal } from "@/content/legal";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { LegalDocument } from "@/components/LegalDocument";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dict = getDictionary(raw);
  return pageMetadata({ locale: raw, path: "/kvkk", title: dict.meta.kvkkTitle, description: dict.meta.kvkkDescription });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  return <LegalDocument doc={getLegal(raw, "kvkk")} />;
}
