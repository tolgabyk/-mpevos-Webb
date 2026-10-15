"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dictionary } from "@/content/dictionary";
import { localePath, type Locale } from "@/lib/i18n";

const KEY = "impevos-consent";

export function CookieBanner({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function choose(value: "all" | "necessary") {
    try {
      window.localStorage.setItem(KEY, value);
    } catch {
      /* storage unavailable */
    }
    document.cookie = `${KEY}=${value}; Max-Age=15552000; Path=/; SameSite=Lax`;
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4" role="dialog" aria-label={dict.meta.cookiesTitle}>
      <div className="mx-auto flex max-w-page flex-col gap-4 rounded-2xl border border-white/15 bg-[#101624]/95 p-4 shadow-glow backdrop-blur md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-relaxed text-white/80">
          {dict.cookie.text}{" "}
          <Link href={localePath(locale, "/cerez-politikasi")} className="underline underline-offset-2">
            {dict.cookie.policy}
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" className="rounded-full border border-white/20 px-4 py-2 text-sm" onClick={() => choose("necessary")}>
            {dict.cookie.reject}
          </button>
          <button type="button" className="rounded-full bg-white px-4 py-2 text-sm text-ink" onClick={() => choose("all")}>
            {dict.cookie.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
