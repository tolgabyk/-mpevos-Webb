import type { MetadataRoute } from "next";
import { products } from "@/content/company";
import { listSlugs } from "@/lib/blog";
import { absoluteUrl, type Locale } from "@/lib/i18n";

const paths = ["/", "/urunler", "/blog", "/basin-kiti", "/kvkk", "/gizlilik", "/cerez-politikasi"];

export default function sitemap(): MetadataRoute.Sitemap {
  const locales: Locale[] = ["tr", "en"];
  const productPaths = products.map((product) => `/urunler/${product.slug}`);
  const postPaths = listSlugs().map((slug) => `/blog/${slug}`);
  const all = [...paths, ...productPaths, ...postPaths];

  return all.flatMap((path) =>
    locales.map((locale) => ({
      url: absoluteUrl(locale, path),
      lastModified: new Date("2026-10-15"),
      alternates: {
        languages: {
          tr: absoluteUrl("tr", path),
          en: absoluteUrl("en", path),
        },
      },
    })),
  );
}
