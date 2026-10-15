"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/content/dictionary";
import { localePath, type Locale } from "@/lib/i18n";

const links = [
  ["products", "/#urunler"],
  ["services", "/#hizmetler"],
  ["story", "/#hikaye"],
  ["team", "/#ekip"],
  ["career", "/#kariyer"],
  ["blog", "/blog"],
  ["contact", "/#iletisim"],
] as const;

function publicPath(pathname: string) {
  if (pathname === "/tr") return "/";
  if (pathname.startsWith("/tr/")) return pathname.slice(3);
  return pathname || "/";
}

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = publicPath(usePathname() || "/");
  const [open, setOpen] = useState(false);
  const home = localePath(locale, "/");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const bare = pathname.replace(/^\/en/, "") || "/";
  const trHref = bare;
  const enHref = bare === "/" ? "/en" : `/en${bare}`;

  function hrefFor(path: string) {
    if (path.startsWith("/#")) return `${home}#${path.slice(2)}`;
    return localePath(locale, path);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#070b14]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-5 sm:px-8">
        <Link href={home} className="flex items-center gap-2 text-sm font-semibold tracking-[0.18em]" aria-label={dict.a11y.home}>
          <Mark />
          IMPEVOS
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-white/75 lg:flex" aria-label={dict.nav.primary}>
          {links.map(([key, path]) => (
            <Link key={key} href={hrefFor(path)} className="transition hover:text-white">
              {dict.nav[key]}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-full border border-white/15 p-0.5 font-mono text-[11px]" role="navigation" aria-label={dict.a11y.language}>
            <Link
              href={trHref}
              hrefLang="tr"
              className={`rounded-full px-2.5 py-1 ${locale === "tr" ? "bg-white text-ink" : "text-white/70"}`}
              aria-current={locale === "tr" ? "true" : undefined}
            >
              TR
            </Link>
            <Link
              href={enHref}
              hrefLang="en"
              className={`rounded-full px-2.5 py-1 ${locale === "en" ? "bg-white text-ink" : "text-white/70"}`}
              aria-current={locale === "en" ? "true" : undefined}
            >
              EN
            </Link>
          </div>
          <button
            type="button"
            className="rounded-full border border-white/15 px-3 py-1.5 text-sm lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? dict.nav.close : dict.nav.menu}
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" className="border-t border-white/10 px-5 py-4 lg:hidden" aria-label={dict.nav.primary}>
          <ul className="grid gap-1">
            {links.map(([key, path]) => (
              <li key={key}>
                <Link href={hrefFor(path)} className="block rounded-xl px-3 py-3 text-lg hover:bg-white/5" onClick={() => setOpen(false)}>
                  {dict.nav[key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

function Mark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <rect x="1" y="3" width="11" height="4" rx="1" fill="#7c6cff" />
      <rect x="6" y="10" width="11" height="4" rx="1" fill="#4c8dff" />
    </svg>
  );
}
