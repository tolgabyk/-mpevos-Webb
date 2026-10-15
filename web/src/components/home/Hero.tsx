"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { products } from "@/content/company";
import type { Dictionary } from "@/content/dictionary";
import { localePath, type Locale } from "@/lib/i18n";
import { Phone, ScreenCard } from "@/components/Phone";

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const product = products[index];
  const copy = dict.products.items[product.slug];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) setPaused(true);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % products.length), 3200);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#6d5efc]/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-24 h-80 w-80 rounded-full bg-[#3d7dff]/20 blur-3xl" />
      <div className="mx-auto grid max-w-page items-center gap-14 px-5 pb-24 pt-16 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:pt-24">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/50">{dict.hero.kicker}</p>
          <h1 id="hero-title" className="mt-5 max-w-3xl text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            {dict.hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist">{dict.hero.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`${localePath(locale, "/")}#urunler`} className="rounded-full bg-white px-5 py-3 text-sm font-medium text-ink">
              {dict.hero.primary}
            </Link>
            <Link href={`${localePath(locale, "/")}#iletisim`} className="rounded-full border border-white/20 px-5 py-3 text-sm text-white">
              {dict.hero.secondary}
            </Link>
          </div>
        </div>
        <div>
          <div className="sr-only" aria-live="polite">{dict.hero.reelLabel}: {copy.name}</div>
          <Phone accent={product.accent} label={dict.hero.placeholder}>
            <ScreenCard accent={product.accent} ink={product.ink} name={copy.name} line={copy.line} />
          </Phone>
          <div className="mt-4 flex items-center justify-center gap-3">
            {products.map((item, itemIndex) => (
              <button
                key={item.slug}
                type="button"
                aria-label={dict.products.items[item.slug].name}
                className={`h-1.5 rounded-full ${itemIndex === index ? "w-8 bg-white" : "w-3 bg-white/30"}`}
                onClick={() => setIndex(itemIndex)}
              />
            ))}
            <button type="button" className="ml-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55" onClick={() => setPaused((value) => !value)}>
              {paused ? dict.hero.play : dict.hero.pause}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
