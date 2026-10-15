import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content/dictionary";
import { getLegal } from "@/content/legal";
import { LegalDocument } from "@/components/LegalDocument";
import { isLocale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dict = getDictionary(raw);
  return pageMetadata({ locale: raw, path: "/gizlilik", title: dict.meta.privacyTitle, description: dict.meta.privacyDescription });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  return <LegalDocument doc={getLegal(raw, "gizlilik")} />;
}
