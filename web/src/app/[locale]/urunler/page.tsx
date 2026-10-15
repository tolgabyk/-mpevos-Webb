import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/content/company";
import { getDictionary } from "@/content/dictionary";
import { isLocale, localePath } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dict = getDictionary(raw);
  return pageMetadata({
    locale: raw,
    path: "/urunler",
    title: dict.meta.productsTitle,
    description: dict.meta.productsDescription,
  });
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const dict = getDictionary(raw);

  return (
    <div className="mx-auto max-w-page px-5 py-16 sm:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">{dict.products.kicker}</p>
      <h1 className="mt-3 text-5xl font-medium tracking-tight">{dict.meta.productsTitle}</h1>
      <p className="mt-4 max-w-2xl text-mist">{dict.pages.productsLead}</p>
      <div className="mt-12 grid gap-4">
        {products.map((product) => {
          const copy = dict.products.items[product.slug];
          return (
            <article key={product.slug} className="rounded-3xl border border-white/10 p-6 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: product.accent }}>{copy.badge}</p>
                <h2 className="mt-2 text-2xl">{copy.name}</h2>
                <p className="mt-2 max-w-xl text-sm text-mist">{copy.summary}</p>
              </div>
              <Link href={localePath(raw, `/urunler/${product.slug}`)} className="mt-4 inline-block text-sm underline underline-offset-4 sm:mt-0">
                {dict.common.details}
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
