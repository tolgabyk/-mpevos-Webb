import type { Metadata } from "next";
import { absoluteUrl, SITE_URL, type Locale } from "@/lib/i18n";

type MetaInput = {
  locale: Locale;
  path: string;
  description: string;
  title?: string;
  absoluteTitle?: string;
};

export function pageMetadata({ locale, path, description, title, absoluteTitle }: MetaInput): Metadata {
  const canonical = absoluteUrl(locale, path);
  const heading = absoluteTitle ?? `${title} | IMPEVOS`;

  return {
    title: absoluteTitle ? { absolute: absoluteTitle } : title,
    description,
    alternates: {
      canonical,
      languages: {
        "tr-TR": absoluteUrl("tr", path),
        en: absoluteUrl("en", path),
        "x-default": absoluteUrl("tr", path),
      },
    },
    openGraph: {
      title: heading,
      description,
      url: canonical,
      siteName: "IMPEVOS",
      locale: locale === "tr" ? "tr_TR" : "en_US",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "IMPEVOS" }],
    },
    twitter: {
      card: "summary_large_image",
      title: heading,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export const metadataBase = new URL(SITE_URL);
