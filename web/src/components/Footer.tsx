import Link from "next/link";
import { company } from "@/content/company";
import type { Dictionary } from "@/content/dictionary";
import { localePath, type Locale } from "@/lib/i18n";

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const year = new Date().getFullYear();
  const home = localePath(locale, "/");

  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto grid max-w-page gap-10 px-5 py-14 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <p className="text-sm font-semibold tracking-[0.18em]">IMPEVOS</p>
          <p className="mt-3 text-sm leading-relaxed text-mist">{dict.footer.blurb}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">{dict.footer.products}</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link href={localePath(locale, "/urunler/not-ortagim")}>Not Ortağım</Link></li>
            <li><Link href={localePath(locale, "/urunler/inffy")}>İnffy</Link></li>
            <li><Link href={localePath(locale, "/urunler/awyron-ai")}>Awyron AI</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">{dict.footer.company}</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link href={`${home}#kariyer`}>{dict.nav.career}</Link></li>
            <li><Link href={localePath(locale, "/blog")}>{dict.nav.blog}</Link></li>
            <li><Link href={localePath(locale, "/basin-kiti")}>{dict.meta.pressTitle}</Link></li>
            <li><Link href={`${home}#iletisim`}>{dict.nav.contact}</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">{dict.footer.legal}</p>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link href={localePath(locale, "/kvkk")}>{dict.meta.kvkkTitle}</Link></li>
            <li><Link href={localePath(locale, "/gizlilik")}>{dict.meta.privacyTitle}</Link></li>
            <li><Link href={localePath(locale, "/cerez-politikasi")}>{dict.meta.cookiesTitle}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-page flex-col gap-4 px-5 py-6 text-sm text-mist sm:px-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-white">{company.legalName}</p>
            <p className="mt-1">{company.addressPlaceholder[locale]}</p>
            <p className="mt-3">© {year} {company.legalName}. {dict.footer.rights}</p>
          </div>
          <div className="flex gap-4">
            <a href={company.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">LinkedIn</a>
            <a href={company.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
