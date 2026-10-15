import { notFound } from "next/navigation";
import { company } from "@/content/company";
import { getDictionary } from "@/content/dictionary";
import { CookieBanner } from "@/components/CookieBanner";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { isLocale, SITE_URL, type Locale } from "@/lib/i18n";

export function generateStaticParams() {
  return [{ locale: "tr" }, { locale: "en" }];
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/impevos-logo.svg`,
    email: company.email,
    foundingDate: "2026",
    address: {
      "@type": "PostalAddress",
      addressLocality: "İstanbul",
      addressCountry: "TR",
    },
    sameAs: [company.linkedin, company.instagram],
  };

  return (
    <>
      <JsonLd data={organization} />
      <a className="skip-link" href="#icerik">{dict.a11y.skip}</a>
      <Header locale={locale} dict={dict} />
      <main id="icerik">{children}</main>
      <Footer locale={locale} dict={dict} />
      <CookieBanner locale={locale} dict={dict} />
    </>
  );
}
