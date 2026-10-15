import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { company, getProduct, products } from "@/content/company";
import { getDictionary } from "@/content/dictionary";
import { JsonLd } from "@/components/JsonLd";
import { Phone, ScreenCard } from "@/components/Phone";
import { isLocale, localePath, SITE_URL } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const product = getProduct(slug);
  if (!isLocale(raw) || !product) return {};
  const copy = getDictionary(raw).products.items[product.slug];
  return pageMetadata({
    locale: raw,
    path: `/urunler/${slug}`,
    title: copy.name,
    description: copy.line,
  });
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const product = getProduct(slug);
  if (!product) notFound();
  const dict = getDictionary(raw);
  const copy = dict.products.items[product.slug];

  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: copy.name,
    applicationCategory: product.slug === "not-ortagim" ? "EducationApplication" : "BusinessApplication",
    operatingSystem: product.slug === "not-ortagim" ? "iOS" : "Web",
    url: product.href,
    description: copy.summary,
    publisher: {
      "@type": "Organization",
      name: company.legalName,
      url: SITE_URL,
    },
  };

  return (
    <div className="mx-auto grid max-w-page gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
      <JsonLd data={schema} />
      <Phone accent={product.accent} label={dict.products.placeholder}>
        <ScreenCard accent={product.accent} ink={product.ink} name={copy.name} line={copy.line} />
      </Phone>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.16em]" style={{ color: product.accent }}>{copy.badge}</p>
        <h1 className="mt-3 text-5xl font-medium tracking-tight">{copy.name}</h1>
        <p className="mt-4 text-lg text-mist">{copy.summary}</p>
        <ul className="mt-6 space-y-2 text-sm text-white/80">
          {copy.points.map((point) => (
            <li key={point}>— {point}</li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          {product.kind === "preorder" && "demo" in copy ? (
            <>
              <a href={product.href} target="_blank" rel="noreferrer" className="rounded-full bg-white px-4 py-2 text-ink">{copy.demo}</a>
              <Link href={`${localePath(raw, "/")}?konu=awyron#iletisim`} className="rounded-full border border-white/20 px-4 py-2">{copy.preorder}</Link>
            </>
          ) : (
            <a href={product.href} target="_blank" rel="noreferrer" className="rounded-full bg-white px-4 py-2 text-ink">{copy.cta}</a>
          )}
          <Link href={localePath(raw, "/urunler")} className="px-2 py-2 text-white/70 underline underline-offset-4">{dict.common.backProducts}</Link>
        </div>
      </div>
    </div>
  );
}
